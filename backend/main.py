import os
import re
import json
import glob
import asyncio
from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import init_db, get_db, SessionLocal, Post, AIQueue, AILog, AISetting
from agents.ai_engine import (
    execute_topic_pipeline,
    discover_trends,
    add_log,
    call_llm,
)

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
IMAGES_DIR = PUBLIC_DIR / "images"
ADMIN_UI_DIR = BASE_DIR / "admin-ui"

PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
ADMIN_UI_DIR.mkdir(parents=True, exist_ok=True)


# ── SEED INITIAL DATA (Existing 5 Blogs + Queue) ──────────────────────────────
def seed_initial_data():
    db = SessionLocal()
    try:
        # Seed initial queue items from ai-config.json if table is empty
        if db.query(AIQueue).count() == 0:
            config_file = BASE_DIR.parent / "frontend" / "data" / "ai-config.json"
            if config_file.exists():
                try:
                    data = json.loads(config_file.read_text(encoding="utf-8"))
                    for q in data.get("queue", []):
                        item = AIQueue(
                            id=q.get("id"),
                            topic=q.get("topic"),
                            category=q.get("category", "tech-ai"),
                            status=q.get("status", "pending"),
                            source=q.get("source", "manual"),
                            original_headline=q.get("originalHeadline"),
                            published_slug=q.get("publishedSlug"),
                            seo_score=q.get("seoScore"),
                            audit_notes=q.get("auditNotes"),
                            error=q.get("error"),
                            created_at=q.get("createdAt", datetime.now(timezone.utc).isoformat()),
                        )
                        db.add(item)
                    db.commit()
                    print("[Database] ✓ Successfully migrated topic queue to PostgreSQL!")
                except Exception as e:
                    print(f"Queue seed note: {e}")
    finally:
        db.close()


