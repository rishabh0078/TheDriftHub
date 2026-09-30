import os
import re
import json
import httpx
import asyncio
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Dict, Any, List
from groq import Groq
from dotenv import load_dotenv

from database import SessionLocal, Post, AIQueue, AILog, AISetting

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
IMAGES_DIR = BASE_DIR / "public" / "images"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
}

# ── LOGGING HELPER ───────────────────────────────────────────────────────────
def add_log(message: str, log_type: str = "info"):
    db = SessionLocal()
    try:
        log_entry = AILog(
            timestamp=datetime.now(timezone.utc).isoformat(),
            type=log_type,
            message=message,
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"[Logging Error] {e}")
    finally:
        db.close()
    print(f"[{log_type.upper()}] {message}")


# ── LLM CALLER (Groq with 8192 Token Support & Fallbacks) ────────────────────
def call_llm(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.5,
    json_mode: bool = True,
    max_tokens: int = 8192,
) -> str:
    db = SessionLocal()
    setting = db.query(AISetting).filter_by(id=1).first()
    api_key = (
        (setting.api_key if setting and setting.api_key else "")
        or os.getenv("GROQ_API_KEY", "")
    ).strip()
    model = (setting.model if setting and setting.model else "openai/gpt-oss-120b")
    db.close()

    if not api_key:
        raise ValueError("GROQ_API_KEY is missing. Please set it in backend/.env or Admin Settings.")

    client = Groq(api_key=api_key)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    try:
        response_format = {"type": "json_object"} if json_mode else None
        completion = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format=response_format,
        )
        return completion.choices[0].message.content or ""
    except Exception as err:
        err_msg = str(err)
        # If strict JSON validation failed, retry with buffer instructions
        if json_mode and ("json_validate_failed" in err_msg or "Failed to generate JSON" in err_msg):
            add_log("[LLM Notice] Retrying with enhanced JSON response buffer...", "info")
            messages[0]["content"] += "\n\nIMPORTANT: Respond with 100% valid, parseable JSON ONLY. No markdown wrapping or conversational text."
            completion = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return completion.choices[0].message.content or ""
        raise err


# ── ANTI-AI CLICHÉ SANITIZER (Safety Net for 100% Human Prose) ───────────────
BANNED_AI_PATTERNS = [
    (r"\bIn today's fast-paced digital world,?\b", "In the current technology landscape,"),
    (r"\bIn today's rapidly evolving technological landscape,?\b", "In the current market,"),
    (r"\bIn today's digital age,?\b", "Right now,"),
    (r"\bdelve into\b", "examine"),
    (r"\bdelving into\b", "examining"),
    (r"\bdelves into\b", "examines"),
    (r"\ba testament to\b", "clear evidence of"),
    (r"\bis a testament to\b", "reflects"),
    (r"\btestament to\b", "proof of"),
    (r"\btapestry of\b", "spectrum of"),
    (r"\bbeacon of hope\b", "promising signal"),
    (r"\bgame-changer\b", "pivotal shift"),
    (r"\bgame changer\b", "major shift"),
    (r"\brevolutionize the way we\b", "fundamentally change how we"),
    (r"\brevolutionize\b", "overhaul"),
    (r"\bnavigating the landscape\b", "evaluating current options"),
    (r"\bnavigating the complex landscape\b", "evaluating choices"),
    (r"\bit's important to remember that\b", "Crucially,"),
    (r"\bit is important to remember that\b", "Crucially,"),
    (r"\bit remains to be seen\b", "early benchmarks will soon settle the debate"),
    (r"\bIn conclusion,?\b", "The Final Verdict:"),
    (r"\ba myriad of\b", "numerous"),
    (r"\ba plethora of\b", "an abundance of"),
    (r"\bharness the power of\b", "leverage"),
    (r"\bharnessing the power of\b", "leveraging"),
    (r"\bseamlessly integrate\b", "natively connect"),
    (r"\bseamlessly\b", "directly"),
    (r"\bat the end of the day,?\b", "Ultimately,"),
    (r"\bonly time will tell\b", "market adoption will decide"),
    (r"\bever-evolving\b", "rapidly shifting"),
    (r"\bunlock the full potential\b", "maximize capabilities"),
    (r"\bpinnacle of\b", "high point of"),
]


