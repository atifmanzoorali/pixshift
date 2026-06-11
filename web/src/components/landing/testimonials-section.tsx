'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
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
      "I expected the integration to take a day. It took 20 minutes. The docs actually match the API, which is apparently not guaranteed in this industry. The /docs endpoint alone is worth it.",
    name: 'Indie Developer',
    company: 'Self-employed',
    initials: 'ID',
  },
  {
    quote:
      "The fact that it's open source was the deciding factor. I can read the auth code, see exactly how keys are hashed, and verify there are no surprises. I forked it, ran it on our own infrastructure, and it worked first try.",
    name: 'Tech Lead',
    company: 'Early-Stage Startup',
    initials: 'TL',
  },
];

export function TestimonialsSection(): JSX.Element {
  return (
    <section className="w-full px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-display font-bold text-neutral-50 text-center mb-12 tracking-tight"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          What developers say after their first API call.
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-surface border border-border rounded-lg p-6 hover:border-border-strong transition-all duration-150 hover:shadow-md flex flex-col"
            >
              <span className="text-4xl font-display font-bold text-primary/30 leading-none mb-4 select-none">
                &ldquo;
              </span>
              <p className="text-base text-neutral-200 italic leading-relaxed flex-1">{t.quote}</p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
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
