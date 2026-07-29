"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Star, Sparkles, ShieldCheck } from "lucide-react";

export const AuthBrandShowcase: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-screen bg-[#0B38E6] text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden bg-grid-pattern">
      {/* Decorative Radial Background Lighting */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[350px] h-[350px] bg-[#A1FF00]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header: Logo + Back Button */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* SkillLoom Branded Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative h-10 w-auto flex items-center">
            <img
              src="/logo.png"
              alt="SkillLoom Logo"
              className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                // Fallback text if logo image is missing
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </Link>

        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-[#A1FF00]" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Center Hero Section */}
      <div className="relative z-10 my-8 lg:my-auto max-w-xl">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-slate-950/60 border border-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-lg mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A1FF00]" />
          <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            [ SKILLLOOM AUTHENTICATION ]
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase font-mono leading-[1.08] text-white text-balance drop-shadow-md"
        >
          <span className="text-[#A1FF00]">#SATU AKUN,</span> <br />
          REVOLUSI VOKASI & UMKM
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-sm sm:text-base text-white/90 font-medium leading-relaxed max-w-lg"
        >
          Hubungkan potensi siswa SMK dengan proyek nyata bisnis lokal secara profesional dan transparan.
        </motion.p>

        {/* Floating Glassmorphic Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 text-white shadow-2xl"
        >
          {/* Card Content Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#A1FF00] to-emerald-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
                SL
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">Talenta Vokasi & UMKM</h4>
                  <CheckCircle2 className="w-4 h-4 text-[#A1FF00] fill-[#A1FF00]/20" />
                </div>
                <p className="text-xs text-white/75 font-mono">Portofolio Terverifikasi</p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 bg-slate-950/40 px-2.5 py-1 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 fill-[#A1FF00] text-[#A1FF00]" />
              <span className="text-xs font-bold font-mono text-white">5.0</span>
            </div>
          </div>

          {/* Quote inside card */}
          <p className="text-xs sm:text-sm text-white/90 italic font-medium leading-normal border-l-2 border-[#A1FF00] pl-3 py-1 my-2">
            &quot;Mulai dapat portofolio terverifikasi dan insentif nyata langsung dari proyek industri!&quot;
          </p>

          {/* Mini Stat Pills */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3 text-[11px] font-semibold text-white/80">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A1FF00]" /> 100% Proyek Asli
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg text-[#A1FF00] font-mono">
              +500 SMK & UMKM
            </span>
          </div>

          {/* Decorative Neon Lime Arrow Doodle pointing right toward form */}
          <div className="hidden lg:block absolute -right-14 -bottom-8 pointer-events-none z-20">
            <svg
              viewBox="0 0 120 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 text-[#A1FF00] filter drop-shadow-[0_0_8px_rgba(161,255,0,0.7)]"
            >
              <path
                d="M10 20 C 40 5, 80 15, 100 45"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <path
                d="M88 43 L 102 48 L 98 32"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding Note */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 text-xs text-white/60 flex items-center justify-between font-mono">
        <span>© {new Date().getFullYear()} SkillLoom Indonesia</span>
        <span className="text-[#A1FF00]">Vokasi Empowered</span>
      </div>
    </div>
  );
};
