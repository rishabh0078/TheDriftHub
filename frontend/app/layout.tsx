import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://the-trend-obs.vercel.app'),
  title: 'TheDriftHub | Tech, Memes, Creators & Movie Reviews',
  description: 'TheDriftHub is your premier source for tech insights, viral meme trends, creator updates, and comprehensive movie & OTT series reviews.',
  openGraph: {
    title: 'TheDriftHub | Tech, Memes, Creators & Movie Reviews',
    description: 'The premier source for tech insights, viral meme trends, creator updates, and movie reviews.',
    url: 'https://the-trend-obs.vercel.app',
    siteName: 'TheDriftHub',
    images: [{ url: '/images/hero-img-2-1781883683283.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://the-trend-obs.vercel.app/#organization',
    name: 'TheDriftHub',
    url: 'https://the-trend-obs.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://the-trend-obs.vercel.app/logo.png',
      width: 600,
      height: 60,
    },
    sameAs: [],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://the-trend-obs.vercel.app/#website',
    name: 'TheDriftHub',
    alternateName: 'The Drift Hub',
    url: 'https://the-trend-obs.vercel.app/',
    description: 'TheDriftHub is your premier source for tech insights, viral meme trends, creator updates, and comprehensive movie & OTT series reviews.',
    publisher: { '@id': 'https://the-trend-obs.vercel.app/#organization' },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DQEKFP7B1X" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DQEKFP7B1X');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="bg-canvas text-ink min-h-screen flex flex-col selection:bg-primary selection:text-canvas-soft">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
