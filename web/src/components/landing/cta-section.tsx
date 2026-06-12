'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const wordReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const headlineWords = [
  'Your',
  'image',
  'conversion',
  'pipeline',
  'should',
  'be',
  'an',
  'API',
  'call,',
  'not',
  'a',
  'todo',
  'item.',
];

export function CTASection(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Full-bleed gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #1A0A3E 0%, #0D0720 40%, #09090F 100%)',
        }}
        aria-hidden="true"
      />

      {/* Radial glow — centered */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{ background: 'rgba(124, 58, 237, 0.25)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[200px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
          style={{ background: 'rgba(167, 139, 250, 0.15)' }}
        />
      </div>

      {/* Top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-8">
        {/* Word-by-word headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-8 font-display text-4xl font-bold leading-tight tracking-tight text-neutral-50 md:text-5xl lg:text-6xl"
        >
          {headlineWords.map((word, i) => (
            <motion.span key={i} variants={wordReveal} className="mr-[0.22em] inline-block">
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          className="mb-10 text-lg leading-relaxed text-muted md:text-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Create an account, get your key, and make your first conversion in the next five minutes.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-semibold text-primary shadow-xl transition-all duration-150 hover:scale-[1.02] hover:bg-neutral-100"
          >
            Create your free account
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-4 text-base font-semibold text-neutral-200 transition-all duration-150 hover:border-white/40 hover:bg-white/5"
          >
            Read the docs
          </Link>
        </motion.div>

        <motion.p
          className="mt-5 text-sm text-neutral-500"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          No credit card required · No SDK required · API key in 60 seconds
        </motion.p>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
