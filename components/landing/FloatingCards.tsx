"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Award, Code2, Sparkles, TrendingUp } from "lucide-react";

export const FloatingCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto h-[380px] sm:h-[420px] md:h-[460px] flex items-center justify-center">
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-[#A1FF00]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Card 1: Top-Left Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="absolute top-2 sm:top-6 left-2 sm:left-6 md:left-8 z-20 w-[290px] sm:w-[340px] md:w-[380px] bg-white/20 backdrop-blur-md border border-white/30 p-4 sm:p-5 rounded-2xl shadow-2xl text-white"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Student Avatar */}
            <div className="relative w-12 h-11 rounded-full overflow-hidden border-2 border-[#A1FF00] bg-slate-900 flex items-center justify-center text-lg font-bold shadow-md">
              <span className="text-[#A1FF00]">AR</span>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">Averill Kevinatha</h4>
                <CheckCircle className="w-4 h-4 text-[#A1FF00] fill-slate-950" />
              </div>
              <p className="text-xs text-white/80 font-mono">NISN: 006849201 • SMKN Telkom Malang</p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1 bg-slate-950/60 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full text-xs font-bold text-[#A1FF00]">
            <Star className="w-3.5 h-3.5 fill-[#A1FF00] text-[#A1FF00]" />
            <span>4.9</span>
          </div>
        </div>

        {/* Role & Tags */}
        <div className="mt-3">
          <p className="text-xs font-medium text-white/90 flex items-center gap-1.5 mb-2">
            <Code2 className="w-3.5 h-3.5 text-[#A1FF00]" />
            <span>Frontend & Motion Developer</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 border border-white/20 text-white">
              Next.js
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 border border-white/20 text-white">
              Tailwind
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#A1FF00]/20 border border-[#A1FF00]/40 text-[#A1FF00]">
              14 Proyek Selesai
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 2: Bottom-Right Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 40, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="absolute bottom-4 sm:bottom-8 right-2 sm:right-6 md:right-8 z-30 w-[290px] sm:w-[350px] md:w-[390px] bg-slate-950/75 backdrop-blur-xl border border-white/25 p-4 sm:p-5 rounded-2xl shadow-2xl text-white"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Student Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-lg font-bold shadow-md">
              <span className="text-white">SR</span>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#A1FF00] border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-white tracking-tight">Syafi Aqil</h4>
              <p className="text-xs text-white/70">SMK Telkom Malang • UI/UX Lead</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] font-mono text-white/80 border border-white/10">
            VERIFIED
          </span>
        </div>

        {/* Earned Stipend Highlight Pill */}
        <div className="bg-[#A1FF00] text-slate-950 p-3 rounded-xl flex items-center justify-between border border-slate-900 shadow-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">Total Stipend Cair</p>
              <p className="font-black text-sm sm:text-base leading-tight">Rp 4.500.000</p>
            </div>
          </div>
          <div className="bg-slate-950 text-[#A1FF00] px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Industrial Ready</span>
          </div>
        </div>
      </motion.div>

      {/* Center Decorative Bridge Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="hidden sm:flex z-10 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-xs font-semibold text-white/90 items-center gap-2 shadow-lg"
      >
        <Sparkles className="w-4 h-4 text-[#A1FF00]" />
        <span>Portofolio Siswa Real-Time & Terverifikasi</span>
      </motion.div>
    </div>
  );
};
