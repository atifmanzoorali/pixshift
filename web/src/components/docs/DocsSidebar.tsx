'use client';

import { SIDEBAR_GROUPS } from './docs-content';

interface DocsSidebarProps {
  activeId: string;
}

export function DocsSidebar({ activeId }: DocsSidebarProps): JSX.Element {
  const handleClick = (id: string): void => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="space-y-4">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-600">
        On this page
      </p>

      {SIDEBAR_GROUPS.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {group.label}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors duration-100 ${
                    activeId === id
                      ? 'bg-white/5 font-medium text-neutral-50'
                      : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