# ── BACKGROUND SCHEDULER (2x Daily Autopilot) ─────────────────────────────────
async def autopilot_scheduler_loop():
    print("[Scheduler] ✦ 24/7 Autopilot Background Scheduler Initialized.")
    while True:
        try:
            await asyncio.sleep(30)
            db = SessionLocal()
            setting = db.query(AISetting).filter_by(id=1).first()
            if setting and setting.autopilot:
                now = datetime.now()
                current_time = now.strftime("%H:%M")
                today_date = now.strftime("%Y-%m-%d")

                morning_slot = setting.morning_time or "09:00"
                evening_slot = setting.evening_time or "19:00"

                slot_to_trigger = None
                morning_key = f"{today_date}_morning"
                evening_key = f"{today_date}_evening"

                if current_time == morning_slot and setting.last_slot_run != morning_key:
                    slot_to_trigger = morning_key
                elif current_time == evening_slot and setting.last_slot_run != evening_key:
                    slot_to_trigger = evening_key

                if slot_to_trigger:
                    pending_item = db.query(AIQueue).filter_by(status="pending").first()
                    if pending_item:
                        add_log(f'[Scheduler Alarm] Slot "{slot_to_trigger}" triggered! Starting automated pipeline for topic: "{pending_item.topic}"')
                        setting.last_slot_run = slot_to_trigger
                        db.commit()
                        db.close()
                        execute_topic_pipeline(pending_item.id)
                    else:
                        add_log(f'[Scheduler Warning] Slot "{slot_to_trigger}" arrived, but the topic queue is empty!', 'warning')
                        setting.last_slot_run = slot_to_trigger
                        db.commit()
            db.close()
        except Exception as e:
            print(f"[Scheduler Cycle Error] {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed_initial_data()
    scheduler_task = asyncio.create_task(autopilot_scheduler_loop())
    yield
    scheduler_task.cancel()


# ── FASTAPI APPLICATION ───────────────────────────────────────────────────────
app = FastAPI(title="TheDriftHub AI Backend", lifespan=lifespan)

# Allow requests from Next.js (port 3000) and Vercel production domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts
app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")


# ── POSTS ENDPOINTS ───────────────────────────────────────────────────────────
class PostCreate(BaseModel):
    title: str
    description: str
    content: Optional[str] = None
    body: Optional[str] = None
    category: str = "tech-ai"
    tags: List[str] = []
    image: Optional[str] = "/images/hero-img-2-1781883683283.jpg"
    imageAlt: Optional[str] = ""
    author: Optional[str] = "TheDriftHub Editorial"
    authorImage: Optional[str] = "/images/logo.png"
    featured: bool = False
    trending: bool = False
    weeklyHighlight: bool = False
    draft: bool = False
    slug: Optional[str] = None
    newSlug: Optional[str] = None
    pubDate: Optional[str] = None


@app.get("/api/posts")
def get_posts(
    category: Optional[str] = None,
    draft: Optional[bool] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    query = db.query(Post)
    if draft is not None:
        query = query.filter(Post.draft == draft)
    if category:
        query = query.filter(Post.category == category)
    posts = query.order_by(Post.created_at.desc()).offset(offset).limit(limit).all()
    return [p.to_dict() for p in posts]


@app.get("/api/posts/{slug}")
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    p = db.query(Post).filter(Post.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    return p.to_dict()


@app.post("/api/posts")
def create_or_update_post(payload: PostCreate, db: Session = Depends(get_db)):
    slug = payload.newSlug or payload.slug or re.sub(r"[^a-z0-9]+", "-", payload.title.lower()).strip("-")
    p = db.query(Post).filter(Post.slug == slug).first()
    article_content = payload.body if payload.body is not None else (payload.content or "")

    if p:
        p.title = payload.title
        p.description = payload.description
        p.content = article_content
        p.category = payload.category
        p.tags = payload.tags
        p.image = payload.image or p.image
        p.image_alt = payload.imageAlt or payload.title
        p.author = payload.author or p.author
        p.author_image = payload.authorImage or p.author_image
        p.featured = payload.featured
        p.trending = payload.trending
        p.weekly_highlight = payload.weeklyHighlight
        p.draft = payload.draft
        if payload.pubDate:
            p.pub_date = payload.pubDate
    else:
        p = Post(
            slug=slug,
            title=payload.title,
            description=payload.description,
            content=article_content,
            category=payload.category,
            tags=payload.tags,
            image=payload.image or "/images/hero-img-2-1781883683283.jpg",
            image_alt=payload.imageAlt or payload.title,
            author=payload.author or "TheDriftHub Editorial",
            author_image=payload.authorImage or "/images/logo.png",
            featured=payload.featured,
            trending=payload.trending,
            weekly_highlight=payload.weeklyHighlight,
            draft=payload.draft,
            pub_date=payload.pubDate or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        )
        db.add(p)

    db.commit()
    db.refresh(p)
    return p.to_dict()


@app.put("/api/posts/{slug}")
def update_post_by_slug(slug: str, payload: PostCreate, db: Session = Depends(get_db)):
    p = db.query(Post).filter(Post.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")

    target_slug = payload.newSlug or payload.slug or slug
    if target_slug != slug:
        existing = db.query(Post).filter(Post.slug == target_slug).first()
        if existing and existing.id != p.id:
            raise HTTPException(status_code=400, detail="Slug already in use")
        p.slug = target_slug

    p.title = payload.title
    p.description = payload.description
    article_content = payload.body if payload.body is not None else payload.content
    if article_content is not None:
        p.content = article_content
    p.category = payload.category
    p.tags = payload.tags
    p.image = payload.image or p.image
    p.image_alt = payload.imageAlt or payload.title
    p.author = payload.author or p.author
    p.author_image = payload.authorImage or p.author_image
    p.featured = payload.featured
    p.trending = payload.trending
    p.weekly_highlight = payload.weeklyHighlight
    p.draft = payload.draft
    if payload.pubDate:
        p.pub_date = payload.pubDate

    db.commit()
    db.refresh(p)
    return p.to_dict()


@app.delete("/api/posts/{slug}")
def delete_post(slug: str, db: Session = Depends(get_db)):
    p = db.query(Post).filter(Post.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(p)
    db.commit()
    return {"success": True, "message": "Post deleted"}


# ── AI ENGINE ENDPOINTS ───────────────────────────────────────────────────────
@app.get("/api/ai/status")
def get_ai_status(db: Session = Depends(get_db)):
    setting = db.query(AISetting).filter_by(id=1).first()
    queue = db.query(AIQueue).order_by(AIQueue.created_at.desc()).all()
    logs = db.query(AILog).order_by(AILog.id.desc()).limit(100).all()
    logs.reverse()

    return {
        "settings": setting.to_dict() if setting else {},
        "queue": [q.to_dict() for q in queue],
        "logs": [l.to_dict() for l in logs],
        "stats": {
            "totalGenerated": setting.total_generated if setting else 0,
            "lastRunAt": setting.last_run_at if setting else None,
            "lastSlotRun": setting.last_slot_run if setting else None,
        },
    }


class QueueTopicsRequest(BaseModel):
    topics: List[str]
    category: str = "tech-ai"


@app.post("/api/ai/queue")
def add_topics_to_queue(payload: QueueTopicsRequest, db: Session = Depends(get_db)):
    new_items = []
    valid_category = payload.category if payload.category in ["tech-ai", "memes-trends", "creators", "movies-ott"] else "tech-ai"

    for raw in payload.topics:
        trimmed = raw.strip()
        if not trimmed:
            continue
        qid = f"topic-{int(datetime.now().timestamp() * 1000)}-{os.urandom(3).hex()}"
        item = AIQueue(
            id=qid,
            topic=trimmed,
            category=valid_category,
            status="pending",
        )
        db.add(item)
        new_items.append(item.to_dict())

    db.commit()
    add_log(f'Added {len(new_items)} new topic(s) to queue under "{valid_category}".')
    queue = db.query(AIQueue).order_by(AIQueue.created_at.desc()).all()
    return {"success": True, "added": len(new_items), "queue": [q.to_dict() for q in queue], "items": new_items}


@app.post("/api/ai/generate/{id}")
def generate_topic_now(id: str):
    add_log(f"[Manual Trigger] User requested instant execution for topic ID: {id}")
    result = execute_topic_pipeline(id)
    return {"success": True, "result": result}


@app.post("/api/ai/discover-trends")
def trigger_trend_discovery():
    result = discover_trends()
    return {"success": True, **result}


class SettingsUpdate(BaseModel):
    autopilot: Optional[bool] = None
    morningTime: Optional[str] = None
    eveningTime: Optional[str] = None
    provider: Optional[str] = None
    model: Optional[str] = None
    apiKey: Optional[str] = None


@app.post("/api/ai/settings")
def update_ai_settings(payload: SettingsUpdate, db: Session = Depends(get_db)):
    setting = db.query(AISetting).filter_by(id=1).first()
    if not setting:
        setting = AISetting(id=1)
        db.add(setting)

    if payload.autopilot is not None:
        setting.autopilot = payload.autopilot
    if payload.morningTime is not None:
        setting.morning_time = payload.morningTime
    if payload.eveningTime is not None:
        setting.evening_time = payload.eveningTime
    if payload.provider is not None:
        setting.provider = payload.provider
    if payload.model is not None:
        setting.model = payload.model
    if payload.apiKey is not None:
        setting.api_key = payload.apiKey

    db.commit()
    add_log("Schedule & AI settings updated successfully.", "success")
    return {"success": True, "settings": setting.to_dict()}


@app.post("/api/ai/clear-completed")
def clear_completed_queue(db: Session = Depends(get_db)):
    db.query(AIQueue).filter(AIQueue.status.in_(["published", "failed"])).delete(synchronize_session=False)
    db.commit()
    queue = db.query(AIQueue).order_by(AIQueue.created_at.desc()).all()
    return {"success": True, "queue": [q.to_dict() for q in queue]}


@app.delete("/api/ai/queue/{id}")
def delete_queue_item(id: str, db: Session = Depends(get_db)):
    item = db.query(AIQueue).filter_by(id=id).first()
    if item:
        db.delete(item)
        db.commit()
    queue = db.query(AIQueue).order_by(AIQueue.created_at.desc()).all()
    return {"success": True, "queue": [q.to_dict() for q in queue]}


@app.post("/api/upload")
async def upload_image(image: UploadFile = File(...)):
    filename = f"{re.sub(r'[^a-z0-9]', '-', Path(image.filename).stem.lower())}-{int(datetime.now().timestamp() * 1000)}{Path(image.filename).suffix}"
    filepath = IMAGES_DIR / filename
    content = await image.read()
    with open(filepath, "wb") as f:
        f.write(content)

    frontend_images_dir = BASE_DIR.parent / "frontend" / "public" / "images"
    if frontend_images_dir.exists():
        try:
            with open(frontend_images_dir / filename, "wb") as f:
                f.write(content)
        except Exception as e:
            print(f"[Upload Warning] Could not mirror to frontend: {e}")

    return {"url": f"/images/{filename}"}


class MoviePromptRequest(BaseModel):
    description: str


@app.post("/api/find-movie")
def find_movie(req: MoviePromptRequest):
    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    system_prompt = (
        "You are an expert cinema and OTT identifier. Return ONLY a valid JSON object with keys: "
        '"title", "year", "genre", "director", "description". No markdown wrapping.'
    )
    user_prompt = f"Identify the movie or TV series based on this description: {req.description}"
    result = call_llm(system_prompt, user_prompt, json_mode=True, max_tokens=600)
    try:
        return json.loads(result)
    except Exception:
        clean = re.sub(r"^```json\s*", "", result.strip())
        clean = re.sub(r"\s*```$", "", clean)
        try:
            return json.loads(clean)
        except Exception:
            return {
                "title": "Movie Identified",
                "year": "2024",
                "genre": "Cinema",
                "director": "Various",
                "description": result,
            }


# ── ADMIN CMS SERVING ─────────────────────────────────────────────────────────
@app.get("/admin")
@app.get("/admin/{path:path}")
def serve_admin():
    admin_index = ADMIN_UI_DIR / "index.html"
    if admin_index.exists():
        return FileResponse(str(admin_index))
    return JSONResponse({"status": "Admin UI loading..."})


@app.get("/")
def root():
    return {"name": "TheDriftHub Backend API", "version": "2.0.0", "status": "running", "admin": "/admin"}
