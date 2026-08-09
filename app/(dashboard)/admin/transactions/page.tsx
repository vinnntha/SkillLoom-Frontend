"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin";
import { TransactionItem } from "@/types/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  RefreshCw,
  Search,
  Eye,
  Check,
  ArrowUpRight,
  XCircle,
  FileCheck,
  Lock,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllTransactions();
      setTransactions(data || []);
    } catch (err: any) {
      console.error("Gagal memuat transaksi escrow:", err);
      setToast({
        isOpen: true,
        message: err.message || "Gagal memuat transaksi escrow dari Railway backend.",
        type: "error",
      });
      setTransactions([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTransactions();
  };

  const handleVerifyHold = async (txId: string) => {
    try {
      setActionLoadingId(txId);
      await adminService.holdEscrow(txId, { paymentStatus: "ESCROW_HELD" });
      setToast({
        isOpen: true,
        message: "Bukti transfer diverifikasi! Dana berhasil dikunci di Escrow.",
        type: "success",
      });
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, paymentStatus: "ESCROW_HELD" } : t))
      );
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Verifikasi escrow gagal.",
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReleasePayout = async (txId: string) => {
    try {
      setActionLoadingId(txId);
      await adminService.releaseEscrow(txId);
      setToast({
        isOpen: true,
        message: "Dana escrow berhasil dicairkan langsung ke dompet siswa!",
        type: "success",
      });
      setTransactions((prev) =>
        prev.map((t) => (t.id === txId ? { ...t, paymentStatus: "RELEASED" } : t))
      );
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Pencairan dana gagal.",
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* BANNER HEADER */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-[#0B38E6] via-slate-900 to-[#0B38E6] text-white p-6 md:p-10 border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#A1FF00]">
              <ShieldCheck className="h-4 w-4 text-[#A1FF00]" />
              <span>Verifikasi Finansial & Escrow Audit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Manajemen Escrow & Pencairan Payout Siswa
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
              Verifikasi transfer pembayaran UMKM mitra dan setujui pencairan insentif/bounty ke rekening siswa vokasi setelah pengerjaan selesai.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 text-[#A1FF00] ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh Transaksi</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Escrow Hold (Terkunci)
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(
                transactions
                  .filter((t) => t.paymentStatus === "ESCROW_HELD")
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </h3>
            <span className="text-[11px] text-amber-600 font-bold block mt-1">
              Aman di Rekening Penampung
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Lock className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Payout Dicairkan (Released)
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(
                transactions
                  .filter((t) => t.paymentStatus === "RELEASED")
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold block mt-1">
              Sukses Diterima Siswa
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Total Nilai Transaksi
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {formatRupiah(transactions.reduce((sum, t) => sum + t.amount, 0))}
            </h3>
            <span className="text-[11px] text-[#0B38E6] font-bold block mt-1">
              {transactions.length} Transaksi Terdaftar
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#0B38E6]/10 flex items-center justify-center text-[#0B38E6]">
            <Wallet className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="rounded-[32px] bg-white p-6 md:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Daftar Transaksi Escrow
            </h2>
            <p className="text-xs text-slate-500">
              Audit status transfer pembayaran UMKM dan persetujuan klaim insentif siswa.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/60">
                <th className="py-3.5 px-4 font-bold rounded-l-2xl">ID & UMKM Mitra</th>
                <th className="py-3.5 px-4 font-bold">Nominal Payout</th>
                <th className="py-3.5 px-4 font-bold">Status Escrow</th>
                <th className="py-3.5 px-4 font-bold">Tanggal Dibuat</th>
                <th className="py-3.5 px-4 font-bold rounded-r-2xl text-right">Aksi Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-slate-900">{tx.id}</div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5 text-[11px]">
                      <Building2 className="h-3 w-3 text-[#0B38E6]" />
                      {tx.umkm?.companyName || "UMKM Mitra"}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-black text-[#0B38E6]">
                    {formatRupiah(tx.amount)}
                  </td>
                  <td className="py-4 px-4">
                    {tx.paymentStatus === "ESCROW_HELD" && (
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase border border-amber-200">
                        ESCROW HELD (TERKUNCI)
                      </span>
                    )}
                    {tx.paymentStatus === "RELEASED" && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase border border-emerald-200">
                        RELEASED (DICAIRKAN)
                      </span>
                    )}
                    {tx.paymentStatus === "UNPAID" && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[10px] uppercase border border-slate-200">
                        BELUM DIBAYAR
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tx.paymentProof && (
                        <button
                          onClick={() => setSelectedProofUrl(tx.paymentProof || null)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Bukti Transfer</span>
                        </button>
                      )}

                      {tx.paymentStatus === "UNPAID" && (
                        <button
                          onClick={() => handleVerifyHold(tx.id)}
                          disabled={actionLoadingId === tx.id}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0B38E6] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoadingId === tx.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <FileCheck className="h-3.5 w-3.5" />
                          )}
                          <span>Verifikasi Hold</span>
                        </button>
                      )}

                      {tx.paymentStatus === "ESCROW_HELD" && (
                        <button
                          onClick={() => handleReleasePayout(tx.id)}
                          disabled={actionLoadingId === tx.id}
                          className="px-3.5 py-1.5 rounded-xl bg-[#A1FF00] hover:bg-[#8fe600] text-slate-900 font-black text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoadingId === tx.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3 stroke-[3]" />
                          )}
                          <span>Cairkan ke Siswa</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROOF IMAGE MODAL */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-[32px] p-6 space-y-4 shadow-2xl border border-slate-200 relative overflow-hidden text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Bukti Transfer Escrow</h3>
              <button onClick={() => setSelectedProofUrl(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-96 flex items-center justify-center bg-slate-50">
              <img src={selectedProofUrl} alt="Bukti Transfer Escrow" className="object-contain max-h-80 w-full" />
            </div>
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}

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
