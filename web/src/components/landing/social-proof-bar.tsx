'use client';

import { motion } from 'framer-motion';

const items = [
  'Open source',
  'No vendor lock-in',
  'PNG · JPG · WebP · AVIF',
  'API key in 60 seconds',
  '100 calls/hour free',
  'SHA-256 key hashing',
  'Full test suite',
  'Alembic migrations',
  'REST API',
  'OpenAPI docs included',
];

export function SocialProofBar(): JSX.Element {
  return (
    <div className="py-10 border-y border-border overflow-hidden">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-6">
        Built for developers who read the source code before they trust the product
      </p>
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          className="flex gap-10 items-center whitespace-nowrap"
        >
          {[...items, ...items].map((item, i) => (
            <span key={i} className="text-sm font-medium text-neutral-500 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