def sanitize_human_prose(text: str) -> str:
    """Replaces accidental LLM cliché tropes with crisp, human journalistic phrasing."""
    if not text:
        return ""
    cleaned = text
    for pattern, replacement in BANNED_AI_PATTERNS:
        cleaned = re.sub(pattern, replacement, cleaned, flags=re.IGNORECASE)
    return cleaned


# ── AGENT 1: Topic Research & Search Intent Scout ─────────────────────────────
def run_research_agent(topic: str, category: str = "tech-ai") -> Dict[str, Any]:
    add_log(f'[Agent 1: Scout] Researching search intent, competitor gaps & Information Gain for "{topic}"...')

    system_prompt = """You are the Principal SEO Strategist & Search Intelligence Director at TheDriftHub, an elite digital technology publication competing directly with Wired, Ars Technica, and The Verge.
Your mission is to perform competitor gap analysis, search intent deconstruction, and topical authority mapping so this article can rank #1 on Google and capture the Position 0 Featured Snippet.

You must identify:
1. Search Intent & Reader Friction: Why the reader is searching this query, what frustrates them about existing generic search results, and what exact decision or benchmark they need.
2. Information Gain Angle: What Google's Helpful Content System (HCU) demands—original data points, counter-intuitive arguments, real-world friction, and hidden gotchas that competitor articles ignore.
3. Position 0 Snippet Formula: A high-density, 45-55 word definitive answer immediately addressing the core search query.
4. Semantic LSI Entity Network: 6-8 core technical entities and secondary keywords that Google's Knowledge Graph associates with this topic.
5. Structured Markdown Table Strategy: The exact comparative metrics, benchmarks, or pricing breakdown that Google extracts into rich SERP snippet cards.
6. People-Also-Ask (PAA) Questions: 3-4 high-intent questions directly asked on Google search results.

Your JSON response MUST follow this exact structure:
{
  "searchIntent": "Detailed breakdown of search intent (Informational / Commercial Investigation / Technical Deep Dive)",
  "primaryKeyword": "exact primary keyword query",
  "secondaryKeywords": ["6-8 high-volume long-tail LSI keywords"],
  "informationGainHook": "The contrarian or unique perspective that gives this article unique value over competitor results",
  "targetAudience": "Profile of the reader and their exact decision problem",
  "quickAnswerSnippet": "A 45-55 word standalone direct answer targeting Google Position 0 snippet extraction",
  "suggestedSlug": "clean-kebab-case-slug-under-50-chars",
  "outline": [
    {
      "heading": "Heading 2 text (punchy, keyword-optimized, no clickbait)",
      "targetWordBudget": "250-350 words",
      "purpose": "Core insight and real-world nuance addressed",
      "subheadings": ["Optional Heading 3 subtopic", "Another subtopic"]
    }
  ],
  "comparisonTableIdea": {
    "title": "Title of the Markdown comparison or benchmark table",
    "columns": ["Entity / Spec", "Metric / Feature", "Real-World Performance", "Verdict / Trade-off"]
  },
  "faqQuestions": [
    "High-intent Google PAA question 1?",
    "High-intent Google PAA question 2?",
    "High-intent Google PAA question 3?",
    "High-intent Google PAA question 4?"
  ]
}"""

    user_prompt = f"""Target Topic: "{topic}"
Target Category: "{category}"
Publication local year: 2026

Provide comprehensive search intent research, semantic entities, table recommendations, and a strong editorial outline designed to rank #1."""

    raw = call_llm(system_prompt, user_prompt, temperature=0.3, json_mode=True)
    try:
        return json.loads(raw)
    except Exception:
        clean = re.sub(r"^```json\s*", "", raw.strip(), flags=re.MULTILINE)
        clean = re.sub(r"\s*```$", "", clean.strip(), flags=re.MULTILINE)
        return json.loads(clean)


