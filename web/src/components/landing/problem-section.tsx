'use client';

import { motion } from 'framer-motion';

const slideLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface PainPoint {
  number: string;
  heading: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    number: '01',
    heading: "Manual converters that don't scale",
    description:
      "You paste an image into a browser tab, download the result, and repeat. It works for one image. It breaks the moment your app needs to do it programmatically, in bulk, or on a schedule.",
  },
  {
    number: '02',
    heading: 'Enterprise platforms priced for enterprises',
    description:
      "Cloudinary starts at $89/month. Imgix starts at $100/month. They bundle CDN delivery, video transcoding, and AI tagging — none of which you asked for. You're paying for a platform you're using at 5% capacity.",
  },
  {
    number: '03',
    heading: 'Rolling your own Pillow scripts',
    description:
      "You can write a Python script around Pillow. Then you need auth, rate limiting, error handling, logging, and deployment. What started as a one-hour task is now a service you maintain forever.",
  },
];

export function ProblemSection(): JSX.Element {
  return (
    <section id="problem" className="w-full bg-neutral-900 px-6 md:px-8 lg:px-12 py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="max-w-2xl mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
          >
            The problem
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-display font-bold text-neutral-50 leading-tight tracking-tight"
          >
            Your image pipeline
            <br />
            <span className="text-neutral-400">shouldn&apos;t look like this.</span>
          </motion.h2>
        </motion.div>

        {/* Pain points — editorial numbered layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-px bg-transparent md:bg-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.number}
              variants={slideLeft}
              className="bg-neutral-900 md:pr-10 pb-12 md:pb-0 pt-0"
            >
              {/* Decorative number */}
              <span className="block font-display font-bold text-[6rem] md:text-[7rem] leading-none text-primary/12 select-none mb-2 -ml-2">
                {point.number}
              </span>

              {/* Content with left border accent */}
              <div className="border-l-2 border-primary/40 pl-6">
                <h3 className="text-xl font-display font-semibold text-neutral-50 mb-3 leading-snug">
                  {point.heading}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Transition line */}
        <motion.div
          className="mt-16 md:mt-20 pt-12 border-t border-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-lg md:text-xl font-display font-semibold text-neutral-200 max-w-xl">
            PixShift is the middle path.{' '}
            <span className="text-accent">
              A clean, documented, open-source API that does exactly what you need.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
