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
          background:
            'linear-gradient(160deg, #1A0A3E 0%, #0D0720 40%, #09090F 100%)',
        }}
        aria-hidden="true"
      />

      {/* Radial glow — centered */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'rgba(124, 58, 237, 0.25)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[200px] rounded-full blur-[60px]"
          style={{ background: 'rgba(167, 139, 250, 0.15)' }}
        />
      </div>

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
        {/* Word-by-word headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-50 leading-tight tracking-tight mb-8"
        >
          {headlineWords.map((word, i) => (
            <motion.span key={i} variants={wordReveal} className="inline-block mr-[0.22em]">
              {word}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-muted mb-10 leading-relaxed"
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
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-4 bg-white hover:bg-neutral-100 text-primary font-semibold rounded-full transition-all duration-150 text-base shadow-xl hover:scale-[1.02]"
          >
            Create your free account
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-white/40 text-neutral-200 font-semibold rounded-lg transition-all duration-150 text-base hover:bg-white/5"
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
          No credit card required · Open source · Runs on your infrastructure if you want it to
        </motion.p>
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
