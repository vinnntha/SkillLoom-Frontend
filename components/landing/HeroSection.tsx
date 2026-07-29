"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Users, Briefcase } from "lucide-react";
import { CircularBadge } from "./CircularBadge";
import { NeonDoodleArrow1, NeonDoodleArrow2, NeonHighlightTag } from "./DoodleAccents";
import { FloatingCards } from "./FloatingCards";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-[#0B38E6] text-white pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-12 flex flex-col justify-between overflow-hidden bg-grid-pattern">
      {/* Decorative Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#A1FF00]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Top Highlight Tag / Pill */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-slate-950/70 border border-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-xl"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#A1FF00] animate-ping" />
            <span className="text-xs sm:text-sm font-bold text-white font-mono tracking-tight">
            PLATFORM KOLABORASI VOKASI x UMKM
            </span>
          </motion.div>
        </div>

        {/* Main Display Headline & Circular Badge Grid */}
        <div className="relative text-center max-w-5xl mx-auto mb-8 sm:mb-12">
          {/* Neon Doodle Arrow 1 - Top Right Accent */}
          <div className="hidden lg:block absolute -top-4 right-12 z-20 pointer-events-none">
            <NeonDoodleArrow1 />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] uppercase font-mono text-white text-balance drop-shadow-lg"
          >
            #KARYA NYATA <br />
            <span className="relative inline-block text-[#A1FF00] underline decoration-[#A1FF00]/40 decoration-4">
              SISWA VOKASI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Hubungkan talenta terbaik <span className="font-bold text-[#A1FF00]">SMK Indonesia</span> dengan proyek nyata <span className="font-bold text-[#A1FF00]">UMKM</span>. Membangun portofolio riil & insentif karya langsung dari bangku sekolah.
          </motion.p>

          {/* Action Buttons & Circular Badge Positioning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative"
          >
            {/* Primary Action Button */}
            <a
              href="#umkm"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#A1FF00] hover:bg-[#8ee600] text-slate-950 font-black text-base sm:text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(161,255,0,0.4)] hover:shadow-[0_15px_40px_rgba(161,255,0,0.6)] hover:scale-105 active:scale-95 group border-2 border-slate-950"
            >
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
              <span>POSTING PROYEK UMKM</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </a>

            {/* Secondary Action Button */}
            <a
              href="#portofolio"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950/60 hover:bg-slate-950 border-2 border-white/30 hover:border-white text-white font-bold text-base px-7 py-4 rounded-full transition-all duration-300 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95"
            >
              <Users className="w-5 h-5 text-[#A1FF00]" />
              <span>Jelajahi Portofolio Siswa</span>
            </a>

            {/* Circular CTA Sticker - Placed next to CTA buttons on Desktop / Centered on Mobile */}
            <div className="sm:absolute sm:-right-8 sm:-bottom-10 lg:right-0 lg:-bottom-12 mt-6 sm:mt-0 z-30">
              <CircularBadge />
            </div>
          </motion.div>
        </div>

        {/* Neon Doodle Arrow 2 - Left Accent */}
        <div className="hidden lg:block absolute left-4 bottom-48 z-20 pointer-events-none">
          <NeonDoodleArrow2 />
        </div>

        {/* Floating Profile & Stipend Cards Section */}
        <div className="mt-4 sm:mt-8">
          <FloatingCards />
        </div>
      </div>
    </section>
  );
};
