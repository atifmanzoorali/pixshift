'use client';

import { motion } from 'framer-motion';
import { MousePointerClick, DollarSign, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface PainPoint {
  icon: LucideIcon;
  heading: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    icon: MousePointerClick,
    heading: "Manual converters that don't scale",
    description:
      "You paste an image into a browser tab, download the result, and repeat. It works for one image. It breaks the moment your app needs to do it programmatically, in bulk, or on a schedule.",
  },
  {
    icon: DollarSign,
    heading: 'Enterprise platforms priced for enterprises',
    description:
      "Cloudinary starts at $89/month. Imgix starts at $100/month. They include CDN delivery, video transcoding, and AI tagging — none of which you asked for. You're paying for a platform you're using at 5% capacity.",
  },
  {
    icon: Wrench,
    heading: 'Rolling your own Pillow scripts',
    description:
      "You can write a Python script around Pillow. Then you need to add auth, rate limiting, error handling, logging, and deployment. What started as a one-hour task is now a service you're responsible for maintaining forever.",
  },
];

export function ProblemSection(): JSX.Element {
  return (
    <section id="problem" className="w-full px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-4 tracking-tight"
          >
            Your image pipeline shouldn&apos;t look like this.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted">
            Most developers are doing one of two things. Neither of them is the right answer.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-surface border border-border rounded-lg p-6 hover:border-border-strong transition-all duration-150 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-50 mb-3">{point.heading}</h3>
                <p className="text-sm text-muted leading-relaxed">{point.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-10 text-center text-base text-neutral-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          PixShift is the middle path. A clean, documented, open-source API that does exactly what
          you need — and nothing you don&apos;t.
        </motion.p>
      </div>
    </section>
  );
}
