export interface Post {
  id?: number | string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  author: string;
  authorImage?: string;
  featured?: boolean;
  trending?: boolean;
  weeklyHighlight?: boolean;
  draft?: boolean;
  seoScore?: number;
  pubDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryKey = 'all' | 'tech-ai' | 'memes-trends' | 'creators' | 'movies-ott';

export const CATEGORIES: { key: string; label: string; desc: string; color: string; badgeCls: string }[] = [
  { key: 'tech-ai', label: 'Tech & AI', desc: 'Breakthrough artificial intelligence, deep models, agents & software engineering.', color: '#2563eb', badgeCls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800' },
  { key: 'memes-trends', label: 'Memes & Trends', desc: 'Viral internet culture, emerging phenomena, and online subcultures.', color: '#db2777', badgeCls: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800' },
  { key: 'creators', label: 'Creators', desc: 'Creator economy insights, YouTube algorithms, monetization and digital workflows.', color: '#7c3aed', badgeCls: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800' },
  { key: 'movies-ott', label: 'Movies & OTT', desc: 'Cinematic analysis, streaming releases, indie cinema and box office movements.', color: '#d97706', badgeCls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800' },
];
