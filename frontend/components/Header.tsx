'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/95 backdrop-blur-md border-b border-hairline">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Brand Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group select-none" aria-label="TheDriftHub Home">
            <img
              src="/logo.png"
              alt="TheDriftHub"
              className="h-8 md:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-sans font-black text-lg md:text-xl tracking-tight uppercase text-primary">
              TheDriftHub
            </span>
          </Link>

          {/* Stream Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 font-sans font-bold text-xs uppercase tracking-wider text-body">
            <Link href="/" className="px-3.5 py-2 rounded-md hover:text-primary hover:bg-canvas-soft-2 transition-all">
              All Stories
            </Link>
            <Link href="/tech-ai" className="px-3.5 py-2 rounded-md hover:text-primary hover:bg-canvas-soft-2 transition-all">
              Tech &amp; AI
            </Link>
            <Link href="/memes-trends" className="px-3.5 py-2 rounded-md hover:text-primary hover:bg-canvas-soft-2 transition-all">
              Memes &amp; Trends
            </Link>
            <Link href="/creators" className="px-3.5 py-2 rounded-md hover:text-primary hover:bg-canvas-soft-2 transition-all">
              Creators
            </Link>
            <Link href="/movies-ott" className="px-3.5 py-2 rounded-md hover:text-primary hover:bg-canvas-soft-2 transition-all">
              Movies &amp; OTT
            </Link>
          </nav>

          {/* Right Action Item (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/movie-finder"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-hairline-strong bg-canvas-soft hover:bg-primary hover:text-canvas text-primary text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200"
            >
              <span>🎬</span>
              <span>Movie Finder AI</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 rounded text-body hover:text-primary hover:bg-canvas-soft-2 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-4 py-4 space-y-1.5 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-bold text-body hover:text-primary hover:bg-canvas-soft-2"
          >
            All Stories
          </Link>
          <Link
            href="/tech-ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-bold text-body hover:text-primary hover:bg-canvas-soft-2"
          >
            Tech &amp; AI
          </Link>
          <Link
            href="/memes-trends"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-bold text-body hover:text-primary hover:bg-canvas-soft-2"
          >
            Memes &amp; Trends
          </Link>
          <Link
            href="/creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-bold text-body hover:text-primary hover:bg-canvas-soft-2"
          >
            Creators &amp; Influencers
          </Link>
          <Link
            href="/movies-ott"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-md text-sm font-bold text-body hover:text-primary hover:bg-canvas-soft-2"
          >
            Movies &amp; OTT
          </Link>
          <div className="pt-2 border-t border-hairline">
            <Link
              href="/movie-finder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-bold text-primary bg-canvas-soft border border-hairline"
            >
              <span>🎬 AI Movie Finder</span>
              <span className="text-xs font-mono uppercase bg-primary text-canvas px-2 py-0.5 rounded font-bold">Free</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
