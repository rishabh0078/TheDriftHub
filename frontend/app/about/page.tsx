import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Cpu, Terminal, Sparkles, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TheDriftHub — Mission, Ethics & Editorial Standards',
  description: 'Learn about TheDriftHub: our engineering-first editorial desk, testing methodologies, and mission to decode frontier AI and internet culture.',
  alternates: {
    canonical: 'https://thedrifthub.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-4">
          <Award className="w-3.5 h-3.5" />
          Editorial Independence
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-6">
          Signal Over Noise in Frontier Tech & AI.
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-12">
          TheDriftHub is an independent publication dedicated to stress-testing frontier artificial intelligence, auditing creator platform algorithms, and examining the cultural shifts redefining our digital landscape.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200">
            <Cpu className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-gray-950 text-base mb-2">Empirical Benchmarks</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We test LLMs on reproducible code execution, reasoning tasks, and real API latencies—never vendor marketing decks.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-4" />
            <h3 className="font-bold text-gray-950 text-base mb-2">Editorial Integrity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our reviews are completely uninfluenced by venture capital or vendor sponsorship. If a model fails in production, we say so.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200">
            <Terminal className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-bold text-gray-950 text-base mb-2">Autonomous Scouting</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our 24/7 background research pipelines monitor arXiv, HackerNews, and code repositories to surface emerging shifts first.
            </p>
          </div>
        </div>

        <div className="prose-custom max-w-none text-gray-700 border-t border-gray-200 pt-12">
          <h2>Our Core Desks</h2>
          <ul>
            <li>
              <strong>Tech & AI:</strong> Frontier model evaluations, inference cost matrices, open-weights releases (DeepSeek, LLaMA, Mistral), and AI developer infrastructure.
            </li>
            <li>
              <strong>Memes & Trends:</strong> Dissecting internet culture, emergent social formats, viral gaming economies (GTA 6, esports), and digital lore.
            </li>
            <li>
              <strong>Creators:</strong> Platform algorithmic updates, monetization roadmaps, short-form vs long-form dynamics, and creator workflows.
            </li>
            <li>
              <strong>Movies & OTT:</strong> Curated cinema recommendations, streaming trends, and our custom AI Movie Identifier tool.
            </li>
          </ul>

          <h2>Editorial & Fact-Checking Policy</h2>
          <p>
            Every dispatch undergoes rigorous verification. We verify claims against primary documentation, benchmark repositories, and public codebases before publication.
          </p>

          <h2>Get in Touch</h2>
          <p>
            Have a scoop, code benchmark, or press inquiry? Reach out directly via our{' '}
            <Link href="/contact" className="text-blue-600 font-semibold underline">
              contact desk
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