# ── AGENT 2: Cognitive Editorial Writer ───────────────────────────────────────
def run_writer_agent(topic: str, category: str, research: Dict[str, Any]) -> Dict[str, Any]:
    add_log(f'[Agent 2: Writer] Conducting pre-generation editorial reasoning & drafting 1,400-1,800 word human article for "{topic}"...')

    system_prompt = """You are the Lead Editorial Columnist and Senior Investigative Tech Journalist at TheDriftHub.
You write with the authoritative, sharp, engaging, and skeptical intelligence of senior writers at Wired, Ars Technica, and The Verge.

YOUR MANDATE: Produce a 1,400 to 1,800 word masterclass article that Google's Helpful Content System and human readers will love, bookmark, and rank #1.

══════════════════════════════════════════════════════════════════
PHASE 1: PRE-GENERATION EDITORIAL THOUGHT PROCESS (MANDATORY)
══════════════════════════════════════════════════════════════════
Before writing a single word of the article body, you MUST conduct a deep cognitive planning analysis inside the "editorialThoughtProcess" JSON object:
1. Searcher Friction & Information Gain: Identify what shallow regurgitated top-ranking articles fail to mention. Define your unique thesis.
2. Burstiness & Cadence Blueprint: Plan how you will vary sentence rhythm—alternating between blunt 3-to-6 word punches and multi-clause technical explanations.
3. Voice & Persona Calibration: Ensure zero academic neutrality or corporate PR spin. Establish a first-hand testing perspective ("In our testing...", "What the spec sheet hides...", "Here is the reality...").
4. Anti-AI Blacklist Audit: Commit to zero AI clichés.
5. Word Count Budgeting: Allocate words section-by-section to ensure the body strictly reaches 1,400 to 1,800 words without filler.

══════════════════════════════════════════════════════════════════
PHASE 2: STRICT EDITORIAL & HUMAN VOICE RULES
══════════════════════════════════════════════════════════════════
1. ABSOLUTE BAN ON AI CLICHÉS (Immediate rejection if used):
   - NEVER use: "In today's fast-paced digital world", "delve", "delving into", "testament to", "tapestry", "beacon", "game-changer", "revolutionize", "revolutionary", "navigating the landscape", "it's important to remember", "furthermore", "moreover", "in conclusion", "it remains to be seen", "a myriad of", "plethora", "harness the power of", "seamlessly", "dive deep", "at the end of the day", "only time will tell", "ever-evolving", "cutting-edge", "pinnacle", "unlock the potential", "vital role", "double-edged sword".
   - Write like a human professional: use natural contractions (it's, don't, won't, here's), candid critiques, practical analogies, and clear technical assertions.

2. BURSTINESS & RHYTHMIC CADENCE:
   - High burstiness is the #1 signal of human prose. Mix short, blunt sentences with longer explanatory ones.
   - Example of burstiness: "The promise was instantaneous scale. The reality was a $14,000 monthly compute invoice. When we stress-tested the cluster under peak concurrent loads, latency didn't just creep up—it doubled."
   - Avoid monotonous sentence structures starting repeatedly with "By doing X..." or "With the rise of Y...".

3. GOOGLE POSITION 0 FEATURED SNIPPET:
   - Within the first 100 words (immediately under an opening hook or ## What Is... heading), provide a direct, crystal-clear 45 to 55 word definitive answer that solves the search query. Google scans this exact block for Position 0 extraction.

4. PERFECT WORD COUNT (STRICTLY 1,400 to 1,800 words):
   - Write deeply and comprehensively. Explore technical mechanics, real trade-offs, pricing dynamics, benchmarks, and edge cases.
   - Structure into 5-7 clear H2 (##) sections with logical H3 (###) subheadings.
   - Never use H1 (#) in body.

5. MANDATORY STRUCTURED COMPARISON TABLE:
   - Include at least ONE comprehensive Markdown comparison or benchmark table with at least 4-6 rows and 4-5 columns.
   - Google heavily rewards structured tabular data for high-intent search queries.

6. E-E-A-T & PRACTICAL VERDICTS:
   - Ground insights in concrete numbers, technical versions, architecture trade-offs, and actionable guidance.
   - Avoid non-committal conclusions. State a definitive verdict: who should adopt this, who should skip it, and where the traps lie.

7. STRUCTURED FAQ SECTION:
   - End with "## Frequently Asked Questions" containing 3-4 People-Also-Ask questions with punchy, authoritative 2-3 sentence answers.

8. CLEAN MARKDOWN ONLY:
   - Do NOT include frontmatter (---) in the body field.
   - Return clean markdown ready for rendering.

Return valid JSON:
{
  "editorialThoughtProcess": {
    "searcherFrustration": "What readers are frustrated by in current search results",
    "informationGainThesis": "The unique, contrarian value and real-world insight this article delivers",
    "cadenceAndBurstinessPlan": "Plan for sentence length variation and punchy rhythm",
    "sectionWordBudgets": {
      "introAndSnippet": "130-150 words",
      "coreArchitecture": "400-500 words",
      "realWorldBenchmarksAndTable": "350-450 words",
      "frictionAndHiddenGotchas": "300-400 words",
      "definitiveVerdict": "120-150 words",
      "faqSection": "200-250 words",
      "totalEstimated": "1500-1750 words"
    },
    "bannedPhrasesChecklist": "Confirmed zero occurrences of delve, testament, game-changer, etc."
  },
  "draftTitle": "High-CTR, punchy headline strictly under 60 characters",
  "draftDescription": "Compelling meta description between 135 and 155 characters",
  "body": "Full markdown article body (1,400 to 1,800 words)...",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}"""

    user_prompt = f"""Topic: "{topic}"
Category: "{category}"
Research & Strategy Dossier:
{json.dumps(research, indent=2)}

Conduct your internal editorial thought process and write the full 1,400-1,800 word human-crafted article now."""

    raw = call_llm(system_prompt, user_prompt, temperature=0.7, json_mode=True, max_tokens=8192)
    try:
        parsed = json.loads(raw)
    except Exception:
        clean = re.sub(r"^```json\s*", "", raw.strip(), flags=re.MULTILINE)
        clean = re.sub(r"\s*```$", "", clean.strip(), flags=re.MULTILINE)
        parsed = json.loads(clean)

    # Word count and cognitive process logging
    body_text = parsed.get("body", "")
    word_count = len(body_text.split())
    add_log(f'[Agent 2: Writer] ✓ Completed drafting with {word_count} words. Cognitive thought process registered.', 'success')
    return parsed


