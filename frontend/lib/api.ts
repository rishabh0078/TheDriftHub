import { Post } from './types';
import { Pool } from 'pg';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const DATABASE_URL = process.env.DATABASE_URL;

let pool: Pool | null = null;
if (DATABASE_URL && !DATABASE_URL.startsWith('sqlite')) {
  try {
    const cleanUrl = DATABASE_URL.replace(/[?&]channel_binding=[^&]+/g, '');
    pool = new Pool({
      connectionString: cleanUrl,
      ssl: cleanUrl.includes('neon.tech') || cleanUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
    });
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
  }
}

// Fallback seed data in case backend/db is booting or in dev
const FALLBACK_POSTS: Post[] = [
  {
    slug: 'top-10-ai-models-2026',
    title: 'Top 10 AI Models Dominating 2026 – ROI & Performance Guide',
    description: 'Discover the ten AI models that truly deliver ROI in 2026—accuracy, multimodal power, cost efficiency, and open-source flexibility compared side-by-side.',
    content: `GPT-5 isn't the only AI model delivering ROI in 2026; ten contenders outperform the hype. **The top AI models in 2026 are OpenAI's GPT-5, Google Gemini 2, Anthropic Claude-3.5, Meta LLaMA 3.3, DeepSeek R1, Cohere Command-R, Mistral Large 2, IBM WatsonX, NVIDIA NeMo 3, and Falcon 2.**

## The AI Landscape in 2026: Why Model Choice Matters

### From Hype to Practicality
The past two years have shifted focus from headline-grabbing token counts to measurable business outcomes. Enterprises now demand models that can be audited, scaled on-prem, or integrated with existing data pipelines without breaking budgets.

### Key Drivers: Multimodality, Efficiency, and Trust
Multimodal fusion (text-image-audio), inference latency, and alignment with regulatory standards dominate buying decisions. A model that excels in one dimension but falters on cost or safety rarely survives a production rollout.

## 2026 Enterprise Model Comparison Matrix

| Model | Primary Strength | Context Window | Best Enterprise Fit | License Type |
|---|---|---|---|---|
| **DeepSeek R1** | Mathematical & Code Reasoning | 128k Tokens | Complex Analytics & Self-Hosted Coding | Open Weights |
| **OpenAI o3** | Zero-Shot Logical Deduction | 200k Tokens | High-Risk Financial & Legal Decisions | Proprietary API |
| **Claude 3.5 Sonnet** | Nuanced Technical Writing | 200k Tokens | Editorial & Code Refactoring | Proprietary API |
| **Google Gemini 2.0 Flash** | Real-Time Audio/Video Vision | 1M+ Tokens | Real-Time Consumer Apps | Proprietary API |
| **Meta LLaMA 3.3 70B** | Versatility & Local Hosting | 128k Tokens | On-Prem Airgapped Infrastructure | Open Source |

## Frequently Asked Questions

### Which AI model is fastest for production APIs in 2026?
Google Gemini 2.0 Flash and Groq-hosted LLaMA 3.1 8B offer the fastest time-to-first-token, routinely delivering over 800 tokens per second for high-throughput applications.

### Can open-source models compete with GPT-5?
Yes. DeepSeek R1 and LLaMA 3.3 70B have closed the gap in reasoning and code generation, outperforming proprietary flagships on standard benchmarks while costing up to 80% less to operate.`,
    category: 'tech-ai',
    tags: ['top-10', 'ai-models', '2026', 'tech-ai', 'deepseek'],
    image: '/images/hero-img-2-1781883683283.jpg',
    imageAlt: 'Top 10 AI Models in 2026 - Neural Architecture and Supercomputing',
    author: 'TheDriftHub Editorial',
    authorImage: '/images/logo.png',
    featured: true,
    trending: true,
    seoScore: 100,
    pubDate: '2026-09-27',
  },
  {
    slug: 'openai-optics-how-perception-shapes-ai-news',
    title: "OpenAI's Optics Concern: How Public Perception Shapes AI News",
    description: "An investigative analysis into how tech conglomerates manage developer sentiment, HackerNews optics, and release cadences in the fierce LLM race.",
    content: `When news surfaced regarding OpenAI's internal concern over optics on technical communities like Hacker News, it laid bare a reality long suspected: narrative control is as vital as parameter counts in the AI arms race.

## The Battle for Developer Mindshare

Developers do not merely consume AI APIs; they dictate the architectural choices of tomorrow's Fortune 500 tech stacks. When developer sentiment sours, switching costs to open-weight models like DeepSeek or LLaMA are now virtually zero.

## Strategic Takeaways for Tech Leaders
1. **Authenticity Beats Spin:** Engineers spot synthetic benchmark manipulation instantly.
2. **Open-Weights Momentum:** Community-driven evaluation is replacing vendor-sponsored benchmarks.`,
    category: 'tech-ai',
    tags: ['openai', 'tech-news', 'hacker-news', 'ai-optics'],
    image: '/images/hero-img-2-1781883683283.jpg',
    imageAlt: 'OpenAI Optics and Tech Narrative Architecture',
    author: 'TheDriftHub Editorial',
    authorImage: '/images/logo.png',
    featured: false,
    trending: true,
    seoScore: 98,
    pubDate: '2026-09-27',
  },
  {
    slug: 'gta-6-map-vs-gta-5',
    title: 'GTA 6 Map Size vs GTA 5: The Definitive Scale & Evolution Comparison',
    description: 'A deep-dive geographic and architectural comparison between GTA 6 Vice City/Leonida and GTA 5 Los Santos. Map dimensions, density, and enterable buildings.',
    content: `Rockstar Games is preparing to reset open-world standards with Grand Theft Auto VI. Leonida isn't just bigger than Los Santos; it is designed with an unprecedented ratio of interior interactivity and dynamic physics.

## Scale Comparison: Vice City vs Los Santos

| Metric | GTA 5 (Los Santos) | GTA 6 (Leonida) | Expansion Factor |
|---|---|---|---|
| Total Map Area | ~75 sq km | ~170 sq km | 2.2x Larger |
| Enterable Buildings | ~15% | ~68% Projected | 4.5x Density |
| Underwater Biomes | Basic ocean floor | Coral reefs & marshlands | Complete Ecosystem |

## Dynamic Weather and NPC Ecosystems
The true scale is not measured merely in horizontal square kilometers, but in the vertical density of skyscrapers, malls, and sprawling Everglades bayous.`,
    category: 'memes-trends',
    tags: ['gta-6', 'rockstar-games', 'gaming', 'vice-city'],
    image: '/images/gta-6-map-size-1782731392416.png',
    imageAlt: 'GTA 6 Map Size vs GTA 5 Scale Comparison',
    author: 'TheDriftHub Gaming Desk',
    authorImage: '/images/logo.png',
    featured: false,
    trending: true,
    seoScore: 96,
    pubDate: '2026-09-26',
  },
  {
    slug: 'claude-fable-5-is-back',
    title: 'Claude Fable 5 Returns After Being Unavailable',
    description: 'Claude Fable 5 was suspended and unavailable following an export ban. Get the release update, full news, and confirmation of its official return.',
    content: `If you tried accessing Claude Fable 5 over the past few weeks and ran into a wall, you were not alone. Millions of users worldwide hit the exact same dead end.

## What Happened During the Suspension
A newly launched model, pulled offline within 72 hours of release, caught in the middle of a national security dispute between Anthropic and the US government.

## Return & Rollout
On June 30, 2026, export controls were formally lifted. Access restoration began across Claude platforms with enhanced safeguards.`,
    category: 'tech-ai',
    tags: ['claude-fable-5', 'anthropic', 'ai-news'],
    image: '/images/claude-fable-5-back-1782887298455.png',
    imageAlt: 'Claude Fable 5 is Back',
    author: 'TheDriftHub',
    authorImage: '/images/logo.png',
    featured: true,
    trending: true,
    seoScore: 98,
    pubDate: '2026-07-01',
  },
  {
    slug: 'claude-fable-5-unavailable',
    title: 'Claude Fable 5: Why It Suddenly Became Unavailable',
    description: 'Over the past few days, many users have reported losing access to the model or finding that it no longer appears in their list of available Claude options.',
    content: `If you've recently tried accessing Claude Fable 5 and received a message saying the model is currently unavailable, you're not alone.

## 4 Key Factors Behind the Restrictions
1. Regulatory Compliance Requirements
2. Access-Control Adjustments
3. Safety and Security Reviews
4. Infrastructure and Scaling Challenges`,
    category: 'tech-ai',
    tags: ['claude-fable-5', 'anthropic-ai', 'ai-news'],
    image: '/images/hero-img-2-1781883683283.jpg',
    imageAlt: 'Claude Fable 5 Unavailable',
    author: 'TheDriftHub',
    authorImage: '/images/logo.png',
    featured: false,
    trending: true,
    seoScore: 95,
    pubDate: '2026-06-19',
  }
];

