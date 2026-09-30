import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  post: Post;
}

const categoryNames: Record<string, string> = {
  'tech-ai': 'Tech & AI',
  'memes-trends': 'Memes & Trends',
  'creators': 'Creators',
  'movies-ott': 'Movies & OTT',
};

const categoryColors: Record<string, string> = {
  'tech-ai': 'text-blue-700 border-blue-200 bg-blue-50/70',
  'memes-trends': 'text-amber-800 border-amber-200 bg-amber-50/70',
  'creators': 'text-indigo-700 border-indigo-200 bg-indigo-50/70',
  'movies-ott': 'text-rose-700 border-rose-200 bg-rose-50/70',
};

export default function ArticleCard({ post }: ArticleCardProps) {
  const wordCount = post.content ? post.content.split(/\s+/).length : 500;
  const readTime = Math.max(1, Math.round(wordCount / 220));

  const formattedDate = post.pubDate
    ? new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  const catKey = post.category || 'tech-ai';
  const catColor = categoryColors[catKey] || 'text-primary border-hairline-strong bg-canvas-soft';
  const catName = categoryNames[catKey] || 'Articles';

  return (
    <article className="group flex flex-col bg-canvas border border-hairline hover:border-hairline-strong rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Image Container */}
      <Link
        href={`/posts/${post.slug}`}
        className="block overflow-hidden rounded-lg relative aspect-video bg-canvas-soft mb-4.5"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={post.image || '/images/hero-img-2-1781883683283.jpg'}
          alt={post.imageAlt || post.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-grow">
        {/* Stream Pill & Timestamp */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono tracking-wider mb-2.5">
          <Link
            href={`/${post.category}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full font-bold uppercase transition-opacity hover:opacity-80 ${catColor}`}
          >
            <span>{catName}</span>
          </Link>
          <time dateTime={post.pubDate} className="text-mute shrink-0">
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h3 className="font-sans font-black text-lg md:text-xl leading-[1.25] tracking-tight text-primary group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
          <Link href={`/posts/${post.slug}`} className="focus:outline-none focus:underline">
            {post.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-xs md:text-sm text-body leading-relaxed line-clamp-2 mb-4 font-normal">
          {post.description}
        </p>

        {/* Meta Footer */}
        <div className="pt-3.5 border-t border-hairline mt-auto flex items-center justify-between text-[11px] font-mono text-mute">
          <span className="font-bold text-ink uppercase tracking-wider">{post.author}</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Clock className="w-3 h-3 text-mute inline-block" />
            <span>{readTime} MIN READ</span>
          </span>
        </div>
      </div>
    </article>
  );
}
