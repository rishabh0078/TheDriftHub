import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | TheDriftHub',
  description: 'Terms and conditions governing the use of TheDriftHub articles, benchmarks, and interactive tools.',
  alternates: {
    canonical: 'https://thedrifthub.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-[2px] w-full bg-primary" />
      <div className="max-w-4xl mx-auto px-6 py-16 prose-editorial">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight uppercase mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026 • Effective Date: January 1, 2026
        </p>

        <div className="prose-custom max-w-none space-y-6 text-gray-700">
          <p>
            By accessing or using TheDriftHub (located at thedrifthub.com), you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2>1. Intellectual Property & Fair Use</h2>
          <p>
            All original editorial articles, investigative analyses, custom benchmarks, and interactive tools published on TheDriftHub are the intellectual property of TheDriftHub Media Group, protected by copyright and intellectual property laws.
          </p>
          <p>
            You may quote brief excerpts (under 150 words) provided prominent, do-follow hyperlink attribution is given back to the original article source on <code>thedrifthub.com</code>. Bulk scraping or republishing full articles without explicit written consent is strictly prohibited.
          </p>

          <h2>2. Accuracy of AI & Benchmark Information</h2>
          <p>
            Our benchmarks and technical analyses are conducted with rigorous engineering methodologies. However, frontier AI models evolve rapidly. Content is provided for educational and informational purposes &ldquo;as is&rdquo; without warranties of any kind.
          </p>

          <h2>3. User Conduct</h2>
          <p>
            When utilizing our interactive tools (such as Movie Finder AI or newsletter submission forms), you agree not to submit abusive, illegal, or malicious payloads designed to disrupt server operations or bypass rate limits.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall TheDriftHub or its editors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the materials on this website.
          </p>

          <h2>5. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the competent courts.
          </p>
        </div>
      </div>
    </div>
  );
}
