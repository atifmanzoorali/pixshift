import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PixShift — Image Conversion API for Developers | Free to Start',
  description:
    'Convert PNG, JPG, WebP, AVIF via a clean REST API. Open source, usage-based pricing, and no $150/month platform fee. API key in 60 seconds.',
  openGraph: {
    title: 'PixShift — Image Conversion API Without the Enterprise Price Tag',
    description:
      'Open source image conversion API. Convert, compress, and resize via HTTP. API keys, usage tracking, and rate limiting — all built in. Free to start.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-900 text-neutral-50 font-body antialiased">{children}</body>
    </html>
  );
}
