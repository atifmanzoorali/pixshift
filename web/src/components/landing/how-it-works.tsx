'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
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
    description:
      "Register with your email. No credit card. No onboarding call. You're in.",
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
      'Send a POST request to /api/v1/convert with your file and target format in the X-API-Key header. Get the converted image binary back in the response.',
  },
  {
    number: '04',
    label: 'Ship it',
    description:
      "That's your integration. One endpoint, one header, one response. Add compress or resize as needed. The OpenAPI docs at /docs cover everything.",
  },
];

export function HowItWorks(): JSX.Element {
  return (
    <section
      id="how-it-works"
      className="w-full px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24 bg-surface"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mb-4 tracking-tight"
          >
            Up and running in under 60 seconds.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted">
            Create an account, get your API key, make your first call. No SDK required — it&apos;s
            just HTTP.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="flex flex-col">
              <span className="text-6xl font-display font-bold text-primary/15 leading-none mb-4 select-none">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-neutral-50 mb-3">{step.label}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="mt-16 text-center text-base text-neutral-300 font-medium"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          Your image pipeline is now three lines of curl. The rest is just building your product.
        </motion.p>
      </div>
    </section>
  );
}