import { cache } from 'react';

// In-memory cache for blazing-fast responses (<1ms) and zero redundant roundtrips
let cachedAllPosts: Post[] | null = null;
let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

function cleanYamlString(val?: string, fallback: string = ''): string {
  if (!val) return fallback;
  const trimmed = val.trim();
  // Check for YAML folded scalar symbols: '>-', '>', '|', '|-'
  if (/^[>|]-?$/.test(trimmed)) {
    return fallback;
  }
  if (trimmed.startsWith('>-') || trimmed.startsWith('|-')) {
    const stripped = trimmed.replace(/^[>|]-?\s*/, '').trim();
    return stripped || fallback;
  }
  return trimmed;
}

export const getAllPosts = cache(async (category?: string): Promise<Post[]> => {
  const now = Date.now();

  // Return cached result if fresh
  if (cachedAllPosts && now - lastCacheFetchTime < CACHE_TTL_MS) {
    if (category && category !== 'all') {
      return cachedAllPosts.filter((p) => p.category === category);
    }
    return cachedAllPosts;
  }

  let posts: Post[] = [];

  // 1. Try FastAPI local backend first (instant ~1ms loopback if running)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BACKEND_URL}/api/posts`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        posts = data.map((p) => ({
          ...p,
          description: cleanYamlString(p.description, p.title),
          imageAlt: cleanYamlString(p.imageAlt || p.image_alt, p.title),
        }));
      }
    }
  } catch {
    // Backend may not be running locally yet, fall back to direct DB or mock
  }

  // 2. Try PostgreSQL directly if backend was empty
  if (posts.length === 0 && pool) {
    try {
      const res = await pool.query(
        'SELECT * FROM posts WHERE draft = false ORDER BY pub_date DESC, created_at DESC LIMIT 100'
      );
      if (res.rows && res.rows.length > 0) {
        posts = res.rows.map(mapDbRowToPost);
      }
    } catch (err) {
      console.warn('[DB Query Notice] Falling back to mock data:', err);
    }
  }

  // 3. Fallback mock posts
  if (posts.length === 0) {
    posts = FALLBACK_POSTS;
  }

  // Populate in-memory cache
  cachedAllPosts = posts;
  lastCacheFetchTime = now;

  if (category && category !== 'all') {
    return posts.filter((p) => p.category === category);
  }
  return posts;
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  // 1. Instant check in memory cache
  if (cachedAllPosts) {
    const cached = cachedAllPosts.find((p) => p.slug === slug);
    if (cached) return cached;
  }

  // 2. Fetch all posts to hydrate memory cache
  const all = await getAllPosts();
  const found = all.find((p) => p.slug === slug);
  if (found) return found;

  // 3. Fallback direct DB query
  if (pool) {
    try {
      const res = await pool.query('SELECT * FROM posts WHERE slug = $1 LIMIT 1', [slug]);
      if (res.rows && res.rows[0]) {
        return mapDbRowToPost(res.rows[0]);
      }
    } catch (err) {
      console.warn('[DB Slug Query Notice] Falling back:', err);
    }
  }

  // 4. Try FastAPI Backend
  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const p = await res.json();
      return {
        ...p,
        description: cleanYamlString(p.description, p.title),
        imageAlt: cleanYamlString(p.imageAlt || p.image_alt, p.title),
      };
    }
  } catch {}

  // 5. Fallback mock search
  return FALLBACK_POSTS.find((p) => p.slug === slug) || null;
});

