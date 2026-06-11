'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const codeSnippet = `curl -X POST https://api.pixshift.io/v1/convert \\
  -H "X-API-Key: pxs_live_xxxxxxxxxxxx" \\
  -F "file=@photo.png" \\
  -F "target_format=webp" \\
  --output result.webp`;

export function HeroSection(): JSX.Element {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center pt-16"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Eyebrow */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-accent text-sm font-medium">
            ✦&nbsp; Open source image conversion API
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight text-neutral-50 mb-6"
        >
          Image conversion API.{' '}
          <span className="text-accent">Open source.</span>
          <br className="hidden sm:block" />
          No $150/month invoice.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          PNG, JPG, WebP, AVIF, GIF — convert, compress, and resize via a clean REST API.
          Authenticate once with an API key. Call the endpoint. Get your image back. That&apos;s it.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-5"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full transition-colors duration-150 text-base"
          >
            Create your free account
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-3 border border-border hover:border-border-strong text-neutral-200 font-semibold rounded-lg transition-colors duration-150 text-base"
          >
            Read the docs
          </Link>
        </motion.div>

        {/* Supporting line */}
        <motion.p variants={fadeUp} className="text-sm text-neutral-500 mb-14">
          No credit card required · Open source · API key in 60 seconds
        </motion.p>

        {/* Code block */}
        <motion.div variants={fadeUp} className="max-w-xl mx-auto text-left">
          <div className="bg-neutral-900 border border-border rounded-lg overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <div className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="ml-2 text-xs text-neutral-500 font-mono">terminal</span>
            </div>
            <pre className="p-5 text-sm font-mono text-accent leading-7 overflow-x-auto whitespace-pre">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
