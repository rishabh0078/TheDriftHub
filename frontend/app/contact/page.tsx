import type { Metadata } from 'next';
import { Mail, MessageSquare, Send, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Editorial Desk | TheDriftHub',
  description: 'Submit scoops, benchmark corrections, press releases, or partnership inquiries to TheDriftHub editorial team.',
  alternates: {
    canonical: 'https://thedrifthub.com/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-800 mb-4">
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Editorial Inquiries
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-4">
            Connect With The Editorial Desk
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            We welcome benchmark tips, whistleblowers, research feedback, and commercial syndication inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Direct Editorial Email
                </h3>
                <p className="text-base font-bold text-gray-900">contact@thedrifthub.com</p>
                <p className="text-xs text-gray-500 mt-1">General inquiries and editor feedback</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Research & Scoops
                </h3>
                <p className="text-base font-bold text-gray-900">tips@thedrifthub.com</p>
                <p className="text-xs text-gray-500 mt-1">Send confidential benchmarks or tips</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Response SLA
                </h3>
                <p className="text-sm text-gray-700">
                  Our editorial staff reviews verified inquiries within 24 business hours.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 text-xs text-gray-400">
              TheDriftHub Media Group • Global Digital Desk
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
            <form action="#" method="POST" className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-[#f9fafb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-[#f9fafb]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Desk / Topic
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-[#f9fafb]">
                  <option value="tech-ai">Tech & AI Model Benchmark</option>
                  <option value="memes-trends">Internet Trends & Lore</option>
                  <option value="creators">Creator Economy</option>
                  <option value="movies-ott">Movie & OTT Finder</option>
                  <option value="commercial">Sponsorship & Syndication</option>
                  <option value="other">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Your Dispatch or Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details, benchmark data, or feedback..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-[#f9fafb] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gray-950 hover:bg-black text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
