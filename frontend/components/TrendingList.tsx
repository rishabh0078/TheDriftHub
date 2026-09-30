import React from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';

interface TrendingListProps {
  posts: Post[];
}

const categoryNames: Record<string, string> = {
  'tech-ai': 'Tech & AI',
  'memes-trends': 'Memes & Trends',
  'creators': 'Creators',
  'movies-ott': 'Movies & OTT',
};

export default function TrendingList({ posts }: TrendingListProps) {
  const trending = posts.slice(0, 5);

  return (
    <div className="bg-canvas border border-hairline p-6 rounded-xl shadow-xs">
      <div className="border-b border-hairline pb-3 mb-5">
        <h3 className="font-sans font-black text-base uppercase tracking-tight text-primary">
          Trending Stories
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-hairline">
        {trending.map((post, index) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group py-3.5 flex items-start space-x-3.5 first:pt-0 last:pb-0 transition-colors"
          >
            {/* Number index */}
            <span className="font-sans font-black text-2xl md:text-3xl text-hairline-strong group-hover:text-primary transition-colors leading-none shrink-0 w-8 select-none">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Details */}
            <div className="flex-grow space-y-1">
              {/* Category */}
              <span className="font-mono text-[9px] font-bold tracking-widest text-mute uppercase block">
                {categoryNames[post.category] || post.category}
              </span>
              {/* Title */}
              <h4 className="font-sans font-bold text-sm leading-snug text-primary group-hover:text-blue-700 transition-colors line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
