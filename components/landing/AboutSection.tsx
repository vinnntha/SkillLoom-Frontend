"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Building, ShieldCheck, CheckCircle2 } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="bg-[#F4F6F9] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 rounded-[32px] sm:rounded-[48px] md:rounded-[60px] -mt-6 sm:-mt-10 mb-12 sm:mb-20 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border-2 border-[#0B38E6] text-[#0B38E6] font-bold text-[11px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-6"
          >
            [ TENTANG SKILLLOOM ]
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight font-mono px-2"
          >
            Solusi Win-Win untuk Ekosistem Vokasi & Bisnis Lokal
          </motion.h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card A: Large - Span 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-[#0B38E6]/15 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B38E6]/5 rounded-full blur-3xl -z-10 group-hover:bg-[#0B38E6]/10 transition-colors duration-500" />
            
            <div>
              <h3 className="text-xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Jembatan Pengalaman Nyata</h3>
              <p className="text-slate-600 mb-6 sm:mb-8 max-w-xl text-sm sm:text-lg leading-relaxed font-medium">
                Kami menghubungkan siswa SMK, sekolah, dan UMKM dalam satu platform terintegrasi. Memastikan setiap talenta vokasi mendapatkan pengalaman industri yang relevan sebelum lulus, sekaligus membantu bisnis lokal berkembang dengan dukungan digital.
              </p>
            </div>

            {/* Stats Overlay */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-auto">
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 shadow-md shadow-[#0B38E6]/15 hover:shadow-lg hover:shadow-[#0B38E6]/25 transition-all flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B38E6] flex items-center justify-center text-white shrink-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">500+</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyek Selesai</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 shadow-md shadow-lime-600/20 hover:shadow-lg hover:shadow-lime-600/30 transition-all flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#A1FF00] flex items-center justify-center text-slate-900 shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">98%</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Tingkat Kepuasan</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card B: Span 1 - Neon Accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#A1FF00] text-slate-900 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl shadow-[#A1FF00]/40 hover:shadow-2xl hover:shadow-[#A1FF00]/60 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 min-h-[220px] sm:min-h-[auto] border border-lime-400/40"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
            
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 text-[#A1FF00] rounded-full flex items-center justify-center mb-4 sm:mb-6 shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black leading-tight uppercase tracking-tight">
                100% Portofolio Terverifikasi Industri
              </h3>
            </div>
            
            <div className="mt-6 sm:mt-8 flex justify-end">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 text-[#A1FF00] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card C: 3 Equal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-12">
          {/* Box 1 (Siswa) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-xl shadow-blue-600/12 hover:shadow-2xl hover:shadow-blue-600/25 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-[#0B38E6] flex items-center justify-center group-hover:bg-[#0B38E6] group-hover:text-white transition-colors shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-[#0B38E6] text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk Siswa
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Portofolio & Uang Saku</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Bangun pengalaman nyata sejak sekolah dan dapatkan insentif langsung atas karya digitalmu.</p>
          </motion.div>

          {/* Box 2 (UMKM) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xl shadow-emerald-600/12 hover:shadow-2xl hover:shadow-emerald-600/25 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <Building className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk UMKM
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Solusi Digital Terjangkau</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Dapatkan layanan desain, website, dan aplikasi dengan budget efisien untuk kembangkan bisnismu.</p>
          </motion.div>

          {/* Box 3 (Sekolah/Admin) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xl shadow-purple-600/12 hover:shadow-2xl hover:shadow-purple-600/25 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk Sekolah
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">Pantau PKL & Transparansi</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">Dashboard khusus untuk memantau progres proyek siswa secara real-time dan terukur.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
