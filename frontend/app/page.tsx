import Link from 'next/link';
import { getAllPosts } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import TrendingList from '@/components/TrendingList';
import { Clock } from 'lucide-react';

export const revalidate = 60;

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

export default async function HomePage() {
  const posts = await getAllPosts();

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const trendingPosts = posts.filter((p) => p.trending).slice(0, 5);
  const latestPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  const wordCount = featuredPost?.content ? featuredPost.content.split(/\s+/).length : 500;
  const featuredReadTime = Math.max(1, Math.round(wordCount / 220));

  const formattedDate = featuredPost?.pubDate
    ? new Date(featuredPost.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const catKey = featuredPost?.category || 'tech-ai';
  const catColor = categoryColors[catKey] || 'text-primary border-hairline-strong bg-canvas-soft';
  const catName = categoryNames[catKey] || 'Articles';

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: latestPosts.slice(0, 10).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://the-trend-obs.vercel.app/posts/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Primary semantic H1 for home page SEO */}
      <h1 className="sr-only">TheDriftHub — Tech, AI, Viral Trends &amp; Entertainment Reviews</h1>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Top Section: Lead Story (8 cols) + Trending Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 sm:pb-10 border-b border-hairline">
          
          {/* Primary Editorial Lead (8 cols) */}
          <div className="lg:col-span-8">
            {featuredPost && (
              <section className="group">
                <div className="flex items-center gap-3 text-xs font-mono tracking-wider mb-3">
                  <span className={`px-2.5 py-0.5 border rounded-full font-bold uppercase text-[11px] ${catColor}`}>
                    {catName}
                  </span>
                  <span className="text-hairline-strong">•</span>
                  <time dateTime={featuredPost.pubDate} className="text-mute font-medium">
                    {formattedDate}
                  </time>
                </div>

                {/* Big Title Above Image (Verge Magazine Style) */}
                <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-5xl leading-[1.08] tracking-tight text-primary group-hover:text-blue-700 transition-colors mb-4">
                  <Link href={`/posts/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-body text-base md:text-lg leading-relaxed mb-6 font-normal max-w-3xl">
                  {featuredPost.description}
                </p>

                {/* Featured Image */}
                <Link
                  href={`/posts/${featuredPost.slug}`}
                  className="block overflow-hidden rounded-xl aspect-[16/9] mb-5 bg-canvas-soft relative shadow-xs"
                >
                  <img
                    src={featuredPost.image || '/images/hero-img-2-1781883683283.jpg'}
                    alt={featuredPost.imageAlt || featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    loading="eager"
                  />
                </Link>

                {/* Author byline & read time */}
                <div className="flex items-center justify-between text-xs font-mono text-mute pt-1">
                  <span className="font-bold text-ink uppercase tracking-wider">{featuredPost.author}</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-mute" />
                    <span>{featuredReadTime} MIN READ</span>
                  </span>
                </div>
              </section>
            )}
          </div>

          {/* Top Sidebar (4 cols): Trending List + Movie Finder Card */}
          <aside className="lg:col-span-4 space-y-6 lg:border-l lg:border-hairline lg:pl-8 flex flex-col">
            {/* Trending Chart */}
            <TrendingList posts={trendingPosts} />

            {/* AI Movie Finder Promotional Spotlight */}
            <div className="rounded-xl border border-hairline bg-canvas-soft p-6 relative overflow-hidden shadow-xs group">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-canvas border border-hairline text-ink text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
                <span>🎬</span>
                <span>Flagship Tool</span>
              </div>

              <h4 className="font-sans font-black text-lg text-primary tracking-tight leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                Can't Remember a Movie Name?
              </h4>

              <p className="text-xs text-body leading-relaxed mb-4">
                Type any scene, plot memory, or vague quote. Our Movie Finder AI locates the film instantly with zero sign-ups.
              </p>

              <Link
                href="/movie-finder"
                className="inline-flex items-center justify-center gap-2 w-full bg-primary text-canvas hover:bg-neutral-800 transition-colors text-xs font-sans font-bold uppercase tracking-wider py-3 rounded-lg"
              >
                <span>Find Any Movie Now</span>
                <span className="text-sm">→</span>
              </Link>
            </div>
          </aside>

        </div>

        {/* Full-Width Latest Stories Grid covering the entire horizontal space */}
        <section className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
          <div className="border-b border-hairline pb-4 flex items-center justify-between">
            <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-primary">
              Latest Stories
            </h3>
            <span className="text-xs font-mono text-mute font-semibold">
              {latestPosts.length} Articles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
