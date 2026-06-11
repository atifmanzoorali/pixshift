'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
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
    <section className="w-full px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-xl overflow-hidden bg-secondary border border-primary/30 px-8 md:px-16 py-16 md:py-20 text-center">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-primary/15 rounded-full blur-[80px]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-3xl md:text-5xl font-display font-bold text-neutral-50 leading-tight mb-6 tracking-tight"
            >
              {headlineWords.map((word, i) => (
                <motion.span key={i} variants={fadeUp} className="inline-block mr-[0.25em]">
                  {word}
                </motion.span>
              ))}
            </motion.h2>

            <motion.p
              className="text-lg text-muted mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              Create an account, get your key, and make your first conversion in the next five
              minutes.
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-neutral-100 text-primary font-semibold rounded-full transition-colors duration-150 text-base"
              >
                Create your free account
              </Link>
            </motion.div>

            <motion.p
              className="mt-4 text-sm text-neutral-500"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              No credit card required · Open source · Runs on your infrastructure if you want it to
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
