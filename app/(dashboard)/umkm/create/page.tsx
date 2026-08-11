"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  PlusCircle,
  Calendar,
  Banknote,
  Layers,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Eye,
} from "lucide-react";
import { umkmApi } from "@/lib/api/umkm";
import { CreateProjectPayload } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

const JURUSAN_OPTIONS = [
  { id: "RPL", label: "RPL (Rekayasa Perangkat Lunak)", tag: "Software & Web" },
  { id: "TKJ", label: "TKJ (Teknik Komputer & Jaringan)", tag: "Jaringan & Server" },
  { id: "DKV", label: "DKV (Desain Komunikasi Visual)", tag: "Desain Grafis & UI/UX" },
  { id: "MULTIMEDIA", label: "Multimedia & Animasi", tag: "Video & 3D" },
  { id: "BISNIS_DIGITAL", label: "Bisnis Digital & Marketing", tag: "E-Commerce & Ads" },
  { id: "AKUNTANSI", label: "Akuntansi & Keuangan", tag: "Laporan & Pajak" },
];

const BUDGET_PRESETS = [750000, 1500000, 2500000, 5000000];

export default function CreateProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("RPL");
  const [budget, setBudget] = useState<number>(1500000);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setToast({
        isOpen: true,
        message: "Silakan masukkan judul proyek yang jelas.",
        type: "error",
      });
      return;
    }

    if (!description.trim() || description.length < 20) {
      setToast({
        isOpen: true,
        message: "Deskripsi proyek minimal 20 karakter agar siswa memahami kebutuhan Anda.",
        type: "error",
      });
      return;
    }

    if (budget < 100000) {
      setToast({
        isOpen: true,
        message: "Nominal uang saku/stipend minimal Rp 100.000.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateProjectPayload = {
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        deadline: new Date(deadline).toISOString(),
      };

      await umkmApi.createProject(payload);

      setToast({
        isOpen: true,
        message: "Proyek berhasil dipublikasikan! Siswa SMK dapat segera melamar.",
        type: "success",
      });

      setTimeout(() => {
        router.push("/umkm");
      }, 1200);
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal membuat proyek baru. Silakan coba lagi.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B38E6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Overview
        </Link>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200/60">
          <ShieldCheck className="h-3.5 w-3.5" />
          Escrow Protection Ready
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Buat Proyek Nyata Baru
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Tuliskan kebutuhan digital bisnis Anda, tentukan target jurusan SMK, dan sediakan
          uang saku yang pantas untuk siswa vokasi berprestasi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Container (White Glassmorphic) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Project Title */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Judul Proyek <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Pembuatan Website Ordering Cafe & Menu Digital"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6] focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
              />
              <p className="text-[11px] text-slate-400">
                Gunakan judul yang jelas, spesifik, dan menggambarkan hasil akhir.
              </p>
            </div>

            {/* 2. Target Jurusan (Pill Selector) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Target Jurusan Vokasi (Kategori) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {JURUSAN_OPTIONS.map((item) => {
                  const isSelected = category === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCategory(item.id)}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#0B38E6] text-white border-[#0B38E6] shadow-md shadow-[#0B38E6]/20"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span
                        className={`text-xs font-extrabold block ${
                          isSelected ? "text-[#A1FF00]" : "text-slate-900"
                        }`}
                      >
                        {item.id}
                      </span>
                      <span
                        className={`text-[11px] font-medium truncate ${
                          isSelected ? "text-white/90" : "text-slate-500"
                        }`}
                      >
                        {item.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Description */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Deskripsi Pekerjaan & Output yang Diharapkan{" "}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Jelaskan kebutuhan fitur, lingkup tugas, materi yang disediakan oleh UMKM, serta kriteria hasil yang memuaskan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3.5 text-sm font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6] focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
                required
              />
              <p className="text-[11px] text-slate-400">
                Karakter: {description.length} (Rekomendasi min. 100 karakter untuk detail lengkap).
              </p>
            </div>

            {/* 4. Budget & Presets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Anggaran / Uang Saku Siswa (IDR) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-bold text-[#0B38E6]">
                  Aman di Escrow
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-sm text-slate-500">
                  Rp
                </span>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3.5 text-base font-black rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6] focus:bg-white text-slate-900 transition-all"
                  required
                />
              </div>

              {/* Quick Budget Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Pilihan Cepat:
                </span>
                {BUDGET_PRESETS.map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setBudget(val)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      budget === val
                        ? "bg-[#0B38E6] text-white"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    Rp {(val / 1000).toLocaleString("id-ID")}k
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Deadline */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Batas Waktu Pengerjaan (Deadline) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6] focus:bg-white text-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            {/* Full-width Electric Lime Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A1FF00] hover:bg-[#8ee600] disabled:bg-slate-200 text-slate-900 font-black text-base py-4 rounded-2xl shadow-xl shadow-[#A1FF00]/30 hover:shadow-2xl transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
                    <span>Mempublikasikan Proyek...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 text-slate-900" />
                    <span>Publikasikan Proyek Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Live Project Card Preview on Right Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-[32px] p-6 sm:p-7 space-y-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A1FF00]">
                <Eye className="h-4 w-4" />
                <span>Live Student Preview</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white">
                Tampilan Siswa
              </span>
            </div>

            {/* Mockup Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#A1FF00] text-slate-900">
                  {category || "RPL"}
                </span>
                <span className="text-xs font-bold text-white/80 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#A1FF00]" />
                  {deadline
                    ? new Date(deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })
                    : "Deadline"}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-white line-clamp-2">
                  {title || "Judul Proyek Digital Anda"}
                </h3>
                <p className="text-xs text-white/70 line-clamp-3">
                  {description ||
                    "Deskripsi tugas dan spesifikasi teknis yang akan dibaca oleh siswa SMK sebelum mengirimkan pitch lamaran mereka..."}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/60 uppercase block font-semibold">
                    Uang Saku (Stipend)
                  </span>
                  <span className="text-lg font-black text-[#A1FF00]">
                    Rp {Number(budget || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold">
                  Lamar Proyek
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Note */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/80">
              <ShieldCheck className="h-5 w-5 text-[#A1FF00] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Uang saku hanya akan dicairkan dari sistem escrow setelah Anda memeriksa dan
                menyetujui hasil pekerjaan siswa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
