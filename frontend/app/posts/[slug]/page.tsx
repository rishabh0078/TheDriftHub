import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPostBySlug, getAllPosts } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import { marked } from 'marked';
import ArticleClientInteractivity from './ArticleClientInteractivity';
import { Clock } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found | TheDriftHub' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://the-trend-obs.vercel.app';
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const imageUrl = post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`;

  return {
    title: `${post.title} | TheDriftHub`,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: postUrl },
    openGraph: {
      title: `${post.title} | TheDriftHub`,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.pubDate,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const wordCount = post.content ? post.content.split(/\s+/).length : 500;
  const readTime = Math.max(1, Math.round(wordCount / 220));

  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const formattedDate = post.pubDate
    ? new Date(post.pubDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const catKey = post.category || 'tech-ai';
  const catColor = categoryColors[catKey] || 'text-primary border-hairline-strong bg-canvas-soft';
  const catName = categoryNames[catKey] || 'Articles';

  const SITE = 'https://the-trend-obs.vercel.app';
  const postUrl = `${SITE}/posts/${post.slug}`;

  // Render markdown to html
  const htmlContent = marked.parse(post.content || '', { async: false }) as string;

  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}/#post`,
    url: postUrl,
    headline: post.title,
    description: post.description,
    image: {
      '@type': 'ImageObject',
      url: post.image.startsWith('http') ? post.image : `${SITE}${post.image}`,
      width: 1200,
      height: 630,
    },
    datePublished: post.pubDate,
    dateModified: post.updatedAt || post.pubDate,
    keywords: (post.tags || []).join(', '),
    articleSection: catName,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: post.author,
      image: post.authorImage || `${SITE}/logo.png`,
    },
    publisher: { '@id': `${SITE}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: catName, item: `${SITE}/${post.category}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Reading Progress Bar and Client Handlers */}
      <ArticleClientInteractivity postTitle={post.title} postUrl={postUrl} />

      {/* Decorative top accent rule */}
      <div className="h-[2px] w-full bg-primary" />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb Nav */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-mute mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${post.category}`} className="hover:text-primary transition-colors">{catName}</Link>
          <span>/</span>
          <span className="text-ink font-bold line-clamp-1 max-w-[200px] sm:max-w-none">Article</span>
        </nav>

        {/* Editorial Article Header */}
        <header className="space-y-6 text-left pb-8 border-b border-hairline">
          {/* Category Badge */}
          <div>
            <Link
              href={`/${post.category}`}
              className={`inline-block px-3 py-1 text-xs font-mono font-bold tracking-widest uppercase border rounded-full transition-opacity hover:opacity-80 ${catColor}`}
            >
              {catName}
            </Link>
          </div>

          {/* Headline */}
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-primary leading-[1.08]">
            {post.title}
          </h1>

          {/* Editorial Standfirst / Deck Excerpt */}
          {post.description && (
            <p className="text-lg sm:text-xl text-body leading-relaxed font-normal border-l-2 border-primary/20 pl-4 py-0.5">
              {post.description}
            </p>
          )}

          {/* Author and Date byline bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs font-mono text-mute">
            <div className="flex items-center gap-3">
              <img
                src={post.authorImage || '/logo.png'}
                alt={post.author}
                className="w-10 h-10 rounded-lg border border-hairline object-contain bg-canvas p-1"
              />
              <div className="text-left">
                <p className="font-bold text-ink uppercase tracking-wider">{post.author}</p>
                <p className="text-[11px] text-mute">
                  Published on <time dateTime={post.pubDate} className="text-ink font-medium">{formattedDate}</time>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas-soft border border-hairline">
                <Clock className="w-3.5 h-3.5 text-mute" />
                <span>{readTime} MIN READ</span>
              </span>
            </div>
          </div>
        </header>

        {/* Large Featured Image with rounded corners */}
        <div className="my-8 sm:my-10 overflow-hidden rounded-2xl aspect-[16/9] bg-canvas-soft border border-hairline shadow-xs">
          <img
            src={post.image || '/images/hero-img-2-1781883683283.jpg'}
            alt={post.imageAlt || post.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content Grid with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Share buttons (Sticky left column) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-5">
              <div className="border-b border-hairline pb-2">
                <p className="font-mono text-[10px] font-bold text-ink tracking-widest uppercase">Share Dispatch</p>
              </div>
              <div className="flex flex-col space-y-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono font-bold text-ink hover:text-white hover:bg-black transition-all border border-hairline py-2.5 px-3.5 rounded-lg bg-canvas-soft"
                >
                  <span>X / TWITTER</span>
                  <span>↗</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + postUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-xs font-mono font-bold text-ink hover:text-white hover:bg-emerald-600 transition-all border border-hairline py-2.5 px-3.5 rounded-lg bg-canvas-soft"
                >
                  <span>WHATSAPP</span>
                  <span>↗</span>
                </a>
                <button
                  id="copy-link-btn"
                  className="flex items-center justify-between text-xs font-mono font-bold text-ink hover:text-white hover:bg-primary transition-all border border-hairline py-2.5 px-3.5 rounded-lg bg-canvas-soft text-left cursor-pointer"
                >
                  <span>COPY LINK</span>
                  <span>🔗</span>
                </button>
                <div id="copy-success" className="hidden text-[11px] font-mono font-bold text-emerald-600 text-center py-1">
                  ✓ Copied to clipboard!
                </div>
              </div>

              {/* Tags Box */}
              {post.tags && post.tags.length > 0 && (
                <div className="pt-4 border-t border-hairline space-y-2">
                  <p className="font-mono text-[10px] font-bold text-ink tracking-widest uppercase">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 bg-canvas-soft border border-hairline rounded-md text-mute">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Body Text (High-End Magazine Typography) */}
          <div className="lg:col-span-9 max-w-none text-ink leading-relaxed">
            <div
              className="dropcap font-sans space-y-6 text-base sm:text-lg leading-[1.75] text-[#222222] prose-editorial [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-black [&>h2]:tracking-tight [&>h2]:text-primary [&>h2]:pt-6 [&>h2]:pb-1 [&>h3]:text-xl [&>h3]:font-black [&>h3]:text-primary [&>h3]:pt-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-body [&>blockquote]:font-serif [&>blockquote]:text-xl"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Article Footer / Author Bio Box */}
            <div className="mt-12 p-6 sm:p-8 bg-canvas-soft border border-hairline rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={post.authorImage || '/logo.png'}
                alt={post.author}
                className="w-14 h-14 rounded-lg border border-hairline object-contain bg-canvas p-1 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-sans font-black text-base uppercase tracking-tight text-primary">{post.author}</h4>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-primary text-canvas rounded-full">
                    Editorial Staff
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-body leading-relaxed">
                  Covering the latest disruptions in technology, emerging artificial intelligence models, creator culture, and streaming entertainment for TheDriftHub.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Footer */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-hairline mt-16 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-sans font-black text-xl sm:text-2xl uppercase tracking-tight text-primary">
                More in {catName}
              </h3>
              <Link href={`/${post.category}`} className="text-xs font-mono font-bold text-primary hover:underline uppercase">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <ArticleCard key={rPost.slug} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
