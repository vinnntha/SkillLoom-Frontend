"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, GraduationCap, Building, ShieldCheck, CheckCircle2 } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="bg-[#F4F6F9] py-20 px-6 sm:px-8 lg:px-12 rounded-[40px] sm:rounded-[48px] md:rounded-[60px] -mt-10 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-[#0B38E6] text-[#0B38E6] font-bold text-xs tracking-widest uppercase mb-6"
          >
            [ TENTANG SKILLLOOM ]
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight font-mono"
          >
            Solusi Win-Win untuk Ekosistem Vokasi & Bisnis Lokal
          </motion.h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: Large - Span 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B38E6]/5 rounded-full blur-3xl -z-10 group-hover:bg-[#0B38E6]/10 transition-colors duration-500" />
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Jembatan Pengalaman Nyata</h3>
            <p className="text-slate-600 mb-8 max-w-xl text-base sm:text-lg leading-relaxed">
              Kami menghubungkan siswa SMK, sekolah, dan UMKM dalam satu platform terintegrasi. Memastikan setiap talenta vokasi mendapatkan pengalaman industri yang relevan sebelum lulus, sekaligus membantu bisnis lokal berkembang dengan dukungan digital.
            </p>

            {/* Stats Overlay */}
            <div className="flex flex-wrap gap-4 mt-auto">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#0B38E6] flex items-center justify-center text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">500+</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proyek Selesai</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-[#A1FF00] flex items-center justify-center text-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">98%</p>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tingkat Kepuasan</p>
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
            className="bg-[#A1FF00] text-slate-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
            
            <div>
              <div className="w-14 h-14 bg-slate-900 text-[#A1FF00] rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black leading-tight uppercase tracking-tight">
                100% Portofolio Terverifikasi Industri
              </h3>
            </div>
            
            <div className="mt-8 flex justify-end">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-[#A1FF00] flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card C: 3 Equal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Box 1 (Siswa) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B38E6] flex items-center justify-center group-hover:bg-[#0B38E6] group-hover:text-white transition-colors">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-[#0B38E6] text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk Siswa
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Portofolio & Uang Saku</h4>
            <p className="text-sm text-slate-600">Bangun pengalaman nyata sejak sekolah dan dapatkan insentif langsung atas karya digitalmu.</p>
          </motion.div>

          {/* Box 2 (UMKM) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk UMKM
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Solusi Digital Terjangkau</h4>
            <p className="text-sm text-slate-600">Dapatkan layanan desain, website, dan aplikasi dengan budget efisien untuk kembangkan bisnismu.</p>
          </motion.div>

          {/* Box 3 (Sekolah/Admin) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Untuk Sekolah
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Pantau PKL & Transparansi</h4>
            <p className="text-sm text-slate-600">Dashboard khusus untuk memantau progres proyek siswa secara real-time dan terukur.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
