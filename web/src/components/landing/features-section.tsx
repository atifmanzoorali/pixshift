'use client';

import { motion } from 'framer-motion';
import { ArrowLeftRight, Minimize2, Crop, KeyRound, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
      'PNG, JPG, JPEG, WebP, AVIF, GIF, BMP, TIFF as input. PNG, JPG, WebP, or AVIF as output. Send the file, specify the target format, get the converted binary back in the response. No storage, no CDN, no middleman.',
  },
  {
    icon: Minimize2,
    name: 'Compression',
    benefitHeadline: 'Control output file size without writing a line of Pillow code',
    description:
      'Pass a quality value from 1 to 100. The API compresses the image and returns it. Clean HTTP response with the correct Content-Type header. The validation catches bad quality values before Pillow ever sees them.',
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
      "Production key, staging key, a key for that side project — create as many as you need from your dashboard. Each key tracks its own usage. Revoke any of them with one click. Keys are hashed with SHA-256 — this is how Stripe does it.",
  },
  {
    icon: BarChart3,
    name: 'Usage Tracking',
    benefitHeadline: "See exactly how many calls you've made — per key, per hour, per month",
    description:
      "The dashboard shows calls today, this month, and this hour. The /usage endpoint exposes the same data programmatically so you can build your own monitoring. No surprise overage bills. No black box.",
  },
];

export function FeaturesSection(): JSX.Element {
  return (
    <section id="features" className="w-full px-6 md:px-8 lg:px-12 py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* LEFT — sticky panel */}
          <div className="lg:sticky lg:top-[20vh]">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-50 mt-3 mb-4 tracking-tight">
              Everything you need.{' '}
              <span className="text-accent">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              Five endpoints. Full format support. API keys you control from a dashboard that
              doesn&apos;t require a tutorial.
            </p>
          </div>

          {/* RIGHT — stacking cards */}
          <div className="space-y-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface border border-border rounded-lg p-6 md:p-8 hover:border-border-strong transition-all duration-150 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                    {feature.name}
                  </p>
                  <h3 className="text-xl font-semibold text-neutral-50 mb-3 leading-snug">
                    {feature.benefitHeadline}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