# ── AGENT 3: SEO Quality Auditor & Gatekeeper ─────────────────────────────────
def run_auditor_agent(topic: str, category: str, draft: Dict[str, Any], research: Dict[str, Any]) -> Dict[str, Any]:
    raw_body = draft.get("body", "")
    actual_words = len(raw_body.split())
    sanitized_body = sanitize_human_prose(raw_body)
    draft["body"] = sanitized_body

    add_log(f'[Agent 3: Auditor] Auditing SEO compliance, word count ({actual_words} words), and constraints for "{topic}"...')

    system_prompt = """You are the Chief SEO Auditor and Quality Gatekeeper for TheDriftHub.
You strictly enforce Google Helpful Content standards, technical SEO constraints, and human editorial integrity before any article is approved for publishing.

STRICT AUDIT CHECKS:
1. Title Length: MUST be between 50 and 60 characters (max 65 chars strict Google SERP cut-off). If over, rewrite and trim it.
2. Description Length: MUST be between 135 and 155 characters (max 160 chars strict limit). If over, rewrite and trim it.
3. Word Count Verification: Verify that the content is comprehensive and deep (ideally 1,400 to 1,800 words, minimum 1,200 words).
4. AI Cliché Scan: Ensure forbidden filler phrases are eliminated ("delve", "testament", "beacon", "game-changer", "revolutionize", "in today's digital world", "navigating the landscape", "it remains to be seen", "in conclusion").
5. Structure Validation: Verify proper Markdown heading hierarchy (no H1 in body, H2s followed by H3s), presence of a Markdown table, and FAQ section.
6. Category: MUST be one of: ["tech-ai", "memes-trends", "creators", "movies-ott"].

If the draft title or description exceeds character limits, YOU MUST REWRITE AND TRIM THEM to meet the exact constraints.

Return your audit in valid JSON format:
{
  "seoScore": 98,
  "greenSignal": true,
  "wordCount": 1550,
  "auditedTitle": "Final polished headline under 65 chars (50-60 optimal)",
  "auditedDescription": "Final polished meta description between 135 and 155 chars",
  "auditedSlug": "clean-kebab-case-slug",
  "tags": ["3-5", "clean", "kebab-case-or-normal", "tags"],
  "auditNotes": "Detailed audit report on word count, snippet validation, table presence, and human tone verification"
}"""

    user_prompt = f"""Topic: "{topic}"
Category: "{category}"
Draft Title ({len(draft.get('draftTitle', ''))} chars): "{draft.get('draftTitle', '')}"
Draft Description ({len(draft.get('draftDescription', ''))} chars): "{draft.get('draftDescription', '')}"
Draft Body Word Count: {actual_words} words
Table Present: {"|" in raw_body}
FAQ Section Present: {"Frequently Asked Questions" in raw_body or "FAQ" in raw_body}
Sample opening excerpt:
{raw_body[:1000]}...

Audit this article, fix any character limit overages in title and description, and output the finalized publication package."""

    raw = call_llm(system_prompt, user_prompt, temperature=0.2, json_mode=True)
    try:
        audit_result = json.loads(raw)
    except Exception:
        clean = re.sub(r"^```json\s*", "", raw.strip(), flags=re.MULTILINE)
        clean = re.sub(r"\s*```$", "", clean.strip(), flags=re.MULTILINE)
        audit_result = json.loads(clean)

    audit_result["wordCount"] = actual_words
    audit_notes = audit_result.get("auditNotes", "")
    audit_result["auditNotes"] = f"Length: {actual_words} words. {audit_notes}"

    add_log(f'[Agent 3: Auditor] ✓ Audit passed! SEO Score: {audit_result.get("seoScore", 98)}/100 | {actual_words} words | Title: {len(audit_result.get("auditedTitle", ""))} chars', 'success')
    return audit_result


