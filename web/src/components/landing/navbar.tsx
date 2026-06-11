'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
  { href: '/docs', label: 'Docs' },
];

export function Navbar(): JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect((): (() => void) => {
    const handleScroll = (): void => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-neutral-900/95 backdrop-blur-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-neutral-50">
          Pix<span className="text-accent">Shift</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-neutral-50 transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted hover:text-neutral-50 transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-full transition-colors duration-150"
          >
            Create account
          </Link>
        </div>

        <button
          className="md:hidden text-neutral-400 hover:text-neutral-50 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-surface border-b border-border px-6 py-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base text-muted hover:text-neutral-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Link
              href="/login"
              className="text-center py-2 text-muted hover:text-neutral-50 transition-colors text-sm"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-center text-sm font-semibold bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-full transition-colors"
            >
              Create account
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
