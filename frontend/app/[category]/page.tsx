import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import TrendingList from '@/components/TrendingList';

interface Props {
  params: Promise<{ category: string }>;
}

export const revalidate = 60;

const categoryMetadata: Record<string, { name: string; description: string; colorClass: string; barColor: string }> = {
  'tech-ai': {
    name: 'Tech & AI',
    description: 'Expert analysis and breaking news on artificial intelligence, spatial computing, hardware, and the future of technology.',
    colorClass: 'border-blue-200 text-blue-700 bg-blue-50/70',
    barColor: 'bg-blue-600',
  },
  'memes-trends': {
    name: 'Memes & Trends',
    description: 'Deconstructing the internet trends, memes, and viral movements shaping global culture and digital communication.',
    colorClass: 'border-amber-200 text-amber-800 bg-amber-50/70',
    barColor: 'bg-amber-600',
  },
  'creators': {
    name: 'Creators & Influencers',
    description: 'In-depth coverage of the creator economy, digital platforms, influencer culture, and talent migrations.',
    colorClass: 'border-indigo-200 text-indigo-700 bg-indigo-50/70',
    barColor: 'bg-indigo-600',
  },
  'movies-ott': {
    name: 'Movies & OTT',
    description: 'Unbiased reviews, production updates, and analysis of cinematic releases and streaming television shows.',
    colorClass: 'border-rose-200 text-rose-700 bg-rose-50/70',
    barColor: 'bg-rose-600',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMetadata[category];

  if (!meta) {
    return { title: 'Not Found | TheDriftHub' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://the-trend-obs.vercel.app';
  return {
    title: `${meta.name} | TheDriftHub`,
    description: meta.description,
    alternates: {
      canonical: `${siteUrl}/${category}`,
    },
    openGraph: {
      title: `${meta.name} | TheDriftHub`,
      description: meta.description,
      url: `${siteUrl}/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categoryMetadata[category];

  if (!meta) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const categoryPosts = allPosts.filter((post) => post.category === category);
  const trendingPosts = allPosts.filter((post) => post.trending).slice(0, 5);

  const SITE = 'https://the-trend-obs.vercel.app';
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE}/${category}/#collection`,
    url: `${SITE}/${category}`,
    name: `${meta.name} Articles | TheDriftHub`,
    description: meta.description,
    isPartOf: {
      '@id': `${SITE}/#website`,
    },
    about: {
      '@type': 'Thing',
      name: meta.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Top decorative accent bar based on stream */}
      <div className={`h-[2px] w-full ${meta.barColor}`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Editorial Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-mute mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span>Streams</span>
          <span>/</span>
          <span className="text-ink font-bold">{meta.name}</span>
        </nav>

        {/* Magazine Category Masthead */}
        <header className="border border-hairline p-6 sm:p-10 rounded-2xl mb-10 relative overflow-hidden bg-canvas-soft shadow-xs">
          <div className="absolute right-0 top-0 w-72 h-72 bg-canvas-soft-2 opacity-50 blur-3xl rounded-full pointer-events-none" />
          
          <div className="relative space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-mute uppercase font-semibold">
                {categoryPosts.length} {categoryPosts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </div>

            <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-primary leading-[1.05]">
              {meta.name}
            </h1>

            <p className="text-base sm:text-lg text-body leading-relaxed max-w-2xl font-normal">
              {meta.description}
            </p>
          </div>
        </header>

        {/* AI Movie Finder CTA — only on Movies & OTT page */}
        {category === 'movies-ott' && (
          <Link
            href="/movie-finder"
            className="group block border border-hairline hover:border-hairline-strong bg-canvas-soft rounded-xl p-6 sm:p-7 mb-10 transition-all duration-300 relative overflow-hidden shadow-xs"
          >
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-2xl">🎬</span>
                  <h2 className="font-sans font-black text-lg md:text-xl uppercase tracking-tight text-primary">AI Movie Finder</h2>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-primary text-canvas rounded-full">Free Tool</span>
                </div>
                <p className="text-sm text-body max-w-xl">Can't remember a movie's name? Describe the plot, a scene, or a quote — our neural AI identifies it instantly. Free &amp; unlimited.</p>
              </div>
              <div className="shrink-0 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary group-hover:gap-3 transition-all bg-canvas border border-hairline px-4 py-2.5 rounded-lg shadow-xs">
                Launch Finder Now
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </Link>
        )}

        {/* Category Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Content Feed (8 cols) */}
          <div className="lg:col-span-8">
            {categoryPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-hairline rounded-2xl bg-canvas-soft">
                <span className="text-3xl block mb-2">📡</span>
                <p className="text-mute font-mono text-sm uppercase tracking-wider">No dispatches published in this stream yet.</p>
                <Link href="/" className="inline-block mt-4 text-xs font-mono font-bold text-blue-600 hover:underline uppercase">Return to Main Stream →</Link>
              </div>
            )}
          </div>

          {/* Sidebar Rail (4 cols) */}
          <aside className="lg:col-span-4 space-y-8 lg:border-l lg:border-hairline lg:pl-8">
            <TrendingList posts={trendingPosts} />
          </aside>

        </div>
      </div>
    </>
  );
}