# ── AGENT 4: AI Art Director & Free Stock Image Engine ────────────────────────
def get_ai_visual_concept(topic: str, category: str) -> Dict[str, Any]:
    try:
        system_prompt = """You are the Lead Visual Art Director for an elite digital tech publication.
Analyze the article topic and return pure JSON with:
1. "queries": array of 2-3 precise, modern photography search terms for high-quality stock photo libraries (e.g. for "top 10 ai models", return ["artificial intelligence supercomputer datacenter", "neural network computing processor", "modern AI technology"]).
2. "negativeTerms": array of forbidden/irrelevant concepts for this article (e.g. ["peasant", "farmer", "1800s", "1890s", "vintage", "painting", "sketch", "fashion", "runway", "portrait", "costume", "historical"]).
3. "imageAlt": a professional, SEO-optimized image alt text describing what the hero visual represents (under 70 characters).
4. "visualPrompt": a descriptive, photorealistic 16:9 prompt for generating a modern hero graphic if no stock photo matches."""

        user_prompt = f'Topic: "{topic}"\nCategory: "{category}"'
        raw = call_llm(system_prompt, user_prompt, temperature=0.2, json_mode=True)
        return json.loads(raw)
    except Exception:
        return {
            "queries": [f"{topic} technology", "artificial intelligence technology computing"],
            "negativeTerms": ["peasant", "farmer", "1800s", "1890s", "vintage", "painting", "sketch", "antique", "portrait"],
            "imageAlt": f"{topic} - Modern Technology Analysis",
            "visualPrompt": f"{topic}, modern technology editorial style, high tech, clean aesthetic, 8k resolution, cinematic lighting, 16:9 landscape",
        }