function mapDbRowToPost(row: any): Post {
  let tags = [];
  try {
    tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []);
  } catch {
    tags = [];
  }

  let description = cleanYamlString(row.description);
  if (!description && row.content) {
    const contentLines = (row.content || '')
      .split('\n')
      .map((l: string) => l.trim())
      .filter((l: string) => l && !l.startsWith('#') && !l.startsWith('---') && !l.startsWith('!') && !l.startsWith('|'));
    if (contentLines.length > 0) {
      description = contentLines[0].replace(/[*_`]/g, '').slice(0, 180) + '...';
    } else {
      description = row.title;
    }
  }

  let imageAlt = cleanYamlString(row.image_alt, row.title);
  if (!imageAlt) {
    imageAlt = row.title;
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: description || row.title,
    content: row.content,
    category: row.category,
    tags,
    image: row.image || '/images/hero-img-2-1781883683283.jpg',
    imageAlt,
    author: row.author || 'TheDriftHub Editorial',
    authorImage: row.author_image || '/images/logo.png',
    featured: !!row.featured,
    trending: !!row.trending,
    weeklyHighlight: !!row.weekly_highlight,
    draft: !!row.draft,
    seoScore: row.seo_score || 95,
    pubDate: row.pub_date || (row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2026-09-27'),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
}
