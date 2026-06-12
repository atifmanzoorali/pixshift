'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How long does setup take?',
    answer:
      "About 60 seconds to create an account and get an API key. Your first successful API call will take another 2 minutes if you've used curl before, or 5–10 minutes if you're working from the docs. There's no SDK to install — it's standard HTTP with a header.",
  },
  {
    question: "Is this right for me if I'm not building an image-heavy product?",
    answer:
      'If you need to convert, compress, or resize images in code — even occasionally — PixShift makes sense. The free tier is designed for exactly this: real usage without a subscription forcing you to hit a minimum.',
  },
  {
    question: "I'm currently using Cloudinary. How hard is the migration?",
    answer:
      "The endpoints are different, but the concept is identical: send a file, get a file back. There's no proprietary SDK to rip out. If you're using Cloudinary purely for format conversion and not for CDN delivery or storage, the migration is a one-afternoon job.",
  },
  {
    question: 'Is this production-ready or a side project?',
    answer:
      'The codebase uses TypeScript throughout with strict mode enabled, Supabase for auth and database with Row Level Security on every table, and Zod validation on every request before it reaches the processing layer. SHA-256 key hashing means a compromised database exposes no usable keys. Every API call is logged with its operation, format, file size, and duration — visible in your dashboard.',
  },
  {
    question: 'How are API keys stored? Is my key safe?',
    answer:
      'Your raw API key is shown once at creation and never stored. Only the SHA-256 hash goes into the database. This is the same approach used by Stripe and GitHub. If the database were compromised, an attacker would get hashes — not usable keys.',
  },
  {
    question: 'How is this different from just writing my own Pillow script?',
    answer:
      'You could write your own Sharp script. The difference is what comes with the API: authentication, API key management, usage tracking, input validation, error handling, and a dashboard — all already built and running. Your script is a script. PixShift is a service with an API contract you can depend on.',
  },
];

function FAQItem({ question, answer }: FAQ): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between gap-4 py-6 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-neutral-50 transition-colors duration-150 group-hover:text-neutral-200 md:text-lg">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-5 w-5 text-muted" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm leading-relaxed text-muted md:text-base">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection(): JSX.Element {
  return (
    <section
      id="faq"
      className="w-full bg-neutral-900 px-6 py-20 md:px-8 md:py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-neutral-50 md:text-5xl">
            Questions we actually get.
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl border-t border-border">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
