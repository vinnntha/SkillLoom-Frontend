"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import LogoLoop from "@/components/ui/LogoLoop";

const testimonials = [
  {
    name: "Rizky Ramadhan",
    role: "Siswa RPL SMK Telkom Malang",
    quote: "Dapet proyek buat landing page UMKM kopi. Selain dapet uang saku, portofolio ini langsung dipake buat ngelamar kerja!",
    avatar: "RR",
    avatarBg: "bg-blue-500",
  },
  {
    name: "Ibu Hani",
    role: "Owner Dapur Mamah",
    quote: "Sangat terbantu! Desain kemasan dan feeds Instagram usaha saya jadi jauh lebih profesional dengan budget terjangkau.",
    avatar: "IH",
    avatarBg: "bg-emerald-500",
  },
  {
    name: "Pak Budi, S.Kom",
    role: "Guru Pembimbing SMK 2",
    quote: "Memudahkan sekolah memantau progress PKL siswa secara nyata. Proyeknya transparan dan terarah.",
    avatar: "PB",
    avatarBg: "bg-purple-500",
  },
];

export const TestimonialSection: React.FC = () => {
  const logoItems = testimonials.map((testimonial, index) => ({
    node: (
      <div
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-8 text-white hover:border-[#A1FF00] transition-all duration-300 relative group w-[280px] xs:w-[320px] sm:w-[380px] md:w-[420px] whitespace-normal text-left"
      >
        <Quote className="absolute top-4 sm:top-6 right-5 sm:right-8 w-8 h-8 sm:w-12 sm:h-12 text-white/5 group-hover:text-[#A1FF00]/10 transition-colors" />
        
        {/* Rating */}
        <div className="flex gap-1 mb-4 sm:mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#A1FF00] text-[#A1FF00]" />
          ))}
        </div>

        {/* Quote */}
        <p className="text-white/90 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 relative z-10 font-medium">
          "{testimonial.quote}"
        </p>

        {/* Profile */}
        <div className="flex flex-col items-start gap-2.5 sm:gap-3 mt-auto pt-3 sm:pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-white border-2 border-white/20 shrink-0 ${testimonial.avatarBg}`}>
              {testimonial.avatar}
            </div>
            <h4 className="font-bold text-white text-sm sm:text-base">{testimonial.name}</h4>
          </div>
          <span className="inline-block px-2.5 py-0.5 sm:py-1 bg-white/10 rounded-full text-[10px] font-mono border border-white/10">
            {testimonial.role}
          </span>
        </div>
      </div>
    )
  }));

  return (
    <section id="testimoni" className="bg-[#0B38E6] bg-grid-pattern relative py-14 sm:py-24 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-1 sm:mb-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#A1FF00] font-bold tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4"
          >
            APA KATA MEREKA?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-mono px-4"
          >
            Dampaknya Nyata untuk Siswa & UMKM
          </motion.h2>
        </div>
      </div>

      {/* Testimonial LogoLoop Cards */}
      <div className="w-full relative py-2 sm:py-4">
        <LogoLoop
          logos={logoItems}
          speed={60}
          direction="left"
          logoHeight={320}
          gap={20}
          hoverSpeed={0}
          fadeOut={true}
          fadeOutColor="#0B38E6"
        />
      </div>
    </section>
  );
};
