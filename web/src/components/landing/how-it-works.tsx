'use client';

import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const numberReveal = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const contentSlide = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface Step {
  number: string;
  label: string;
  description: string;
}

const steps: Step[] = [
  {
    number: '01',
    label: 'Create your account',
    description: "Register with your email. No credit card. No onboarding call. You're in.",
  },
  {
    number: '02',
    label: 'Generate an API key',
    description:
      "From your dashboard, create a named key. Copy it — it's shown once, then hashed. Store it in your environment variables.",
  },
  {
    number: '03',
    label: 'Make your first call',
    description:
      'POST to /api/v1/convert with your file and target format, and your key in the X-API-Key header. Get the converted binary back in the response.',
  },
  {
    number: '04',
    label: 'Ship it',
    description:
      "That's your integration. One endpoint, one header, one response. Add /compress or /resize as needed. The OpenAPI docs at /docs cover everything.",
  },
];

export function HowItWorks(): JSX.Element {
  return (
    <section
      id="how-it-works"
      className="w-full bg-neutral-900 px-6 md:px-8 lg:px-12 py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="max-w-2xl mx-auto text-center mb-20 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-primary text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Get started
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-display font-bold text-neutral-50 leading-tight tracking-tight mb-4"
          >
            Up and running in under 60 seconds.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted">
            No SDK required. It&apos;s just HTTP with a header.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          {steps.map((step) => (
            <motion.div key={step.number} className="flex flex-col">
              {/* Dramatic step number — the typographic moment */}
              <motion.span
                variants={numberReveal}
                className="font-display font-bold leading-none select-none mb-5 block"
                style={{
                  fontSize: 'clamp(5rem, 8vw, 7rem)',
                  color: 'rgba(124, 58, 237, 0.18)',
                  letterSpacing: '-0.04em',
                }}
              >
                {step.number}
              </motion.span>

              <motion.div variants={contentSlide} className="border-l-2 border-border pl-5">
                <h3 className="text-lg font-semibold text-neutral-50 mb-2 leading-snug">
                  {step.label}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Closing line */}
        <motion.div
          className="mt-20 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-lg md:text-xl font-display font-semibold text-neutral-300">
            Your image pipeline is now three lines of curl.{' '}
            <span className="text-accent">The rest is just building your product.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
