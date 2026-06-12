'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  html: string;
  code: string;
}

export function CodeBlock({ html, code }: CodeBlockProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-neutral-700/50">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded bg-neutral-700/80 px-2 py-1 text-xs text-neutral-300 opacity-0 transition-colors hover:bg-neutral-600 hover:text-neutral-50 focus:opacity-100 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            Copy
          </>
        )}
      </button>
      <div
        className="overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
