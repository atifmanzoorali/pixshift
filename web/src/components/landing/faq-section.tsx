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
      'The codebase has a full test suite, Alembic database migrations, structured JSON logging, per-key rate limiting, and a custom exception hierarchy with proper HTTP status codes. It is open source — you can read every line and make that judgment yourself.',
  },
  {
    question: 'How are API keys stored? Is my key safe?',
    answer:
      'Your raw API key is shown once at creation and never stored. Only the SHA-256 hash goes into the database. This is the same approach used by Stripe and GitHub. If the database were compromised, an attacker would get hashes — not usable keys.',
  },
  {
    question: 'How is this different from just writing my own Pillow script?',
    answer:
      "You could. The difference is what comes with the API: authentication, rate limiting, usage tracking, error handling, structured logging, database migrations, and a test suite — all already built, already tested, already running. Your Pillow script is a script. PixShift is a service.",
  },
];

function FAQItem({ question, answer }: FAQ): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left gap-4 py-6 group"
        aria-expanded={open}
      >
        <span className="text-base md:text-lg font-semibold text-neutral-50 group-hover:text-neutral-200 transition-colors duration-150">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted" />
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
            <p className="pb-6 text-sm md:text-base text-muted leading-relaxed">{answer}</p>
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
      className="w-full bg-neutral-900 px-6 md:px-8 lg:px-12 py-20 md:py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-50 tracking-tight">
            Questions we actually get.
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto border-t border-border">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
