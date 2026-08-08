"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Briefcase,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { umkmApi } from "@/lib/api/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmProfilePage() {
  const { user, refreshUser } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [industryType, setIndustryType] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

  useEffect(() => {
    if (user?.umkmProfile) {
      setCompanyName(user.umkmProfile.companyName || "");
      setIndustryType(user.umkmProfile.industryType || "Kuliner & Digital");
      setAddress(user.umkmProfile.address || "");
      setPhoneNumber(user.umkmProfile.phoneNumber || "");
    } else if (user) {
      setCompanyName(user.name || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await umkmApi.updateProfile({
        companyName: companyName.trim(),
        address: address.trim(),
        industryType: industryType.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      await refreshUser();

      setToast({
        isOpen: true,
        message: "Profil UMKM & Mitra Industri berhasil diperbarui!",
        type: "success",
      });
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal memperbarui profil.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B38E6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Overview
        </Link>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Mitra Terverifikasi
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Profil Usaha / Brand UMKM 🏢
        </h1>
        <p className="text-sm text-slate-500">
          Kelola informasi nama brand, bidang industri, dan alamat kantor untuk identitas proyek.
        </p>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Nama Perusahaan / Brand UMKM:
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: Kopi Maju Jaya Digital"
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Bidang Industri:
              </label>
              <input
                type="text"
                value={industryType}
                onChange={(e) => setIndustryType(e.target.value)}
                placeholder="Contoh: Kuliner, Retail, Jasa, Fashion"
                className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Alamat Lengkap Usaha:
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Merdeka No. 10, Jakarta Pusat..."
              className="w-full px-4 py-3 text-sm font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Nomor WhatsApp / Kontak:
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-3 text-sm font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#0B38E6]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
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
