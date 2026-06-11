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

const codeSnippet = `curl -X POST https://api.pixshift.io/v1/convert \\
  -H "X-API-Key: pxs_live_xxxxxxxxxxxx" \\
  -F "file=@photo.png" \\
  -F "target_format=webp" \\
  --output result.webp`;

export function HeroSection(): JSX.Element {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 overflow-hidden bg-neutral-900">
      {/* Background — two-layer glow for depth */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-primary/12 blur-[80px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center pt-24 pb-12"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Eyebrow badge */}
        <motion.div variants={slideUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-accent text-sm font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Open source image conversion API
          </span>
        </motion.div>

        {/* Headline — scale + blur reveal */}
        <motion.h1
          variants={heroReveal}
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-[-0.03em] text-neutral-50 mb-6"
        >
          Image conversion API.{' '}
          <span className="text-accent">Open source.</span>
          <br />
          No $150/month invoice.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={slideUp}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          PNG, JPG, WebP, AVIF, GIF — convert, compress, and resize via a clean REST API.
          One header. One endpoint. One response.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={slideUp}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-5"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full transition-all duration-150 text-base shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Create your free account
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-border hover:border-border-strong text-neutral-200 font-semibold rounded-lg transition-all duration-150 text-base hover:bg-elevated"
          >
            Read the docs
          </Link>
        </motion.div>

        {/* Supporting line */}
        <motion.p variants={slideUp} className="text-sm text-neutral-500 mb-16">
          No credit card required · Open source · API key in 60 seconds
        </motion.p>

        {/* Visual centerpiece — terminal code block */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto text-left"
        >
          {/* Outer glow on the code block */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-primary/30 to-transparent" />
            <div className="relative bg-neutral-900 border border-border rounded-xl overflow-hidden shadow-xl">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-elevated">
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <div className="w-3 h-3 rounded-full bg-neutral-700" />
                <span className="ml-3 text-xs text-neutral-500 font-mono">terminal</span>
              </div>
              <pre className="p-6 text-sm font-mono text-accent leading-7 overflow-x-auto whitespace-pre">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