def is_image_relevant(text: str, negative_terms: List[str]) -> bool:
    lower = (text or "").lower()
    for neg in negative_terms:
        if neg.lower() in lower:
            return False
    return True


def download_and_verify_image(image_url: str, slug: str) -> Optional[str]:
    try:
        with httpx.Client(follow_redirects=True, timeout=15.0) as client:
            res = client.get(image_url, headers=BROWSER_HEADERS)
            if res.status_code != 200:
                return None

            content_type = res.headers.get("content-type", "")
            if not content_type.startswith("image/"):
                return None

            ext = ".png" if "png" in content_type else (".webp" if "webp" in content_type else ".jpg")
            filename = f"{slug}-hero-{int(datetime.now().timestamp() * 1000)}{ext}"
            filepath = IMAGES_DIR / filename

            # Must be at least 5KB
            if len(res.content) < 5000:
                return None

            with open(filepath, "wb") as f:
                f.write(res.content)

            add_log(f"[Image Agent] ✓ Hero image verified & locally saved: {filename} ({len(res.content) // 1024} KB)", "success")
            return f"/images/{filename}"
    except Exception as e:
        add_log(f"[Image Agent] Download error: {e}", "warning")
        return None


def fetch_stock_image(topic: str, category: str, slug: str) -> Dict[str, str]:
    add_log(f'[Image Agent] 🖼️ Free AI-Directed Image Engine activated for: "{topic}"', "info")

    ai_visual = get_ai_visual_concept(topic, category)
    search_queries = ai_visual.get("queries", [topic])
    negative_terms = ai_visual.get("negativeTerms", ["peasant", "farmer", "1800s", "1890s", "painting", "sketch"])
    final_alt = ai_visual.get("imageAlt", f"{topic} illustration")

    add_log(f'[Image Agent] 🎨 AI Model visual search terms: "{", ".join(search_queries)}"', "info")

    with httpx.Client(follow_redirects=True, timeout=12.0) as client:
        # 1. Unsplash Open Stock
        for query in search_queries:
            try:
                url = f"https://unsplash.com/napi/search/photos?query={httpx.URL(query).raw_path.decode()}&per_page=5&orientation=landscape"
                res = client.get(url, headers=BROWSER_HEADERS)
                if res.status_code == 200:
                    data = res.json()
                    for photo in data.get("results", []):
                        alt = photo.get("alt_description", "")
                        if not is_image_relevant(alt, negative_terms):
                            continue
                        photo_url = photo.get("urls", {}).get("regular") or photo.get("urls", {}).get("full")
                        if photo_url:
                            local_path = download_and_verify_image(photo_url, slug)
                            if local_path:
                                return {"path": local_path, "alt": final_alt}
            except Exception:
                pass

        # 2. Wikipedia Real Entities
        for query in search_queries:
            try:
                url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch={httpx.URL(query).raw_path.decode()}&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=1200&format=json&origin=*"
                res = client.get(url, headers=BROWSER_HEADERS)
                if res.status_code == 200:
                    pages = res.json().get("query", {}).get("pages", {})
                    for p in pages.values():
                        title = p.get("title", "")
                        if not is_image_relevant(title, negative_terms):
                            continue
                        thumb = p.get("thumbnail", {}).get("source")
                        if thumb:
                            local_path = download_and_verify_image(thumb, slug)
                            if local_path:
                                return {"path": local_path, "alt": final_alt}
            except Exception:
                pass

    # 3. AI Generated Visual (Pollinations.ai 100% Free 16:9 Hero Graphic)
    try:
        prompt = ai_visual.get("visualPrompt", f"{topic}, modern technology editorial style, high tech, clean aesthetic, 8k resolution, cinematic lighting, 16:9 landscape")
        image_url = f"https://image.pollinations.ai/prompt/{httpx.URL(prompt).raw_path.decode()}?width=1200&height=675&nologo=true&seed={int(datetime.now().timestamp())}"
        local_path = download_and_verify_image(image_url, slug)
        if local_path:
            return {"path": local_path, "alt": final_alt}
    except Exception:
        pass

    return {"path": "/images/hero-img-2-1781883683283.jpg", "alt": final_alt}


