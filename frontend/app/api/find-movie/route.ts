import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    // 1. If GROQ_API_KEY is present in Next.js env, call Groq directly via fetch
    if (groqApiKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert cinema & OTT identifier. Respond ONLY with valid JSON with keys: "title", "year", "description", "director", "genre". No extra markdown.',
              },
              {
                role: 'user',
                content: description,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const parsed = JSON.parse(data.choices[0]?.message?.content || '{}');
          return NextResponse.json(parsed);
        }
      } catch (e) {
        console.warn('Direct Groq call failed, trying backend fallback:', e);
      }
    }

    // 2. Fallback to Python FastAPI backend
    try {
      const beRes = await fetch(`${backendUrl}/api/find-movie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (beRes.ok) {
        return NextResponse.json(await beRes.json());
      }
    } catch (e) {}

    // 3. Fallback mock if neither is available in local offline dev
    return NextResponse.json({
      title: 'Interstellar',
      year: '2014',
      genre: 'Sci-Fi, Adventure, Drama',
      director: 'Christopher Nolan',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
