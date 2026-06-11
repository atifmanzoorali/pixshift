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
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
