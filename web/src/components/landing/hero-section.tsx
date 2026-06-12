'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const heroReveal = {
  hidden: { opacity: 0, scale: 1.04, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const codeSnippet = `curl -X POST https://pixshift.com/api/v1/convert \\
  -H "X-API-Key: pxs_live_xxxxxxxxxxxx" \\
  -F "file=@photo.png" \\
  -F "target_format=webp" \\
  --output result.webp`;

export function HeroSection(): JSX.Element {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-900 px-6 md:px-8">
      {/* Background — two-layer glow for depth */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-primary/8 absolute left-1/2 top-[30%] h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" />
        <div className="bg-primary/12 absolute left-1/2 top-[28%] h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl pb-12 pt-24 text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Eyebrow badge */}
        <motion.div variants={slideUp} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium tracking-wide text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Developer-first image API
          </span>
        </motion.div>

        {/* Headline — scale + blur reveal */}
        <motion.h1
          variants={heroReveal}
          className="mb-6 font-display text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-neutral-50 sm:text-6xl lg:text-7xl"
        >
          Image conversion API. <span className="text-accent">Open source.</span>
          <br />
          No $150/month invoice.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={slideUp}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
        >
          PNG, JPG, WebP, AVIF, GIF — convert, compress, and resize via a clean REST API. One
          header. One endpoint. One response.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={slideUp}
          className="mb-5 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-150 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-xl"
          >
            Create your free account
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3.5 text-base font-semibold text-neutral-200 transition-all duration-150 hover:border-border-strong hover:bg-elevated"
          >
            Read the docs
          </Link>
        </motion.div>

        {/* Supporting line */}
        <motion.p variants={slideUp} className="mb-16 text-sm text-neutral-500">
          No credit card required · API key in 60 seconds · No SDK required
        </motion.p>

        {/* Visual centerpiece — terminal code block */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-left"
        >
          {/* Outer glow on the code block */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/30 to-transparent" />
            <div className="relative overflow-hidden rounded-xl border border-border bg-neutral-900 shadow-xl">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 border-b border-border bg-elevated px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-neutral-700" />
                <div className="h-3 w-3 rounded-full bg-neutral-700" />
                <div className="h-3 w-3 rounded-full bg-neutral-700" />
                <span className="ml-3 font-mono text-xs text-neutral-500">terminal</span>
              </div>
              <pre className="overflow-x-auto whitespace-pre p-6 font-mono text-sm leading-7 text-accent">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
