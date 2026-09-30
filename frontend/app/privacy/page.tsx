import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | TheDriftHub',
  description: 'Learn how TheDriftHub collects, protects, and handles personal data and privacy standards.',
  alternates: {
    canonical: 'https://thedrifthub.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-[2px] w-full bg-primary" />
      <div className="max-w-4xl mx-auto px-6 py-16 prose-editorial">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight uppercase mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 font-mono mb-8">
          Last Updated: September 2026 • Effective Date: January 1, 2026
        </p>

        <div className="prose-custom max-w-none space-y-6 text-gray-700">
          <p>
            Welcome to TheDriftHub (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to safeguarding your privacy and ensuring your personal information is treated with transparency, security, and respect.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information strictly necessary to provide high-quality journalism, benchmark reports, and interactive utility tools:
          </p>
          <ul>
            <li>
              <strong>Voluntary Information:</strong> Email addresses submitted when subscribing to <em>The Drift Briefing</em> newsletter or submitting feedback through our contact forms.
            </li>
            <li>
              <strong>Analytical & Technical Data:</strong> Anonymized data including browser type, referring URLs, time spent on articles, and general device telemetry to optimize page performance and Core Web Vitals.
            </li>
            <li>
              <strong>Cookies and Web Beacons:</strong> Standard cookies used to maintain reader preferences and ensure fair analytical telemetry.
            </li>
          </ul>

          <h2>2. How We Use Collected Information</h2>
          <p>
            We do not sell, rent, or lease reader data to third-party data brokers. Information collected is used exclusively to:
          </p>
          <ul>
            <li>Deliver requested editorial newsletters and breaking tech alerts.</li>
            <li>Maintain server uptime, detect malicious scrapers, and prevent security breaches.</li>
            <li>Analyze reader interest to prioritize future model evaluations and investigations.</li>
          </ul>

          <h2>3. Third-Party Services and Analytics</h2>
          <p>
            We may use privacy-preserving analytics platforms (such as Google Analytics or Plausible) to monitor aggregate traffic patterns. These services adhere to industry-standard data protection regulations including GDPR and CCPA.
          </p>

          <h2>4. Data Rights and Opt-Out</h2>
          <p>
            You have the right to request deletion of your newsletter subscription or inquire about stored details at any time by contacting our editorial team at <code>privacy@thedrifthub.com</code>.
          </p>

          <h2>5. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy, please email us at <code>privacy@thedrifthub.com</code> or write to our editorial headquarters.
          </p>
        </div>
      </div>
    </div>
  );
}
