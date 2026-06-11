'use client';

import { Navbar } from './navbar';
import { HeroSection } from './hero-section';
import { SocialProofBar } from './social-proof-bar';
import { ProblemSection } from './problem-section';
import { FeaturesSection } from './features-section';
import { HowItWorks } from './how-it-works';
import { TestimonialsSection } from './testimonials-section';
import { FAQSection } from './faq-section';
import { CTASection } from './cta-section';
import { Footer } from './footer';

export function LandingPage(): JSX.Element {
  return (
    <main className="bg-neutral-900 text-neutral-50">
      <Navbar />
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
