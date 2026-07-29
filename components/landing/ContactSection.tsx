"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="bg-white py-12 px-6 sm:px-8 lg:px-12 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0B38E6]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#A1FF00]/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            {/* Left Column: CTA Text & Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex px-4 py-1.5 rounded-full bg-[#A1FF00]/10 text-[#A1FF00] font-bold text-xs tracking-widest uppercase mb-6 border border-[#A1FF00]/20">
                SIAP MEMULAI?
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] mb-6 font-mono tracking-tight">
                Punya Proyek UMKM atau Ingin Daftarkan Sekolahmu?
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-md leading-relaxed">
                Bergabunglah dengan ekosistem SkillLoom hari ini. Proses pendaftaran mudah, cepat, dan transparan untuk UMKM, Siswa, maupun Sekolah.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A1FF00]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email Kami</p>
                    <p className="font-bold text-white text-lg">halo@skillloom.id</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A1FF00]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">WhatsApp Business</p>
                    <p className="font-bold text-white text-lg">+62 811 2233 4455</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#A1FF00]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Kantor Pusat</p>
                    <p className="font-bold text-white text-base max-w-[250px]">Gedung Inovasi Vokasi, Jl. Merdeka No. 45, Jakarta Selatan</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Form Container */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-8">Kirim Pesan</h3>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#A1FF00] focus:ring-1 focus:ring-[#A1FF00] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email atau WhatsApp</label>
                    <input
                      type="text"
                      id="email"
                      placeholder="email@contoh.com / 0812..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#A1FF00] focus:ring-1 focus:ring-[#A1FF00] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">Saya Adalah...</label>
                    <div className="relative">
                      <select
                        id="role"
                        className="w-full appearance-none bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#A1FF00] focus:ring-1 focus:ring-[#A1FF00] transition-colors"
                      >
                        <option value="umkm">UMKM / Pemilik Bisnis</option>
                        <option value="sekolah">Sekolah / Guru</option>
                        <option value="siswa">Siswa SMK</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">Pesan / Kebutuhan</label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Ceritakan singkat tentang proyek atau sekolah Anda..."
                      className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#A1FF00] focus:ring-1 focus:ring-[#A1FF00] transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#A1FF00] text-slate-900 font-black py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(161,255,0,0.4)] transition-all duration-300 mt-4 group"
                  >
                    <span>Kirim Sekarang</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
