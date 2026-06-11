'use client';

import { motion } from 'framer-motion';

const featuredReveal = {
  hidden: { opacity: 0, scale: 0.98, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface Testimonial {
  quote: string;
  name: string;
  company: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I've been using Cloudinary for two years and I'm paying for probably 15 features I've never touched. PixShift does the three things I actually use. I migrated our conversion pipeline in an afternoon and cut the bill by 80%.",
    name: 'Backend Engineer',
    company: 'B2B SaaS',
    initials: 'BE',
  },
  {
    quote:
      "I expected the integration to take a day. It took 20 minutes. The docs actually match the API, which is apparently not guaranteed in this industry.",
    name: 'Indie Developer',
    company: 'Self-employed',
    initials: 'ID',
  },
  {
    quote:
      "The fact that it's open source was the deciding factor. I can read the auth code, see exactly how keys are hashed, and verify there are no surprises.",
    name: 'Tech Lead',
    company: 'Early-Stage Startup',
    initials: 'TL',
  },
];

export function TestimonialsSection(): JSX.Element {
  const [featured, ...rest] = testimonials;

  return (
    <section className="w-full bg-surface px-6 md:px-8 lg:px-12 py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.p
          className="text-primary text-sm font-semibold uppercase tracking-widest text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          What developers say after their first API call
        </motion.p>

        {/* Featured quote — the dramatic typographic moment */}
        <motion.blockquote
          className="max-w-4xl mx-auto text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={featuredReveal}
        >
          {/* Large decorative quote mark */}
          <span
            className="block font-display font-bold text-primary/20 leading-none mb-2 select-none"
            style={{ fontSize: 'clamp(4rem, 8vw, 7rem)' }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-neutral-100 italic leading-snug tracking-tight">
            {featured.quote}
          </p>
          <footer className="mt-8 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
              <span className="text-xs font-semibold text-accent">{featured.initials}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-neutral-50">{featured.name}</p>
              <p className="text-xs text-muted">{featured.company}</p>
            </div>
          </footer>
        </motion.blockquote>

        {/* Divider */}
        <div className="border-t border-border mb-16" />

        {/* Supporting testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {rest.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-elevated border border-border rounded-lg p-6 md:p-8
                         hover:border-border-strong hover:shadow-md
                         transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
            >
              <p className="text-base text-neutral-200 italic leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-accent">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-50">{t.name}</p>
                  <p className="text-xs text-muted">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
