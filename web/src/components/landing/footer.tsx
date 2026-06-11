import Link from 'next/link';

const footerLinks: Record<string, { href: string; label: string }[]> = {
  Product: [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/changelog', label: 'Changelog' },
  ],
  Developers: [
    { href: '/docs', label: 'Quick Start' },
    { href: '/docs/endpoints', label: 'Endpoints' },
    { href: '/docs/rate-limits', label: 'Rate Limits' },
    { href: '/status', label: 'Status' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: 'https://github.com/atifmanzoorali/pixshift', label: 'GitHub' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export function Footer(): JSX.Element {
  return (
    <footer className="w-full bg-neutral-900 border-t border-border px-6 md:px-8 lg:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-lg font-bold text-neutral-50">
              Pix<span className="text-accent">Shift</span>
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Image conversion API. Clean, open, and actually priced right.
            </p>
            <Link
              href="/register"
              className="inline-block mt-4 text-sm text-accent hover:text-neutral-200 transition-colors"
            >
              Get your API key →
            </Link>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-semibold text-neutral-50 mb-4">{category}</p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500">© 2026 PixShift. Built with intent.</p>
          <a
            href="https://atifmanzoor.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            atifmanzoor.cloud
          </a>
        </div>
      </div>
    </footer>
  );
}
