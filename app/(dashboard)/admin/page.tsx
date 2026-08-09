"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/lib/api/admin";
import {
  PendingProjectItem,
  AdminOverviewMetrics,
  ProjectItem,
} from "@/types/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Users,
  Wallet,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Check,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  CheckSquare,
} from "lucide-react";


export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<AdminOverviewMetrics | null>(null);
  const [pendingProjects, setPendingProjects] = useState<PendingProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<PendingProjectItem | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rejectingProject, setRejectingProject] = useState<PendingProjectItem | null>(null);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [overviewData, pendingData] = await Promise.all([
        adminService.getAdminOverview(),
        adminService.getPendingProjects(),
      ]);
      setMetrics(overviewData);
      setPendingProjects(pendingData);
    } catch (err: any) {
      console.error("Gagal memuat data admin:", err);
      setToast({
        isOpen: true,
        message: err.message || "Gagal memuat data dari server.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleApprove = async (projectId: string, title: string) => {
    try {
      setActionLoadingId(projectId);
      await adminService.approveProject(projectId);
      setToast({
        isOpen: true,
        message: `Proyek "${title}" berhasil disetujui & tayang ke siswa!`,
        type: "success",
      });
      // Remove from list & update metrics
      setPendingProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (metrics) {
        setMetrics({
          ...metrics,
          proyekPendingCount: Math.max(0, metrics.proyekPendingCount - 1),
          proyekApprovedCount: metrics.proyekApprovedCount + 1,
        });
      }
      setSelectedProject(null);
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal menyetujui proyek.",
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectConfirm = (project: PendingProjectItem) => {
    setRejectingProject(project);
  };

  const executeReject = () => {
    if (!rejectingProject) return;
    setPendingProjects((prev) => prev.filter((p) => p.id !== rejectingProject.id));
    if (metrics) {
      setMetrics({
        ...metrics,
        proyekPendingCount: Math.max(0, metrics.proyekPendingCount - 1),
      });
    }
    setToast({
      isOpen: true,
      message: `Proyek "${rejectingProject.title}" telah ditolak dan dikembalikan ke UMKM.`,
      type: "info",
    });
    setRejectingProject(null);
  };

  const categories = ["Semua", "RPL", "TKJ", "DKV", "Multimedia", "AKL"];

  const filteredProjects = pendingProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.umkm?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" ||
      p.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
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
      {/* 1. TOP HEADER BANNER & INSTITUTIONAL METRICS */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-gradient-to-br from-slate-900 via-[#0B38E6] to-slate-900 p-6 md:p-10 text-white shadow-2xl shadow-[#0B38E6]/20 border border-white/10">
        {/* Background Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#A1FF00]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0B38E6]/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold text-[#A1FF00]">
              <Sparkles className="h-3.5 w-3.5 text-[#A1FF00]" />
              <span>Portal Moderasi Sekolah & Supervisi PKL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Selamat Datang,{" "}
              <span className="text-[#A1FF00] underline decoration-wavy decoration-[#A1FF00]/40">
                Admin / Guru Pembimbing
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Monitor aktivitas proyek UMKM, verifikasi pengajuan bounty vokasi, dan supervisi progres pembelajaran siswa secara konsisten.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-black text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#A1FF00] ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh Data</span>
            </button>
            <Link
              href="/admin/monitoring"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#A1FF00] hover:bg-[#8fe600] text-slate-900 text-xs font-black transition-all shadow-lg shadow-[#A1FF00]/20 active:scale-95 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              <span>Monitoring Siswa</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Bento 1: Hero Stat - Total Siswa Aktif PKL */}
        <div className="md:col-span-2 relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between border border-slate-800 shadow-xl group hover:border-[#0B38E6]/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00] shadow-lg shadow-[#0B38E6]/30">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Metrik Vokasi Utama
                </span>
                <h3 className="text-base font-extrabold text-white">
                  Total Siswa Aktif PKL / Bounty
                </h3>
              </div>
            </div>
            <span className="bg-[#A1FF00]/20 text-[#A1FF00] text-xs font-black px-3 py-1 rounded-full border border-[#A1FF00]/30">
              Aktif Belajar
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-4">
            <span className="text-5xl md:text-6xl font-black text-[#A1FF00] tracking-tight">
              {isLoading ? "..." : (metrics?.totalSiswaAktif ?? 0)}
            </span>
            <div className="flex flex-col text-xs text-slate-300 font-semibold">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi Pembimbing
              </span>
              <span>Tersebar di berbagai mitra industri</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Standar Supervisi Industri Vokasi</span>
            <Link
              href="/admin/monitoring"
              className="text-[#A1FF00] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
            >
              Lihat Detail Siswa &rarr;
            </Link>
          </div>
        </div>

        {/* Bento 2: Proyek Menunggu Approval */}
        <div className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Antrean Moderasi
            </span>
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : (metrics?.proyekPendingCount ?? pendingProjects.length)}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Proyek UMKM Menunggu Approval
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Perlu Moderasi
            </span>
            <a href="#pending-table" className="text-[#0B38E6] font-bold hover:underline">
              Periksa &rarr;
            </a>
          </div>
        </div>

        {/* Bento 3: Total Mitra UMKM Terhubung */}
        <div className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Ekosistem Industri
            </span>
            <div className="h-10 w-10 rounded-2xl bg-[#0B38E6]/10 flex items-center justify-center text-[#0B38E6]">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="my-2">
            <h4 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLoading ? "..." : (metrics?.totalMitraUmkm ?? 0)}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Mitra UMKM Terverifikasi
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Memberi Project Real</span>
            <span className="text-emerald-600 font-bold">100% Verified</span>
          </div>
        </div>
      </div>

      {/* 2B. SECOND BENTO ROW: Escrow Secured & Jurusan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bento 4: Total Escrow Secured */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0B38E6] to-blue-700 text-white p-6 md:p-8 border border-blue-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="h-11 w-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#A1FF00]">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="bg-[#A1FF00] text-slate-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              Escrow Guaranteed
            </span>
          </div>
          <div className="space-y-1 my-2">
            <span className="text-xs text-blue-100 font-mono font-semibold uppercase tracking-wider">
              Total Dana Escrow Teramankan
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isLoading ? "..." : formatRupiah(metrics?.totalEscrowHeld ?? 0)}
            </h3>
            <p className="text-xs text-blue-100/80 font-medium">
              Dana tersimpan aman sebelum pencairan ke rekening siswa.
            </p>
          </div>
          <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-white/80 font-semibold">Keamanan Transaksi</span>
            <Link
              href="/admin/transactions"
              className="text-[#A1FF00] font-bold flex items-center gap-1 hover:underline"
            >
              Cek Transaksi &rarr;
            </Link>
          </div>
        </div>

        {/* Bento 5: Distribusi Jurusan Siswa */}
        <div className="lg:col-span-2 rounded-[32px] bg-white p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-[#A1FF00]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Distribusi Jurusan Siswa & Proyek
                </h3>
                <p className="text-xs text-slate-500">
                  Persentase alokasi proyek sesuai bidang keahlian vokasi.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              SMKN 1 Jakarta
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {metrics?.jurusanDistribution && metrics.jurusanDistribution.length > 0 ? (
              metrics.jurusanDistribution.map((item) => (
                <div
                  key={item.jurusan}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#0B38E6]"></span>
                      {item.jurusan}
                    </span>
                    <span className="text-slate-500">
                      {item.count} Proyek ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0B38E6] to-[#A1FF00] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(10, item.percentage)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-xs text-slate-400">
                Belum ada data distribusi jurusan dari proyek aktif.
              </div>
            )}
          </div>
        </div>
      </div>


      {/* 3. PENDING APPROVALS TABLE / MODERATION LIST */}
      <div
        id="pending-table"
        className="rounded-[32px] bg-white border border-slate-200/80 shadow-md overflow-hidden p-6 md:p-8 space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Verifikasi & Moderasi Proyek UMKM
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Setujui (ACC) atau tolak pengajuan proyek baru dari UMKM mitra sebelum dipublikasikan ke siswa.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari proyek atau UMKM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B38E6] transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0B38E6] text-white shadow-md shadow-[#0B38E6]/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="space-y-4 py-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 rounded-2xl bg-slate-100 animate-pulse w-full"
              ></div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-14 space-y-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-base">
                Tidak Ada Proyek Menunggu Moderasi
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Semua proyek pengajuan dari Mitra UMKM telah disetujui atau tidak ada antrean baru.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50/60">
                  <th className="py-3.5 px-4 font-bold rounded-l-2xl">Proyek & Deskripsi</th>
                  <th className="py-3.5 px-4 font-bold">Mitra UMKM</th>
                  <th className="py-3.5 px-4 font-bold">Target Jurusan</th>
                  <th className="py-3.5 px-4 font-bold">Budget & Deadline</th>
                  <th className="py-3.5 px-4 font-bold rounded-r-2xl text-right">Aksi Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-extrabold text-slate-900 group-hover:text-[#0B38E6] transition-colors truncate">
                        {project.title}
                      </div>
                      <div className="text-slate-500 line-clamp-1 mt-0.5 text-[11px]">
                        {project.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#0B38E6]" />
                        {project.umkm?.companyName || "UMKM Mitra"}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {project.umkm?.industryType || "Industri Kreatif"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-[#0B38E6]/10 text-[#0B38E6] font-black text-[10px] uppercase">
                        {project.category || "RPL"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-black text-slate-900">
                        {formatRupiah(project.budget)}
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(project.deadline)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Detail Modal Button */}
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                          title="Lihat Detail Proyek"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* ACC / Approve Button */}
                        <button
                          onClick={() => handleApprove(project.id, project.title)}
                          disabled={actionLoadingId === project.id}
                          className="px-3.5 py-2 rounded-xl bg-[#A1FF00] hover:bg-[#8fe600] text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {actionLoadingId === project.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          )}
                          <span>ACC Proyek</span>
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleRejectConfirm(project)}
                          disabled={actionLoadingId === project.id}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold transition-colors cursor-pointer"
                          title="Tolak Proyek"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DETAIL MODAL DRAWER */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-xl w-full rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Detail Moderasi Proyek
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {selectedProject.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Deskripsi Proyek:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedProject.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">
                    Mitra UMKM:
                  </span>
                  <span className="font-extrabold text-slate-900 block text-sm">
                    {selectedProject.umkm?.companyName || "Mitra UMKM"}
                  </span>
                  <span className="text-slate-500 block text-[11px]">
                    {selectedProject.umkm?.industryType || "Industri"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">
                    Budget Bounty:
                  </span>
                  <span className="font-black text-[#0B38E6] block text-sm">
                    {formatRupiah(selectedProject.budget)}
                  </span>
                  <span className="text-emerald-600 font-bold block text-[11px]">
                    Escrow Ready
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">
                    Target Jurusan:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B38E6]/10 text-[#0B38E6] font-black text-[10px] uppercase inline-block">
                    {selectedProject.category}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[10px]">
                    Deadline Pengerjaan:
                  </span>
                  <span className="font-bold text-slate-800 block text-xs">
                    {formatDate(selectedProject.deadline)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => handleApprove(selectedProject.id, selectedProject.title)}
                disabled={actionLoadingId === selectedProject.id}
                className="px-6 py-3 rounded-2xl bg-[#A1FF00] hover:bg-[#8fe600] text-slate-900 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {actionLoadingId === selectedProject.id ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 stroke-[3]" />
                )}
                <span>ACC & Publikasikan Proyek</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-[32px] p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-lg">
                Tolak Proyek ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Proyek <strong className="text-slate-800">{rejectingProject.title}</strong> akan dikembalikan ke UMKM dengan catatan perlunya perbaikan informasi.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setRejectingProject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Ya, Tolak Proyek
              </button>
            </div>
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
