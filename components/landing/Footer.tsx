"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071C70] text-white pt-14 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-12 border-t border-white/10 relative z-30 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-8 pb-10 sm:pb-16 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-baseline">
                SkillLoom
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#A1FF00] ml-1"></div>
              </span>
            </div>
            <p className="text-blue-200/80 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Platform kolaborasi yang menghubungkan talenta siswa SMK dengan proyek nyata UMKM. Membangun portofolio real, mendapatkan uang saku, dan membantu bisnis lokal bertumbuh.
            </p>
          </div>

          {/* Links Column 1: Platform */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono mb-4 sm:mb-6 text-[#A1FF00]">
              Platform
            </h4>
            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-blue-200/80 font-medium">
              <li><a href="#tentang" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Tentang Kami</a></li>
              <li><a href="#workflow" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Cari Proyek</a></li>
              <li><a href="#workflow" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Untuk UMKM</a></li>
              <li><a href="#tentang" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Untuk Sekolah</a></li>
            </ul>
          </div>

          {/* Links Column 2: Jurusan */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono mb-4 sm:mb-6 text-[#A1FF00]">
              Jurusan
            </h4>
            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-blue-200/80 font-medium">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Rekayasa Perangkat Lunak</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Desain Komunikasi Visual</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Pemasaran Digital</a></li>
            </ul>
          </div>

          {/* Links Column 3: Legal & Help */}
          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider font-mono mb-4 sm:mb-6 text-[#A1FF00]">
              Bantuan & Legal
            </h4>
            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-blue-200/80 font-medium">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-transform">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Pusat Bantuan</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-blue-200/60 font-medium">
            © 2026 SkillLoom. All rights reserved. <span className="hidden sm:inline">|</span> Pemberdayaan Vokasi Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
};
