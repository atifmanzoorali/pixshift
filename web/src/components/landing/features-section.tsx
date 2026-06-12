'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight, Minimize2, Crop, KeyRound, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const slideRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface Feature {
  icon: LucideIcon;
  name: string;
  benefitHeadline: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ArrowLeftRight,
    name: 'Format Conversion',
    benefitHeadline: 'Convert any image format with a single POST request',
    description:
      'JPEG, PNG, WebP, AVIF, and GIF as input. JPEG, PNG, WebP, or AVIF as output. Send the file, specify the target format, get the converted binary back. No storage, no CDN, no middleman.',
  },
  {
    icon: Minimize2,
    name: 'Compression',
    benefitHeadline: 'Control output file size without writing a line of Pillow code',
    description:
      'Pass a quality value from 1 to 100. The API compresses the image using Sharp and returns it with the correct Content-Type header. The output stays in the same format as the input — only file size changes.',
  },
  {
    icon: Crop,
    name: 'Resize',
    benefitHeadline: 'Resize images with or without aspect ratio lock — your choice',
    description:
      'Set width, height, and whether to lock the aspect ratio. Dimensions cap at 5000px to prevent memory exhaustion. Pass keep_aspect_ratio=true and the API handles the math.',
  },
  {
    icon: KeyRound,
    name: 'API Key Management',
    benefitHeadline: 'Create multiple keys, name them, revoke them instantly',
    description:
      'Production key, staging key, a key for that side project — create as many as you need. Each key tracks its own usage. Revoke any of them with one click. Keys are hashed with SHA-256 — this is how Stripe does it.',
  },
  {
    icon: BarChart3,
    name: 'Usage Tracking',
    benefitHeadline: "See exactly how many calls you've made — per key, per hour, per month",
    description:
      'The dashboard shows total calls, successful calls, failed calls, and a breakdown by operation. Every call is logged with its format, file size, and duration. See exactly what your API key is doing.',
  },
];

export function FeaturesSection(): JSX.Element {
  return (
    <section
      id="features"
      className="w-full bg-elevated px-6 py-20 md:px-8 md:py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          {/* LEFT — sticky panel */}
          <div className="lg:sticky lg:top-[20vh]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-primary">
                Features
              </span>
              <h2 className="mb-5 font-display text-4xl font-bold leading-tight tracking-tight text-neutral-50 md:text-5xl">
                Everything you need. <span className="text-accent">Nothing you don&apos;t.</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted">
                Five endpoints. Full format support. API keys you control from a dashboard that
                doesn&apos;t require a tutorial.
              </p>
            </motion.div>
          </div>

          {/* RIGHT — stacking cards */}
          <div className="space-y-4">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={slideRight}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md md:p-8"
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/20">
                      <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        {feature.name}
                      </p>
                      <h3 className="mb-2 text-lg font-semibold leading-snug text-neutral-50">
                        {feature.benefitHeadline}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
