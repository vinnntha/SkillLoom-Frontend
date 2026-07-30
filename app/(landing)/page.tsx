import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";

const AboutSection = dynamic(() => import("@/components/landing/AboutSection").then(m => m.AboutSection), {
  loading: () => <div className="min-h-[400px] bg-[#F4F6F9] animate-pulse rounded-[32px] sm:rounded-[48px]" />
});

const FeatureSection = dynamic(() => import("@/components/landing/FeatureSection").then(m => m.FeatureSection), {
  loading: () => <div className="min-h-[300px] bg-[#0B38E6] animate-pulse" />
});

const TestimonialSection = dynamic(() => import("@/components/landing/TestimonialSection").then(m => m.TestimonialSection), {
  loading: () => <div className="min-h-[300px] bg-[#0B38E6] animate-pulse" />
});

const ContactSection = dynamic(() => import("@/components/landing/ContactSection").then(m => m.ContactSection), {
  loading: () => <div className="min-h-[350px] bg-[#0B38E6] animate-pulse" />
});

const Footer = dynamic(() => import("@/components/landing/Footer").then(m => m.Footer));

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
