import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/navbar';
import { DocsSections } from '@/components/docs/DocsSections';
import { buildDocsData } from '@/lib/docs-data';

export const metadata: Metadata = {
  title: 'API Reference — PixShift',
  description:
    'Complete API reference for the PixShift image processing API. Convert, compress, and resize images via HTTP.',
};

export default async function DocsPage(): Promise<JSX.Element> {
  const data = await buildDocsData();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-900 pt-16">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          {/* Page header */}
          <div className="mb-12 max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
              Developer Reference
            </p>
            <h1 className="mb-4 font-display text-4xl font-bold text-neutral-50">API Reference</h1>
            <p className="leading-relaxed text-neutral-400">
              Everything you need to integrate PixShift image processing into your application.
            </p>
          </div>

          <DocsSections data={data} />
        </div>
      </div>
    </>
  );
}
