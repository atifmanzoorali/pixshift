'use client';

import type { Parameter } from './docs-content';

interface ParameterTableProps {
  parameters: Parameter[];
  showDefault?: boolean;
}

export function ParameterTable({
  parameters,
  showDefault = false,
}: ParameterTableProps): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">Field</th>
            <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">Type</th>
            <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">Required</th>
            {showDefault && (
              <th className="py-2.5 pr-6 text-left text-xs font-medium text-neutral-500">
                Default
              </th>
            )}
            <th className="py-2.5 text-left text-xs font-medium text-neutral-500">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {parameters.map((p) => (
            <tr key={p.field}>
              <td className="whitespace-nowrap py-3 pr-6 font-mono text-xs text-accent">
                {p.field}
              </td>
              <td className="whitespace-nowrap py-3 pr-6 font-mono text-xs text-neutral-400">
                {p.type}
              </td>
              <td className="whitespace-nowrap py-3 pr-6 text-xs">
                {p.required ? (
                  <span className="text-amber-400">Yes</span>
                ) : (
                  <span className="text-neutral-500">No</span>
                )}
              </td>
              {showDefault && (
                <td className="whitespace-nowrap py-3 pr-6 font-mono text-xs text-neutral-500">
                  {p.defaultValue ?? '—'}
                </td>
              )}
              <td className="py-3 text-xs text-neutral-400">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
