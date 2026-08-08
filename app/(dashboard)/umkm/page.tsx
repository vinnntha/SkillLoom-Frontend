"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wallet,
  Briefcase,
  Users,
  PlusCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  Layers,
  Banknote,
  Send,
  Building2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { umkmApi } from "@/lib/api/umkm";
import { ProjectItem, ApplicationItem, TransactionItem } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmDashboardOverviewPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalApplicantsCount, setTotalApplicantsCount] = useState<number>(0);
  const [totalEscrowAmount, setTotalEscrowAmount] = useState<number>(0);
  const [escrowHeldAmount, setEscrowHeldAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const displayName =
    user?.umkmProfile?.companyName || user?.name || "Mitra UMKM";

  // Fetch all projects, applicants, and transactions
  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [projRes, txRes] = await Promise.allSettled([
          umkmApi.getMyProjects(),
          umkmApi.getMyTransactions(),
        ]);

        let loadedProjects: ProjectItem[] = [];
        if (projRes.status === "fulfilled" && Array.isArray(projRes.value)) {
          loadedProjects = projRes.value;
          setProjects(loadedProjects);
        }

        let loadedTxs: TransactionItem[] = [];
        if (txRes.status === "fulfilled" && Array.isArray(txRes.value)) {
          loadedTxs = txRes.value;
          setTransactions(loadedTxs);
        }

        // Compute total escrow funds (Held + Released)
        let totalHeld = 0;
        let totalReleased = 0;
        loadedTxs.forEach((tx) => {
          const amt = Number(tx.amount || 0);
          if (tx.paymentStatus === "ESCROW_HELD") {
            totalHeld += amt;
          } else if (tx.paymentStatus === "RELEASED") {
            totalReleased += amt;
          }
        });
        setEscrowHeldAmount(totalHeld);
        setTotalEscrowAmount(totalHeld + totalReleased);

        // Fetch applicants count across all projects
        let totalApps = 0;
        const applicantPromises = loadedProjects.map(async (p) => {
          try {
            const apps = await umkmApi.getApplicantsByProject(p.id);
            if (Array.isArray(apps)) {
              return apps.length;
            }
          } catch {
            return p.applications ? p.applications.length : 0;
          }
          return 0;
        });

        const counts = await Promise.all(applicantPromises);
        totalApps = counts.reduce((acc, curr) => acc + curr, 0);
        setTotalApplicantsCount(totalApps);
      } catch (err) {
        console.warn("Failed to load UMKM overview stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Filtered project list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  const activeProjectsCount = projects.filter(
    (p) => p.status === "OPEN" || p.status === "IN_PROGRESS" || p.status === "REVIEW"
  ).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 280, damping: 24 },
    },
  };

  // Helper for status badge styling
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#0B38E6] border border-[#0B38E6]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B38E6] animate-pulse"></span>
            Open (Mencari Siswa)
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-600 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            In Progress
          </span>
        );
      case "REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-600 border border-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            Review Hasil
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ======================================================== */}
      {/* TOP HEADER BAR                                           */}
      {/* ======================================================== */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-6 rounded-[28px] border border-white/80 shadow-sm"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Halo, {displayName} 👋
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Pantau proyek dan talenta SMK Anda hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/umkm/create"
            className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#A1FF00]/25 hover:shadow-xl transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="h-5 w-5 text-slate-900" />
            Buat Proyek Baru
          </Link>
          <Link
            href="/umkm/transactions"
            className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-sm px-5 py-3.5 rounded-2xl shadow-lg shadow-[#0B38E6]/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Wallet className="h-4 w-4 text-[#A1FF00]" />
            <span className="hidden sm:inline">Kelola Escrow</span>
          </Link>
        </div>
      </motion.div>

      {/* ======================================================== */}
      {/* BENTO GRID OVERVIEW (3 CARDS)                            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 (Dark Blue #0B38E6): Total Dana Escrow/Terpakai */}
        <motion.div
          variants={itemVariants}
          className="bg-[#0B38E6] text-white rounded-[32px] p-7 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_45px_-12px_rgba(11,56,230,0.35)] group"
        >
          {/* Subtle Background Icon Accent */}
          <Wallet className="absolute -right-6 -bottom-6 h-44 w-44 text-white/10 rotate-[-12deg] pointer-events-none transition-transform group-hover:scale-105 duration-500" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-xs font-extrabold uppercase tracking-wider block">
                Total Dana Escrow/Terpakai
              </span>
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#A1FF00] text-slate-900">
                Garansi 100%
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-[#A1FF00] tracking-tight py-1">
              Rp {totalEscrowAmount.toLocaleString("id-ID")}
            </h3>

            <div className="pt-2 text-xs text-white/70 space-y-1">
              <div className="flex justify-between items-center border-b border-white/10 pb-1">
                <span>Escrow Tertampung:</span>
                <span className="font-bold text-white">
                  Rp {escrowHeldAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span>Cair ke Siswa:</span>
                <span className="font-bold text-[#A1FF00]">
                  Rp {(totalEscrowAmount - escrowHeldAmount).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <Link
              href="/umkm/transactions"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
            >
              Inisiasi / Tarik
              <ArrowUpRight className="h-3.5 w-3.5 text-[#A1FF00]" />
            </Link>
            <span className="text-[11px] text-white/60 font-semibold">
              {transactions.length} Transaksi Tercatat
            </span>
          </div>
        </motion.div>

        {/* Card 2 (White): Proyek Aktif */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-[#0B38E6]/30 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">
                Proyek Aktif
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 group-hover:text-[#0B38E6] transition-colors">
                {isLoading ? "..." : activeProjectsCount}
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0B38E6] group-hover:bg-[#0B38E6] group-hover:text-[#A1FF00] transition-colors">
              <Briefcase className="h-7 w-7" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Total Proyek:</span>
              <span className="font-bold text-slate-800">{projects.length} dibuat</span>
            </div>

            {/* Visual Mini Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-[#0B38E6] h-full"
                style={{
                  width: `${
                    projects.length > 0
                      ? (activeProjectsCount / projects.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${
                    projects.length > 0
                      ? ((projects.length - activeProjectsCount) / projects.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href="/umkm/create"
                className="text-xs font-extrabold text-[#0B38E6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Buka Proyek Baru
                <ChevronRight className="h-3 w-3" />
              </Link>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {projects.filter((p) => p.status === "COMPLETED").length} Selesai
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 3 (White): Total Pelamar Baru */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-[#0B38E6]/30 transition-all relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-extrabold uppercase tracking-wider block">
                Total Pelamar Baru
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 group-hover:text-[#0B38E6] transition-colors">
                {isLoading ? "..." : totalApplicantsCount}
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-[#A1FF00] group-hover:text-slate-900 transition-colors">
              <Users className="h-7 w-7" />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#0B38E6]">
                RPL
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-50 text-purple-600">
                TKJ
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-600">
                DKV
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto">
                Siap Magang
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href="/umkm/applicants"
                className="text-xs font-extrabold text-[#0B38E6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Review Semua Pelamar
                <ChevronRight className="h-3 w-3" />
              </Link>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Terverifikasi SMK
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* ESCROW & WORKFLOW ACCENT BANNER                          */}
      {/* ======================================================== */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-[#0B38E6]/10 via-[#0B38E6]/5 to-[#A1FF00]/10 border border-[#0B38E6]/20 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] text-[#A1FF00] flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Alur Escrow Otomatis & Terjamin SkillLoom
            </h4>
            <p className="text-xs text-slate-600">
              1. Buat Proyek ➔ 2. ACC Pelamar ➔ 3. Kunci Dana di Escrow ➔ 4. Siswa Kerjakan ➔ 5. Cairkan Dana Setelah Review.
            </p>
          </div>
        </div>

        <Link
          href="/umkm/transactions"
          className="text-xs font-extrabold text-[#0B38E6] hover:text-[#092ec0] bg-white px-4 py-2 rounded-xl border border-[#0B38E6]/20 shadow-sm shrink-0 flex items-center gap-1.5"
        >
          Pelajari Sistem Escrow
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </motion.div>

      {/* ======================================================== */}
      {/* RECENT PROJECTS LIST                                     */}
      {/* ======================================================== */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6"
      >
        {/* Table / List Header with Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Daftar Proyek UMKM Anda
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                {projects.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Kelola status penerimaan siswa, batas pengerjaan, dan pencairan dana proyek.
            </p>
          </div>

          {/* Controls: Search & Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari proyek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200/80 focus:outline-none focus:border-[#0B38E6] text-slate-800 w-40 sm:w-48 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
              {["ALL", "OPEN", "IN_PROGRESS", "REVIEW", "COMPLETED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-white text-[#0B38E6] shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {st === "ALL" ? "Semua" : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#0B38E6] border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Memuat data proyek UMKM...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-3xl bg-blue-50 text-[#0B38E6] flex items-center justify-center mx-auto shadow-inner">
              <Briefcase className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 text-lg">
                {searchTerm || statusFilter !== "ALL"
                  ? "Tidak ada proyek yang sesuai filter"
                  : "Belum Ada Proyek yang Dibuat"}
              </h3>
              <p className="text-xs text-slate-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "Coba ubah kata kunci pencarian atau reset filter status proyek."
                  : "Mulai buat proyek nyata untuk mengundang siswa SMK bertalenta mengerjakan kebutuhan digital UMKM Anda."}
              </p>
            </div>

            {!searchTerm && statusFilter === "ALL" && (
              <Link
                href="/umkm/create"
                className="inline-flex items-center gap-2 bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-extrabold text-xs px-6 py-3 rounded-full shadow-lg shadow-[#A1FF00]/25 transition-transform active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                Buat Proyek Pertama Anda
              </Link>
            )}
          </div>
        ) : (
          /* Projects Table / Card List */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Proyek & Kategori</th>
                  <th className="py-3 px-4">Uang Saku / Anggaran</th>
                  <th className="py-3 px-4">Batas Waktu (Deadline)</th>
                  <th className="py-3 px-4">Status Proyek</th>
                  <th className="py-3 px-4 text-center">Pelamar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                {filteredProjects.map((project) => {
                  const deadlineDate = project.deadline
                    ? new Date(project.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Tanpa batas";

                  const applicantCount = Array.isArray(project.applications)
                    ? project.applications.length
                    : 0;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Project Name & Category */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Link
                            href={`/umkm/projects/${project.id}`}
                            className="font-extrabold text-slate-900 group-hover:text-[#0B38E6] transition-colors block line-clamp-1"
                          >
                            {project.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#0B38E6]/10 text-[#0B38E6]">
                              {project.category}
                            </span>
                            <span className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">
                              {project.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900">
                          Rp {Number(project.budget || 0).toLocaleString("id-ID")}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{deadlineDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusBadge(project.status)}
                      </td>

                      {/* Applicants Count */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <Link
                          href={`/umkm/projects/${project.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 hover:bg-[#0B38E6] hover:text-white transition-colors"
                        >
                          <Users className="h-3 w-3" />
                          <span>{applicantCount} Siswa</span>
                        </Link>
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/umkm/projects/${project.id}`}
                            className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {project.status === "REVIEW"
                              ? "Review Hasil"
                              : "Lihat Pelamar"}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Global Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </motion.div>
  );
}
