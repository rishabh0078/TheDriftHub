import os
import re
import json
from datetime import datetime, timezone
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    JSON,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./thedrifthub.db")

# Handle PostgreSQL connection URL compatibility & enforce installed psycopg2 driver
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Clean channel_binding for libpq/psycopg2 driver compatibility
if not DATABASE_URL.startswith("sqlite"):
    DATABASE_URL = re.sub(r"[?&]channel_binding=[^&]+", "", DATABASE_URL)
    if "?" not in DATABASE_URL and "&" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("&", "?", 1)

# Connection args & pool configuration (pool_pre_ping ensures Neon serverless stays alive)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), index=True, default="tech-ai")
    tags = Column(JSON, default=list)
    image = Column(String(1000), default="/images/hero-img-2-1781883683283.jpg")
    image_alt = Column(String(500), default="")
    author = Column(String(255), default="TheDriftHub Editorial")
    author_image = Column(String(500), default="/images/logo.png")
    featured = Column(Boolean, default=False)
    trending = Column(Boolean, default=False)
    weekly_highlight = Column(Boolean, default=False)
    draft = Column(Boolean, default=False)
    seo_score = Column(Integer, default=95)
    pub_date = Column(String(50), default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "slug": self.slug,
            "title": self.title,
            "description": self.description,
            "content": self.content,
            "body": self.content,
            "category": self.category,
            "tags": self.tags or [],
            "image": self.image,
            "imageAlt": self.image_alt,
            "author": self.author,
            "authorImage": self.author_image,
            "featured": self.featured,
            "trending": self.trending,
            "weeklyHighlight": self.weekly_highlight,
            "draft": self.draft,
            "seoScore": self.seo_score,
            "pubDate": self.pub_date,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }


class AIQueue(Base):
    __tablename__ = "ai_queue"

    id = Column(String(100), primary_key=True, index=True)
    topic = Column(String(500), nullable=False)
    category = Column(String(100), default="tech-ai")
    status = Column(String(50), default="pending")  # pending, researching, writing, auditing, fetching-image, published, failed
    source = Column(String(50), default="manual")
    original_headline = Column(String(500), nullable=True)
    published_slug = Column(String(255), nullable=True)
    seo_score = Column(Integer, nullable=True)
    audit_notes = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(String(100), default=lambda: datetime.now(timezone.utc).isoformat())
    published_at = Column(String(100), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "topic": self.topic,
            "category": self.category,
            "status": self.status,
            "source": self.source,
            "originalHeadline": self.original_headline,
            "publishedSlug": self.published_slug,
            "seoScore": self.seo_score,
            "auditNotes": self.audit_notes,
            "error": self.error,
            "createdAt": self.created_at,
            "publishedAt": self.published_at,
        }


class AILog(Base):
    __tablename__ = "ai_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String(100), default=lambda: datetime.now(timezone.utc).isoformat())
    type = Column(String(50), default="info")  # info, success, warning, error
    message = Column(Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "type": self.type,
            "message": self.message,
        }


class AISetting(Base):
    __tablename__ = "ai_settings"

    id = Column(Integer, primary_key=True, default=1)
    autopilot = Column(Boolean, default=False)
    morning_time = Column(String(20), default="09:00")
    evening_time = Column(String(20), default="19:00")
    provider = Column(String(50), default="groq")
    model = Column(String(100), default="openai/gpt-oss-120b")
    api_key = Column(String(500), default="")
    last_run_at = Column(String(100), nullable=True)
    last_slot_run = Column(String(100), nullable=True)
    total_generated = Column(Integer, default=0)

    def to_dict(self):
        return {
            "autopilot": self.autopilot,
            "morningTime": self.morning_time,
            "eveningTime": self.evening_time,
            "provider": self.provider,
            "model": self.model,
            "apiKey": self.api_key,
            "lastRunAt": self.last_run_at,
            "lastSlotRun": self.last_slot_run,
            "totalGenerated": self.total_generated,
        }


def init_db():
    Base.metadata.create_all(bind=engine)
    # Ensure default settings row exists
    db = SessionLocal()
    try:
        setting = db.query(AISetting).filter_by(id=1).first()
        if not setting:
            default_setting = AISetting(id=1)
            db.add(default_setting)
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
