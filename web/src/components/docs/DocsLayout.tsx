'use client';

import { useState, useEffect } from 'react';
import { DocsSidebar } from './DocsSidebar';
import { SIDEBAR_SECTIONS } from './docs-content';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps): JSX.Element {
  const [activeId, setActiveId] = useState<string>('quick-start');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 }
    );

    SIDEBAR_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleMobileNav = (id: string): void => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex gap-10">
      {/* Desktop sidebar */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-24">
          <DocsSidebar activeId={activeId} />
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1">
        {/* Mobile section jump */}
        <div className="mb-8 lg:hidden">
          <select
            value={activeId}
            onChange={(e) => handleMobileNav(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-800 px-3 py-2.5 text-sm text-neutral-200 focus:border-primary focus:outline-none"
          >
            {SIDEBAR_SECTIONS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-20">{children}</div>
      </main>
    </div>
  );
}
