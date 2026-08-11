"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Code2, 
  Wallet, 
  ArrowRight, 
  ArrowDown,
  CheckCircle2, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";

export const FeatureSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "1. UMKM POSTING PROYEK",
      subtitle: "UMKM mempublikasikan kebutuhan digital (Website, App UI, Branding) dengan kriteria brief & alokasi insentif transparan.",
      badgeTitle: "Redesign UI Landing Page",
      badgeDetails: "Budget: Rp 1.500.000 • Deadline 14 Hari",
      badgeStatus: "Aktif Diberikan",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Building2,
    },
    {
      step: "02",
      title: "2. SISWA KERJAKAN PORTOFOLIO",
      subtitle: "Siswa SMK pilihan mengeksekusi proyek nyata dengan pendampingan langsung dari guru & mentor profesional industri.",
      badgeTitle: "Status Proyek: In Progress",
      badgeDetails: "Sprint 2 dari 3 Selesai (75%) • Code Review",
      badgeStatus: "Pengerjaan",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Code2,
    },
    {
      step: "03",
      title: "3. HASIL ACC & CAIR",
      subtitle: "Hasil pekerjaan diverifikasi oleh UMKM. Insentif karya ditransfer otomatis & sertifikat kompetensi resmi dirilis.",
      badgeTitle: "Rp 500.000 Stipend Paid",
      badgeDetails: "Transfer Langsung & Sertifikat Industri Rilis",
      badgeStatus: "Selesai & Cair",
      badgeColor: "bg-[#A1FF00]/20 text-slate-950 border-[#A1FF00]",
      icon: Wallet,
    },
  ];

  return (
    <section id="workflow" className="relative w-full bg-white rounded-t-[32px] sm:rounded-t-[48px] md:rounded-t-[60px] pt-10 sm:pt-14 pb-14 sm:pb-20 px-4 sm:px-8 lg:px-16 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] z-20 overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-blue-50/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#A1FF00]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900 text-[#A1FF00] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-[#A1FF00] shrink-0" />
            <span>ALUR KERJA MUDAH & TRANSPARAN</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight uppercase font-mono px-2"
          >
            Bagaimana <span className="text-[#0B38E6] underline decoration-[#A1FF00] decoration-wavy decoration-2">SkillLoom</span> Bekerja?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-slate-600 text-xs sm:text-base font-medium px-2 sm:px-0"
          >
            Ekosistem saling menguntungkan: UMKM mendapatkan solusi digital berkualitas, siswa SMK memperoleh pengalaman portofolio nyata dan insentif karya.
          </motion.p>
        </div>

        {/* 3-Column Grid Cards with connecting arrows */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.step}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -6 }}
                  className="relative bg-[#F4F6F9] hover:bg-slate-900 group rounded-3xl p-5 sm:p-7 border border-slate-200/80 hover:border-slate-800 transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header Row */}
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0B38E6] group-hover:bg-[#A1FF00] flex items-center justify-center text-white group-hover:text-slate-950 transition-colors shadow-md shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-2xl sm:text-3xl font-black font-mono text-slate-300 group-hover:text-white/20 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-white transition-colors mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-300 transition-colors leading-relaxed mb-5 sm:mb-6 font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Mini Preview Badge */}
                  <div className="mt-auto bg-white group-hover:bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 group-hover:border-slate-700 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                        {item.badgeStatus}
                      </span>
                      {index === 2 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 shrink-0" />
                      )}
                      {index === 1 && (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      {index === 0 && (
                        <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-white transition-colors">
                      {item.badgeTitle}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors mt-0.5 font-mono">
                      {item.badgeDetails}
                    </p>

                    {/* Progress Bar for Step 2 */}
                    {index === 1 && (
                      <div className="w-full bg-slate-200 group-hover:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full w-[75%]" />
                      </div>
                    )}
                  </div>

                  {/* Arrow Connector for Desktop between columns */}
                  {index < 2 && (
                    <div className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-[#A1FF00] border-2 border-slate-950 items-center justify-center text-slate-950 shadow-md">
                      <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </motion.div>

                {/* Vertical Connector Arrow for Mobile */}
                {index < 2 && (
                  <div className="md:hidden flex justify-center -my-2.5 z-20">
                    <div className="w-7 h-7 rounded-full bg-[#0B38E6] text-white flex items-center justify-center shadow-sm border border-white">
                      <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500 text-center sm:text-left"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0B38E6] shrink-0" />
            <span>Garansi Pembayaran Transparan & Rekening Bersama</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[11px] sm:text-xs">
            <span>✓ 100+ SMK Terhubung</span>
            <span>✓ 250+ Proyek Terrealisasi</span>
            <span>✓ Rp 120M+ Insentif Tersalurkan</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