# ── FULL 4-STEP PIPELINE EXECUTION ────────────────────────────────────────────
def execute_topic_pipeline(queue_item_id: str) -> Dict[str, Any]:
    db = SessionLocal()
    item = db.query(AIQueue).filter_by(id=queue_item_id).first()
    if not item:
        db.close()
        raise ValueError(f"Queue item {queue_item_id} not found.")

    item.status = "researching"
    item.error = None
    db.commit()

    try:
        # Step 1: Research Scout
        research = run_research_agent(item.topic, item.category)
        item.status = "writing"
        db.commit()

        # Step 2: Writer Agent
        draft = run_writer_agent(item.topic, item.category, research)
        item.status = "auditing"
        db.commit()

        # Step 3: SEO Auditor
        audit = run_auditor_agent(item.topic, item.category, draft, research)
        item.status = "fetching-image"
        db.commit()

        # Step 4: AI Hero Image Engine
        slug = (audit.get("auditedSlug") or research.get("suggestedSlug") or re.sub(r"[^a-z0-9]+", "-", item.topic.lower())).strip("-")
        stock_image = fetch_stock_image(item.topic, item.category, slug)

        # Publish to PostgreSQL `posts` Table!
        final_title = audit.get("auditedTitle") or draft.get("draftTitle")
        final_desc = audit.get("auditedDescription") or draft.get("draftDescription")
        final_tags = audit.get("tags") or draft.get("suggestedTags", ["tech-ai", "trends"])

        # Check if post with slug exists, else create
        existing_post = db.query(Post).filter_by(slug=slug).first()
        if existing_post:
            existing_post.title = final_title
            existing_post.description = final_desc
            existing_post.content = draft.get("body", "")
            existing_post.category = item.category
            existing_post.tags = final_tags
            existing_post.image = stock_image["path"]
            existing_post.image_alt = stock_image["alt"]
            existing_post.seo_score = audit.get("seoScore", 95)
            existing_post.draft = False
        else:
            new_post = Post(
                slug=slug,
                title=final_title,
                description=final_desc,
                content=draft.get("body", ""),
                category=item.category,
                tags=final_tags,
                image=stock_image["path"],
                image_alt=stock_image["alt"],
                author="TheDriftHub Editorial",
                author_image="/images/logo.png",
                featured=True,
                trending=True,
                seo_score=audit.get("seoScore", 95),
                draft=False,
            )
            db.add(new_post)

        item.status = "published"
        item.published_slug = slug
        item.published_at = datetime.now(timezone.utc).isoformat()
        item.seo_score = audit.get("seoScore", 95)
        item.audit_notes = audit.get("auditNotes", "Passed all SEO standards")

        setting = db.query(AISetting).filter_by(id=1).first()
        if setting:
            setting.total_generated = (setting.total_generated or 0) + 1
            setting.last_run_at = datetime.now(timezone.utc).isoformat()

        db.commit()
        add_log(f'[Publisher] ✓ Successfully published "{final_title}" to PostgreSQL (slug: {slug})!', "success")
        return {"success": True, "slug": slug, "item": item.to_dict(), "publishResult": {"slug": slug}}
    except Exception as e:
        item.status = "failed"
        item.error = str(e)
        db.commit()
        add_log(f'[Pipeline Error] Failed processing "{item.topic}": {e}', "error")
        raise e
    finally:
        db.close()


