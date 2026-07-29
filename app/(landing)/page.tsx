import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B38E6] text-slate-900 selection:bg-[#A1FF00] selection:text-slate-950">
      {/* Top Glassmorphism Navigation Bar */}
      <Navbar />

      {/* Hero Section with Floating Profile Cards & Circular Sticker */}
      <HeroSection />

      {/* About Section / Value Proposition (Bento Grid Style) */}
      <AboutSection />

      {/* Lower Feature Section Overlay (3-Column Grid) */}
      <FeatureSection />

      {/* Testimonials (Glassmorphism Cards) */}
      <TestimonialSection />

      {/* Contact & CTA Section (Interactive Action Section) */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
