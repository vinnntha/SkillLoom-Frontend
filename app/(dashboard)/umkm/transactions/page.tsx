"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Banknote,
  Send,
  Building2,
  Lock,
  ArrowLeft,
  PlusCircle,
  UploadCloud,
} from "lucide-react";
import { umkmApi } from "@/lib/api/umkm";
import { TransactionItem, ProjectItem } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inisiasi Escrow Modal state
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [amount, setAmount] = useState<number>(1500000);
  const [paymentProof, setPaymentProof] = useState<string>(
    "https://storage.example.com/proofs/transfer_123.jpg"
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [txRes, projRes] = await Promise.allSettled([
        umkmApi.getMyTransactions(),
        umkmApi.getMyProjects(),
      ]);

      if (txRes.status === "fulfilled" && Array.isArray(txRes.value)) {
        setTransactions(txRes.value);
      }
      if (projRes.status === "fulfilled" && Array.isArray(projRes.value)) {
        setProjects(projRes.value);
        if (projRes.value.length > 0) {
          setSelectedProjectId(projRes.value[0].id);
          setAmount(Number(projRes.value[0].budget || 1500000));
        }
      }
    } catch (err) {
      console.warn("Failed to load transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setToast({
        isOpen: true,
        message: "Pilih proyek yang akan didanai escrow.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await umkmApi.initiateEscrow({
        projectId: selectedProjectId,
        amount: Number(amount),
        paymentProof,
      });

      setToast({
        isOpen: true,
        message: "Inisiasi escrow berhasil dibuat!",
        type: "success",
      });
      setIsInitiateModalOpen(false);
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal menginisiasi escrow.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHold = async (txId: string) => {
    try {
      await umkmApi.holdEscrow(txId, {
        paymentStatus: "ESCROW_HELD",
        paymentProof,
      });
      setToast({
        isOpen: true,
        message: "Status transaksi berhasil diverifikasi menjadi ESCROW_HELD (Dana Terkunci)!",
        type: "success",
      });
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal memverifikasi status escrow.",
        type: "error",
      });
    }
  };

  const handleRelease = async (txId: string) => {
    try {
      await umkmApi.releaseEscrow(txId);
      setToast({
        isOpen: true,
        message: "Dana berhasil dicairkan (RELEASED) ke rekening siswa SMK!",
        type: "success",
      });
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal mencairkan dana.",
        type: "error",
      });
    }
  };

  let totalHeld = 0;
  let totalReleased = 0;
  transactions.forEach((tx) => {
    const amt = Number(tx.amount || 0);
    if (tx.paymentStatus === "ESCROW_HELD") totalHeld += amt;
    if (tx.paymentStatus === "RELEASED") totalReleased += amt;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Transaksi & Sistem Escrow
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[#A1FF00] text-slate-900">
              Garansi 100%
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Kelola penguncian dana proyek (ESCROW_HELD) dan pencairan langsung ke siswa (RELEASED).
          </p>
        </div>

        <button
          onClick={() => setIsInitiateModalOpen(true)}
          className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-[#0B38E6]/25 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-[#A1FF00]" />
          Inisiasi Pembayaran Escrow
        </button>
      </div>

      {/* Escrow Balance Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B38E6] text-white rounded-[32px] p-7 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1 relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white/70">
              Total Dana Escrow Terkunci (HELD)
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#A1FF00]">
              Rp {totalHeld.toLocaleString("id-ID")}
            </h3>
            <p className="text-xs text-white/60">
              Aman di rekening escrow SkillLoom hingga pekerjaan selesai.
            </p>
          </div>
          <Lock className="absolute -right-4 -bottom-4 h-36 w-36 text-white/5 pointer-events-none" />
        </div>

        <div className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Total Dana Dicairkan (RELEASED)
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600">
              Rp {totalReleased.toLocaleString("id-ID")}
            </h3>
            <p className="text-xs text-slate-500">
              Telah diterima oleh siswa vokasi berprestasi.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[32px] p-7 shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A1FF00]">
              SkillLoom Protection
            </span>
            <h3 className="text-lg font-black text-white">
              Garansi Uang Kembali
            </h3>
            <p className="text-xs text-slate-300">
              Jika siswa tidak menyelesaikan proyek sesuai kesepakatan, dana escrow akan
              dikembalikan 100% ke akun UMKM Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Histori Transaksi Escrow Anda
        </h2>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#0B38E6] border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Memuat riwayat transaksi...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Wallet className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">
              Belum Ada Transaksi Escrow
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Setelah Anda menerima pelamar siswa (ACC), klik Inisiasi Escrow untuk mengunci dana.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">ID Transaksi / Proyek</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                  <th className="py-3 px-4">Bukti Transfer</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Aksi Escrow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {transactions.map((tx) => {
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-slate-900 block">
                            {tx.project?.title || `Proyek #${tx.projectId.substring(0, 8)}`}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            TX: {tx.id.substring(0, 10)}...
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-black text-slate-900">
                          Rp {Number(tx.amount || 0).toLocaleString("id-ID")}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                            tx.paymentStatus === "RELEASED"
                              ? "bg-emerald-100 text-emerald-800"
                              : tx.paymentStatus === "ESCROW_HELD"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-[#0B38E6]"
                          }`}
                        >
                          {tx.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {tx.paymentProof ? (
                          <a
                            href={tx.paymentProof}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-[#0B38E6] hover:underline flex items-center gap-1"
                          >
                            Lihat Bukti
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {tx.paymentStatus === "UNPAID" && (
                            <button
                              onClick={() => handleHold(tx.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                            >
                              Kunci (ESCROW_HELD)
                            </button>
                          )}
                          {tx.paymentStatus === "ESCROW_HELD" && (
                            <button
                              onClick={() => handleRelease(tx.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl cursor-pointer"
                            >
                              Cairkan ke Siswa
                            </button>
                          )}
                          {tx.paymentStatus === "RELEASED" && (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Selesai
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Inisiasi Pembayaran */}
      <AnimatePresence>
        {isInitiateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0B38E6]" />
                  Inisiasi Pembayaran Escrow
                </h3>
                <button
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInitiate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Pilih Proyek:</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      const p = projects.find((x) => x.id === e.target.value);
                      if (p) setAmount(Number(p.budget || 1500000));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (Rp {Number(p.budget || 0).toLocaleString("id-ID")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Nominal Escrow (IDR):
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Link Bukti Transfer Bank / Rekening:
                  </label>
                  <input
                    type="text"
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsInitiateModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-black px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    {isSubmitting ? "Memproses..." : "Inisiasi Escrow"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
