'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const EXAMPLES = [
  {
    label: '🎬 Truman Show vibes',
    text: 'A movie about a guy who finds out his whole life is a TV show',
  },
  {
    label: '🌀 Dream layers',
    text: "A movie where dreams have layers and you can go into someone else's dream",
  },
  {
    label: '👽 Indian sci-fi satire',
    text: 'An Indian movie where a guy pretends to be an alien and questions blind faith',
  },
];

interface MovieResult {
  title: string;
  year?: string;
  genre?: string;
  description?: string;
  director?: string;
  error?: string;
}

export default function MovieFinderClient() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MovieResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/find-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to identify the movie.');
      }
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while finding the movie.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDescription('');
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Clean top accent rule */}
        <div className="h-[2px] w-full bg-primary" />

        {/* Editorial Navigation Back Bar */}
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-hairline">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="TheDriftHub" className="h-7 w-auto object-contain" />
            <span className="font-sans font-black text-sm tracking-tight uppercase text-primary">TheDriftHub</span>
          </Link>
          <Link
            href="/"
            className="text-xs font-mono font-bold uppercase tracking-wider text-mute hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-canvas-soft rounded-full blur-3xl pointer-events-none opacity-80" />

        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full border border-hairline bg-canvas-soft text-xs font-mono tracking-widest uppercase text-mute font-bold">
            Free Movie Finder Online
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-primary mb-6">
            Movie Finder AI.<br />
            <span className="text-primary font-black">Find a Movie by Description.</span>
          </h1>

          {/* Subheading */}
          <p className="text-body text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-2">
            Use our free movie finder online to identify any film. Just describe a scene, a character, or a vague plot — our AI will find the movie with description alone.
          </p>
          <p className="text-mute text-sm font-mono tracking-wide">Free · Unlimited · Instant Results</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <div className="relative group">
          <div className="relative bg-canvas border border-hairline hover:border-hairline-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300">
            <form onSubmit={handleSubmit}>
              <label htmlFor="movie-description" className="block text-xs font-mono tracking-widest uppercase text-mute mb-3 font-semibold">
                Describe your movie
              </label>

              <textarea
                id="movie-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. A sci-fi movie where a guy gets stranded on Mars and has to grow potatoes to survive..."
                className="w-full bg-canvas-soft border border-hairline text-primary placeholder:text-mute/60 rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none text-base md:text-lg transition-all leading-relaxed"
                required
              />

              {/* Example chips */}
              <div className="flex flex-wrap gap-2 mt-4 mb-5">
                {EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDescription(ex.text)}
                    className="example-chip px-3 py-1.5 text-xs font-mono text-mute border border-hairline rounded-full hover:border-primary hover:text-primary hover:bg-canvas-soft-2 transition-all cursor-pointer font-medium"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="w-full bg-primary text-canvas font-sans font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-800 active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {!loading ? (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3" /><circle cx="11" cy="11" r="8" /></svg>
                    Find The Movie
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Identifying...
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto px-6 pb-12">
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-mono text-center">
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <section className="max-w-2xl mx-auto px-6 pb-20">
          <div className="relative">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-hairline" />
              <span className="text-xs font-mono tracking-widest uppercase text-mute font-bold">AI Result</span>
              <div className="h-px flex-1 bg-hairline" />
            </div>

            {/* Result Card */}
            <div className="bg-canvas border border-hairline-strong rounded-2xl overflow-hidden shadow-md transition-all duration-700 ease-out">
              {/* Top accent bar */}
              <div className="h-1 bg-primary" />

              <div className="p-6 md:p-8">
                {/* Title Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-1">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-primary leading-tight">
                    {result.title}
                  </h2>
                  {result.year && (
                    <span className="shrink-0 inline-flex items-center px-3 py-1 text-xs font-mono font-bold tracking-wider bg-canvas-soft border border-hairline rounded-full text-mute">
                      {result.year}
                    </span>
                  )}
                </div>

                {/* Genre tag */}
                {result.genre && (
                  <p className="text-sm font-mono text-body font-semibold mb-6">
                    {result.genre}
                  </p>
                )}

                {/* Divider */}
                <div className="h-px bg-hairline mb-6" />

                {/* Description */}
                <p className="text-body text-base md:text-lg leading-relaxed mb-6">
                  {result.description}
                </p>

                {/* Director */}
                {result.director && (
                  <div className="flex items-center gap-2 text-sm font-mono">
                    <span className="text-mute uppercase tracking-wider">Director</span>
                    <span className="text-hairline-strong">—</span>
                    <span className="text-primary font-semibold">{result.director}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Search Again Button */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-widest uppercase text-mute border border-hairline rounded-full hover:border-primary hover:text-primary hover:bg-canvas-soft-2 transition-all font-semibold cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                Search Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-hairline">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-primary mb-3">How It Works</h2>
          <p className="text-mute text-sm font-mono tracking-wide">Three steps. Zero sign-ups.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-canvas-soft border border-hairline flex items-center justify-center group-hover:border-primary group-hover:bg-canvas-soft-2 transition-all duration-300">
              <span className="text-2xl">✍️</span>
            </div>
            <div className="text-xs font-mono tracking-widest text-primary font-bold uppercase mb-2">Step 01</div>
            <h3 className="font-bold text-primary mb-2">Describe It</h3>
            <p className="text-sm text-body leading-relaxed">Type whatever you remember — a scene, a character, a feeling. Even vague descriptions work.</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-canvas-soft border border-hairline flex items-center justify-center group-hover:border-primary group-hover:bg-canvas-soft-2 transition-all duration-300">
              <span className="text-2xl">🧠</span>
            </div>
            <div className="text-xs font-mono tracking-widest text-primary font-bold uppercase mb-2">Step 02</div>
            <h3 className="font-bold text-primary mb-2">AI Identifies</h3>
            <p className="text-sm text-body leading-relaxed">Our AI cross-references millions of movies in seconds. Plot details, quotes, character traits — it understands them all.</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-canvas-soft border border-hairline flex items-center justify-center group-hover:border-primary group-hover:bg-canvas-soft-2 transition-all duration-300">
              <span className="text-2xl">🎬</span>
            </div>
            <div className="text-xs font-mono tracking-widest text-primary font-bold uppercase mb-2">Step 03</div>
            <h3 className="font-bold text-primary mb-2">Get the Title</h3>
            <p className="text-sm text-body leading-relaxed">Get the movie title, year, director, and a clean summary. No sign-up. No limits. Instantly.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-hairline">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-primary mb-10 text-center">Frequently Asked Questions</h2>

        <div className="space-y-0 divide-y divide-hairline">
          <details className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-primary hover:text-blue-700 transition-colors">
              <span>How do I find a movie by description?</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mute group-open:rotate-180 transition-transform duration-300"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p className="mt-3 text-body text-sm leading-relaxed">Our Movie Finder AI analyzes your plot description and cross-references millions of films. Simply type what you remember—a scene, a quote, or character details—and our movie finder website will instantly identify the exact title.</p>
          </details>

          <details className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-primary hover:text-blue-700 transition-colors">
              <span>Is this movie finder by description free?</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mute group-open:rotate-180 transition-transform duration-300"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p className="mt-3 text-body text-sm leading-relaxed">Yes, our movie finder by description is 100% free with no sign-up, no subscription, and no limits. Use this movie finder online as many times as you want — completely free forever.</p>
          </details>

          <details className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-primary hover:text-blue-700 transition-colors">
              <span>Does this movie finder website work for Bollywood, anime, or international films?</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mute group-open:rotate-180 transition-transform duration-300"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p className="mt-3 text-body text-sm leading-relaxed">Absolutely! Our movie finder website works for Hollywood, Bollywood, Korean cinema, Japanese anime, European art-house films, and more. Just describe the movie in English, and the Movie Finder AI will accurately identify it regardless of its original language.</p>
          </details>

          <details className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-primary hover:text-blue-700 transition-colors">
              <span>Can I find a movie with description if I only remember a vague scene?</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-mute group-open:rotate-180 transition-transform duration-300"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <p className="mt-3 text-body text-sm leading-relaxed">That is exactly what this tool is built for! You can find a movie with description even if it is vague or incomplete. Something like &apos;a movie where a kid befriends an alien and they fly on a bicycle&apos; is more than enough for our AI to identify it.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
