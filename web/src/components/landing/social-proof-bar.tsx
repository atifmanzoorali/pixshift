'use client';

import { motion } from 'framer-motion';

const items = [
  'No vendor lock-in',
  'PNG · JPG · WebP · AVIF · GIF',
  'API key in 60 seconds',
  'SHA-256 key hashing',
  'REST API',
  'Built with Sharp',
  'Max 4 MB per file',
  'Usage dashboard included',
  'Supabase auth',
  'No SDK required',
];

export function SocialProofBar(): JSX.Element {
  return (
    <div className="overflow-hidden border-y border-border bg-surface py-10">
      <p className="mb-6 px-6 text-center text-xs font-semibold uppercase tracking-widest text-neutral-500">
        Built for developers who read the source code before they trust the product
      </p>
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-10 whitespace-nowrap will-change-transform"
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex flex-shrink-0 items-center gap-3 text-sm font-medium text-neutral-400"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