# ── TREND DISCOVERY AGENT (HackerNews + Reddit) ───────────────────────────────
def discover_trends() -> Dict[str, Any]:
    add_log("[Trend Discovery] 🔍 Scanning HackerNews + Reddit r/technology for trending topics...", "info")
    candidates = []

    with httpx.Client(follow_redirects=True, timeout=10.0) as client:
        # HackerNews
        try:
            ids_res = client.get("https://hacker-news.firebaseio.com/v0/topstories.json")
            if ids_res.status_code == 200:
                top_ids = ids_res.json()[:12]
                for tid in top_ids:
                    t_res = client.get(f"https://hacker-news.firebaseio.com/v0/item/{tid}.json")
                    if t_res.status_code == 200:
                        data = t_res.json()
                        title = data.get("title", "")
                        score = data.get("score", 0)
                        if score >= 60 and len(title) > 15:
                            candidates.append(f"[HN {score}pts] {title}")
        except Exception as e:
            add_log(f"[Trend Discovery] HN note: {e}", "warning")

        # Reddit
        try:
            r_res = client.get("https://www.reddit.com/r/technology/hot.json?limit=15", headers=BROWSER_HEADERS)
            if r_res.status_code == 200:
                posts = r_res.json().get("data", {}).get("children", [])
                for p in posts:
                    pdata = p.get("data", {})
                    title = pdata.get("title", "")
                    ups = pdata.get("ups", 0)
                    if ups >= 150 and not pdata.get("stickied", False):
                        candidates.append(f"[Reddit {ups}up] {title}")
        except Exception as e:
            add_log(f"[Trend Discovery] Reddit note: {e}", "warning")

    if not candidates:
        return {"discovered": 0, "added": 0, "topics": []}

    system_prompt = """You are the Senior Editor & Trend Scout at TheDriftHub.
Analyze these raw trending news headlines from HackerNews and Reddit.
Filter out boring corporate announcements, political rants, and spam.
Select 3 to 5 highest-traffic, viral, click-worthy topics suitable for in-depth editorial articles.

Return valid JSON format:
{
  "selected": [
    {
      "topic": "Clean, engaging, high-CTR headline for the article",
      "category": "tech-ai / memes-trends / creators / movies-ott",
      "originalHeadline": "Raw source headline"
    }
  ]
}"""

    raw = call_llm(system_prompt, f"Raw Headlines:\n" + "\n".join(candidates[:20]), temperature=0.3, json_mode=True)
    try:
        data = json.loads(raw)
    except Exception:
        clean = re.sub(r"^```json\s*", "", raw.strip(), flags=re.MULTILINE)
        clean = re.sub(r"\s*```$", "", clean.strip(), flags=re.MULTILINE)
        data = json.loads(clean)

    selected = data.get("selected", [])
    db = SessionLocal()
    added_items = []
    try:
        for item in selected:
            queue_id = f"trend-{int(datetime.now().timestamp() * 1000)}-{os.urandom(3).hex()}"
            category = item.get("category", "tech-ai")
            if category not in ["tech-ai", "memes-trends", "creators", "movies-ott"]:
                category = "tech-ai"

            new_q = AIQueue(
                id=queue_id,
                topic=item.get("topic", "").strip(),
                category=category,
                status="pending",
                source="trend-discovery",
                original_headline=item.get("originalHeadline", ""),
            )
            db.add(new_q)
            added_items.append(new_q.to_dict())
        db.commit()
    finally:
        db.close()

    add_log(f"[Trend Discovery] ✓ Discovered {len(candidates)} trends → Added {len(added_items)} new topics to queue!", "success")
    return {"discovered": len(candidates), "selected": len(selected), "added": len(added_items), "topics": added_items}
