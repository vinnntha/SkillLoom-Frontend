"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  GraduationCap,
  FileText,
  Building,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Edit3,
  Save,
  ShieldCheck,
  Award,
  Wallet,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SiswaProfilePage() {
  const { user, refreshUser } = useAuth();

  // Profile Form State
  const [bio, setBio] = useState("");
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Sync profile fields from Auth Context
  useEffect(() => {
    if (user) {
      setBio(user.siswaProfile?.bio || "");
      setBankName(user.siswaProfile?.bankName || "BCA");
      setAccountNumber(user.siswaProfile?.accountNumber || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // PATCH /users/profile/siswa (Postman endpoint)
      await api.users.updateSiswaProfile({
        bio,
        bankName,
        accountNumber,
      });

      await refreshUser();

      setToastMessage("Profil & data rekening berhasil diperbarui ke backend!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.name || user?.siswaProfile?.fullName || "Siswa SkillLoom";
  const email = user?.email || "siswa@example.com";
  const jurusan = user?.siswaProfile?.jurusan || "Rekayasa Perangkat Lunak (RPL)";
  const nisn = user?.siswaProfile?.nisn || "1234567890";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "SW";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 left-6 md:left-auto md:w-96 bg-slate-900 text-white p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3 border border-slate-800"
          >
            <div className="h-9 w-9 rounded-xl bg-[#A1FF00] text-slate-950 flex items-center justify-center shrink-0">
              <Check className="h-5 w-5 font-bold" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-sm">Profil Diperbarui!</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CANVAS (Grid Background + Cobalt Blue Canvas #0B38E6) */}
      <div className="bg-[#0B38E6] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-[#0B38E6]/25">
        {/* Subtle Grid Line Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#A1FF00]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar / Photo with Glowing Circular Badge */}
          <div className="relative shrink-0">
            <div className="h-28 w-28 md:h-36 md:w-36 rounded-full bg-gradient-to-tr from-white/20 to-white/40 border-4 border-white/30 backdrop-blur-md flex items-center justify-center text-white text-3xl md:text-5xl font-black shadow-xl">
              {initials}
            </div>
            
            {/* Interactive Circular Stiker Badge "VERIFIED" */}
            <div className="absolute -bottom-2 -right-2 bg-[#A1FF00] text-slate-950 px-3 py-1 rounded-full border-2 border-[#0B38E6] flex items-center gap-1.5 font-black text-[10px] tracking-wider uppercase shadow-lg animate-pulse">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>VERIFIED SISWA</span>
            </div>
          </div>

          {/* User Display Info & Display Typography Raksasa */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[#A1FF00] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Profil Talenta Vokasi SMK</span>
            </div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-none">
                {displayName}
              </h1>
              <p className="text-sm md:text-base text-white/80 font-medium mt-2 flex items-center justify-center md:justify-start gap-2">
                <GraduationCap className="h-4 w-4 text-[#A1FF00]" />
                <span>{jurusan}</span>
              </p>
            </div>

            {/* Glassmorphism Floating Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center md:text-left">
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">NISN</span>
                <span className="text-sm font-black text-white">{nisn}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center md:text-left">
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">Status Akun</span>
                <span className="text-sm font-black text-[#A1FF00]">Aktif Vokasi</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-center md:text-left col-span-2 sm:col-span-1">
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">Rating</span>
                <span className="text-sm font-black text-amber-300">5.0 ★★★★★</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. LOWER SECTION OVERLAY (Ultra-rounded rounded-t-[40px] Container) */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Edit3 className="h-6 w-6 text-[#0B38E6]" />
              Pengaturan Profil & Rekening Bank
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Kelola deskripsi bio diri dan nomor rekening bank/e-wallet untuk pencairan stipend.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 text-[#0B38E6] px-4 py-2 rounded-full text-xs font-bold border border-blue-100 self-start md:self-auto">
            <CheckCircle2 className="h-4 w-4" />
            <span>Terhubung ke Postman Backend API</span>
          </div>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-3xl">
          
          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              Alamat Email Terdaftar
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-semibold text-xs md:text-sm px-4 py-3.5 rounded-2xl cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-400 font-medium">Email otentikasi Google/Sistem tidak dapat diubah secara langsung.</span>
          </div>

          {/* Bio Diri (PATCH /users/profile/siswa) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0B38E6]" />
              Deskripsi Bio & Keahlian Vokasi
            </label>
            <textarea
              rows={4}
              placeholder="Ceritakan minat, keahlian utama (Frontend/UI UX/RPL), serta pengalaman proyek Anda..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs md:text-sm p-4 rounded-2xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all resize-none shadow-xs"
            />
            <span className="text-[10px] text-slate-400 font-medium">Bio ini akan ditampilkan pada pengajuan lamaran proyek ke UMKM.</span>
          </div>

          {/* Rekening Bank & E-Wallet Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              Informasi Rekening Pencairan Uang Saku
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nama Bank / E-Wallet */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Penyedia Bank / E-Wallet
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs md:text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all"
                >
                  <option value="BCA">Bank BCA</option>
                  <option value="MANDIRI">Bank Mandiri</option>

                  <option value="GOPAY">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="DANA">DANA</option>
                </select>
              </div>

              {/* Nomor Rekening / Akun */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Nomor Rekening / HP Akun
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1234567890 / 081234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs md:text-sm px-4 py-3.5 rounded-2xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all"
                />
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B38E6] hover:bg-slate-950 text-white font-extrabold px-8 py-4 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#0B38E6]/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>Memperbarui...</>
              ) : (
                <>
                  <Save className="h-4 w-4 text-[#A1FF00]" />
                  Simpan Perubahan Profil
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
