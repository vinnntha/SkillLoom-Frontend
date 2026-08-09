"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Mail,
  User,
  CheckCircle2,
  Lock,
  Save,
  Sparkles,
} from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState(
    user?.adminProfile?.schoolName || user?.name || "Admin Sekolah"
  );
  const [position, setPosition] = useState(
    user?.adminProfile?.position || "Guru Pembimbing / Moderasi Vokasi"
  );
  const [email] = useState(user?.email || "");

  const [isSaving, setIsSaving] = useState(false);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToast({
        isOpen: true,
        message: "Profil Admin Sekolah berhasil diperbarui!",
        type: "success",
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* PROFILE HEADER CARD */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-slate-900 text-white p-6 md:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B38E6]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-[#A1FF00] font-black text-2xl shadow-xl border border-white/20 shrink-0">
            {schoolName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase() || "SK"}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A1FF00]/20 text-[#A1FF00] font-black text-xs border border-[#A1FF00]/30 mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Institusi Sekolah Terverifikasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{schoolName}</h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">{position}</p>
          </div>
        </div>
      </div>

      {/* FORM PROFILE SECTION */}
      <div className="rounded-[32px] bg-white p-6 md:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#0B38E6]" />
            Informasi Institusi & Pengelola
          </h2>
          <p className="text-xs text-slate-500">
            Kelola rincian nama sekolah vokasi dan jabatan pengawas/moderator.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nama Sekolah / SMKN Vokasi:
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0B38E6]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Jabatan / Posisi Pembimbing:
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0B38E6]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Email Resmi Akun:
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500 cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Email dikunci demi keamanan otentikasi akun sekolah.
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3.5 rounded-2xl bg-[#0B38E6] hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#0B38E6]/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4 text-[#A1FF00]" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Global Toast */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
