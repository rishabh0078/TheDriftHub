import type { Metadata } from 'next';
import MovieFinderClient from './MovieFinderClient';

export const metadata: Metadata = {
  title: 'Movie Finder AI – Describe a Movie & Find Its Name | TheDriftHub',
  description:
    'Use the best free movie finder online. Find a movie by describing it, a scene, a character, or a quote. Our Movie Finder AI identifies it instantly.',
  keywords: [
    'Movie Finder AI',
    'movie finder by description',
    'movie finder online',
    'find movie with description',
    'movie identifier',
  ],
  alternates: {
    canonical: 'https://thedrifthub.com/movie-finder',
  },
  openGraph: {
    title: 'Movie Finder AI — Find Any Film by Description',
    description: 'Describe a scene or plot in plain English and our AI will identify the exact movie title instantly.',
    url: 'https://thedrifthub.com/movie-finder',
  },
};

export default function MovieFinderPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Movie Finder AI',
    url: 'https://thedrifthub.com/movie-finder',
    description: 'Find a movie by describing a scene, plot point, or character.',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find a movie by description?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our Movie Finder AI analyzes your plot description and cross-references millions of films. Simply type what you remember—a scene, a quote, or character details—and our tool will instantly identify the exact title.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this movie finder by description free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our movie finder by description is 100% free with no sign-up, no subscription, and no limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does this work for international cinema and anime?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, it works across Hollywood, Bollywood, Korean cinema, anime, and European art-house films.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MovieFinderClient />
    </>
  );
}
