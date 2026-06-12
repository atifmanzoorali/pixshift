'use client';

import { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { ParameterTable } from './ParameterTable';
import { ErrorTable } from './ErrorTable';
import type { CodeExamples, Parameter, ErrorEntry } from './docs-content';

type TabId = 'curl' | 'js' | 'python';

const TABS: { id: TabId; label: string }[] = [
  { id: 'curl', label: 'curl' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
];

interface EndpointCardProps {
  sectionId: string;
  method: 'POST';
  path: string;
  description: string;
  auth: string;
  parameters: Parameter[];
  showDefault?: boolean;
  mimeNote?: string;
  responseNote: string;
  aspectRatioNote?: string;
  examples: CodeExamples;
  errors: ErrorEntry[];
}

export function EndpointCard({
  sectionId,
  method,
  path,
  description,
  auth,
  parameters,
  showDefault = false,
  mimeNote,
  responseNote,
  aspectRatioNote,
  examples,
  errors,
}: EndpointCardProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>('curl');

  return (
    <div id={sectionId} className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-mono text-xs font-bold text-primary">
          {method}
        </span>
        <code className="break-all font-mono text-lg font-semibold text-neutral-100">{path}</code>
      </div>

      <p className="leading-relaxed text-neutral-300">{description}</p>

      {/* Auth */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-neutral-500">Auth:</span>
        <code className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs text-accent">
          {auth}
        </code>
      </div>

      {/* Parameters */}
      {parameters.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Request — multipart/form-data
          </h4>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-1">
            <ParameterTable parameters={parameters} showDefault={showDefault} />
          </div>
        </div>
      )}

      {/* Aspect ratio clarification */}
      {aspectRatioNote && (
        <div className="rounded-lg border border-info/20 bg-info/5 px-4 py-3 text-sm leading-relaxed text-neutral-300">
          <span className="font-medium text-info">Aspect ratio behaviour: </span>
          {aspectRatioNote}
        </div>
      )}

      {/* Response */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Response
        </h4>
        <p className="text-sm leading-relaxed text-neutral-400">{responseNote}</p>
        {mimeNote && <p className="mt-1 text-sm leading-relaxed text-neutral-500">{mimeNote}</p>}
      </div>

      {/* Code examples */}
      <div>
        <div className="mb-2 flex items-center gap-1">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === id
                  ? 'bg-neutral-700 text-neutral-50'
                  : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <CodeBlock html={examples[activeTab].html} code={examples[activeTab].code} />
      </div>

      {/* Errors */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Errors
        </h4>
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-1">
          <ErrorTable errors={errors} />
        </div>
      </div>
    </div>
  );
}
