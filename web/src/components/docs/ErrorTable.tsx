'use client';

import type { ErrorEntry } from './docs-content';

interface ErrorTableProps {
  errors: ErrorEntry[];
}

export function ErrorTable({ errors }: ErrorTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">Code</th>
            <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">HTTP</th>
            <th className="py-2.5 text-left text-xs font-medium text-neutral-500">Meaning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {errors.map((e) => (
            <tr key={e.code}>
              <td className="whitespace-nowrap py-3 pr-6 font-mono text-xs text-accent">
                {e.code}
              </td>
              <td className="py-3 pr-6 font-mono text-xs text-neutral-400">{e.http}</td>
              <td className="py-3 text-xs text-neutral-400">{e.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
