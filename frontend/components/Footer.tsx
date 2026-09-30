'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-primary text-canvas-soft border-t border-hairline mt-16 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
        
        {/* About Section */}
        <div className="flex flex-col space-y-4 col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="TheDriftHub" className="h-9 w-auto object-contain bg-canvas rounded-md p-1" />
            <span className="font-sans font-black text-xl tracking-tight uppercase text-canvas-soft group-hover:text-canvas transition-colors">
              TheDriftHub
            </span>
          </Link>
          <p className="text-xs text-mute font-sans leading-relaxed">
            The definitive journal and media publication covering artificial intelligence, internet culture, creator monetization, and cinematic critique.
          </p>
          <div className="pt-2 text-[10px] font-mono text-mute uppercase tracking-widest">
            ISSN: 2981-4209 · GLOBAL EDITION
          </div>
        </div>

        {/* Category Links */}
        <div className="flex flex-col space-y-3.5">
          <h3 className="font-mono text-xs font-bold tracking-widest text-mute uppercase">Editorial Streams</h3>
          <ul className="space-y-2.5 text-xs font-mono font-semibold uppercase tracking-wider">
            <li>
              <Link href="/tech-ai" className="text-mute hover:text-canvas transition-colors">
                Tech &amp; AI
              </Link>
            </li>
            <li>
              <Link href="/memes-trends" className="text-mute hover:text-canvas transition-colors">
                Memes &amp; Trends
              </Link>
            </li>
            <li>
              <Link href="/creators" className="text-mute hover:text-canvas transition-colors">
                Creators
              </Link>
            </li>
            <li>
              <Link href="/movies-ott" className="text-mute hover:text-canvas transition-colors">
                Movies &amp; OTT
              </Link>
            </li>
          </ul>
        </div>

        {/* Corporate Links */}
        <div className="flex flex-col space-y-3.5">
          <h3 className="font-mono text-xs font-bold tracking-widest text-mute uppercase">Intelligence &amp; Tools</h3>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/movie-finder" className="text-canvas hover:text-white font-bold transition-colors">✦ AI Movie Finder</Link></li>
            <li><Link href="/sitemap.xml" className="text-mute hover:text-canvas transition-colors">Sitemap Index</Link></li>
            <li><Link href="/robots.txt" className="text-mute hover:text-canvas transition-colors">Robots.txt Directives</Link></li>
            <li><Link href="/privacy" className="text-mute hover:text-canvas transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-mute hover:text-canvas transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter Capture */}
        <div className="flex flex-col space-y-4 col-span-1 md:col-span-1">
          <h3 className="font-mono text-xs font-bold tracking-widest text-mute uppercase">Stay Updated</h3>
          <p className="text-xs text-mute leading-relaxed">
            Join our exclusive community of tech enthusiasts and pop culture curators. No spam, just fresh trends.
          </p>
          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2 pt-2">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 text-sm bg-[#222222] border border-[#333333] rounded-md text-canvas-soft placeholder-mute focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-canvas text-primary hover:bg-neutral-200 transition-all font-sans font-bold text-xs uppercase tracking-wider py-2 rounded-md cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <div className="text-xs text-emerald-400 mt-2 font-mono">
              ✓ Welcome to TheDriftHub! Check your inbox soon.
            </div>
          )}
        </div>

      </div>

      {/* Copyright area */}
      <div className="max-w-6xl mx-auto px-6 border-t border-[#222222] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-mute">
        <div>
          © {new Date().getFullYear()} THEDRIFTHUB MEDIA LLC. ALL RIGHTS RESERVED.
        </div>
        <div className="mt-4 md:mt-0">
          POWERED BY <span className="text-canvas-soft font-semibold">NEXT.JS</span> &amp; <span className="text-canvas-soft font-semibold">TAILWIND</span>
        </div>
      </div>
    </footer>
  );
}
