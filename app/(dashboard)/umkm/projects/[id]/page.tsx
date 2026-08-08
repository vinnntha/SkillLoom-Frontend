"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Briefcase,
  Calendar,
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Send,
  Building2,
  FileCheck,
  AlertCircle,
  Star,
  Check,
} from "lucide-react";
import { umkmApi } from "@/lib/api/umkm";
import { ProjectItem, ApplicationItem, TransactionItem } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmProjectApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const resolvedParams = React.use(params as any) as { id: string };
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);

  // Escrow & Showcase Modal states
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [escrowProofUrl, setEscrowProofUrl] = useState(
    "https://storage.example.com/proofs/transfer_bukti.jpg"
  );
  const [showcaseTitle, setShowcaseTitle] = useState("");
  const [showcaseImage, setShowcaseImage] = useState(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  );
  const [showcaseTestimonial, setShowcaseTestimonial] = useState(
    "Hasil pekerjaan siswa sangat memuaskan, responsif, dan rapi!"
  );
  const [showcaseRating, setShowcaseRating] = useState(5);
  const [isShowcaseSubmitting, setIsShowcaseSubmitting] = useState(false);

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
      const [projData, appsData, txData] = await Promise.allSettled([
        umkmApi.getProjectById(projectId),
        umkmApi.getApplicantsByProject(projectId),
        umkmApi.getMyTransactions(),
      ]);

      if (projData.status === "fulfilled" && projData.value) {
        setProject(projData.value);
        setShowcaseTitle(projData.value.title);
      }

      if (appsData.status === "fulfilled" && Array.isArray(appsData.value)) {
        setApplications(appsData.value);
      }

      if (txData.status === "fulfilled" && Array.isArray(txData.value)) {
        setTransactions(txData.value);
      }
    } catch (err) {
      console.warn("Failed to load project details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  // Handle Accept or Reject applicant
  const handleUpdateStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    setProcessingAppId(applicationId);
    try {
      await umkmApi.updateApplicationStatus(applicationId, status);
      setToast({
        isOpen: true,
        message:
          status === "ACCEPTED"
            ? "Pelamar berhasil disetujui (ACCEPTED)! Silakan lanjutkan inisiasi dana escrow."
            : "Pelamar ditolak.",
        type: "success",
      });

      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );

      // If accepted, prompt escrow initiation if not done
      if (status === "ACCEPTED") {
        setIsEscrowModalOpen(true);
      }
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal mengubah status pelamar.",
        type: "error",
      });
    } finally {
      setProcessingAppId(null);
    }
  };

  // Handle Escrow Initiation
  const handleInitiateEscrow = async () => {
    if (!project) return;
    try {
      await umkmApi.initiateEscrow({
        projectId: project.id,
        amount: Number(project.budget || 1500000),
        paymentProof: escrowProofUrl,
      });

      setToast({
        isOpen: true,
        message: "Dana escrow berhasil diinisiasi & terkunci aman di sistem SkillLoom!",
        type: "success",
      });
      setIsEscrowModalOpen(false);
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal menginisiasi escrow.",
        type: "error",
      });
    }
  };

  // Handle Escrow Release
  const handleReleaseEscrow = async (txId: string) => {
    try {
      await umkmApi.releaseEscrow(txId);
      setToast({
        isOpen: true,
        message: "Dana berhasil dicairkan ke siswa! Terima kasih atas kolaborasi vokasi.",
        type: "success",
      });
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal mencairkan dana escrow.",
        type: "error",
      });
    }
  };

  // Handle Create Showcase
  const handleCreateShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setIsShowcaseSubmitting(true);
    try {
      await umkmApi.createShowcase({
        projectId: project.id,
        title: showcaseTitle,
        imageUrl: showcaseImage,
        testimonial: showcaseTestimonial,
        rating: showcaseRating,
        isFeatured: true,
      });

      setToast({
        isOpen: true,
        message: "Hasil proyek berhasil dipublikasikan ke Showcase Portofolio Siswa!",
        type: "success",
      });
      setIsShowcaseModalOpen(false);
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal mempublikasikan showcase.",
        type: "error",
      });
    } finally {
      setIsShowcaseSubmitting(false);
    }
  };

  const projectTx = transactions.find((t) => t.projectId === projectId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0B38E6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Proyek
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Escrow ID: {projectId.substring(0, 8)}...
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-9 w-9 rounded-full border-3 border-[#0B38E6] border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Memuat detail proyek & daftar pelamar...
          </p>
        </div>
      ) : !project ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Proyek Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">
            Data proyek ini mungkin telah dihapus atau tidak dapat diakses.
          </p>
          <Link
            href="/umkm"
            className="inline-block bg-[#0B38E6] text-white px-6 py-2.5 rounded-full text-xs font-bold"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      ) : (
        <>
          {/* ======================================================== */}
          {/* PROJECT HEADER CARD                                      */}
          {/* ======================================================== */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#0B38E6] text-[#A1FF00]">
                    {project.category}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    Status: {project.status}
                  </span>
                  {projectTx && (
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        projectTx.paymentStatus === "RELEASED"
                          ? "bg-emerald-100 text-emerald-800"
                          : projectTx.paymentStatus === "ESCROW_HELD"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-[#0B38E6]"
                      }`}
                    >
                      Escrow: {projectTx.paymentStatus}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {project.title}
                </h1>
              </div>

              {/* Quick Action Badges */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEscrowModalOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-[#A1FF00] font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4 text-[#A1FF00]" />
                  Inisiasi Escrow
                </button>
                <button
                  onClick={() => setIsShowcaseModalOpen(true)}
                  className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-slate-900" />
                  Showcase
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Deskripsi Tugas & Kebutuhan UMKM:
              </span>
              {project.description}
            </div>

            {/* Key Metrics Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Uang Saku
                </span>
                <span className="text-lg font-black text-[#0B38E6]">
                  Rp {Number(project.budget || 0).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Deadline
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Total Pelamar
                </span>
                <span className="text-lg font-black text-slate-900">
                  {applications.length} Siswa
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Garansi Escrow
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  SkillLoom Escrow
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* APPLICANT LIST (PELAMAR SISWA)                           */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Daftar Siswa yang Melamar
                  <span className="text-xs font-bold bg-[#0B38E6] text-white px-2.5 py-0.5 rounded-full">
                    {applications.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Review pitch pesan motivasi, keahlian vokasi, dan klik ACC untuk menerima siswa.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-[32px] p-12 text-center space-y-3 border border-slate-100">
                <Users className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="font-extrabold text-slate-800 text-base">
                  Belum Ada Pelamar untuk Proyek Ini
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Proyek Anda sudah aktif di katalog siswa. Pelamar akan muncul di sini begitu siswa mengirimkan pitch lamaran.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const studentName =
                    app.siswa?.fullName || app.siswa?.user?.email || "Siswa SMK Berprestasi";
                  const studentJurusan =
                    app.siswa?.jurusan || project.category || "Vokasi";
                  const studentInitials =
                    studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase() || "SW";

                  const isPending = app.status === "PENDING";
                  const isAccepted = app.status === "ACCEPTED";
                  const isRejected = app.status === "REJECTED";

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-[28px] p-6 shadow-sm border transition-all ${
                        isAccepted
                          ? "border-emerald-300 bg-emerald-50/10"
                          : isRejected
                          ? "border-slate-200 opacity-60"
                          : "border-slate-100 hover:border-[#0B38E6]/30"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Student Profile Overview */}
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#0B38E6]/20 shrink-0">
                            {studentInitials}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-base text-slate-900">
                                {studentName}
                              </h3>
                              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0B38E6]/10 text-[#0B38E6]">
                                Jurusan {studentJurusan}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400">
                              NISN: {app.siswa?.nisn || "Terverifikasi SMK"} • Dilamar pada:{" "}
                              {new Date(app.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>

                            {app.siswa?.bio && (
                              <p className="text-xs text-slate-600 italic">
                                "{app.siswa.bio}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Badge & Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                                disabled={processingAppId === app.id}
                                className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#A1FF00]/25 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
                              >
                                <Check className="h-4 w-4 stroke-[3]" />
                                ACC / Terima Siswa
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                disabled={processingAppId === app.id}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                              >
                                Tolak
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                Siswa Diterima (ACCEPTED)
                              </span>
                              {projectTx?.paymentStatus === "ESCROW_HELD" && (
                                <button
                                  onClick={() => handleReleaseEscrow(projectTx.id)}
                                  className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                                >
                                  Cairkan Dana
                                </button>
                              )}
                            </div>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
                              <XCircle className="h-4 w-4 text-slate-400" />
                              Lamaran Ditolak
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pitch Message Card */}
                      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 space-y-1">
                        <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px] block">
                          Pitch & Motivasi Siswa:
                        </span>
                        <p className="font-medium text-slate-700 leading-relaxed">
                          "{app.pitchMessage}"
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* MODAL: INISIASI PEMBAYARAN ESCROW                        */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isEscrowModalOpen && project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    Inisiasi Escrow SkillLoom
                  </h3>
                </div>
                <button
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <p>
                  Kunci dana proyek <strong>"{project.title}"</strong> sebesar:
                </p>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Nominal Escrow
                  </span>
                  <span className="text-2xl font-black text-[#0B38E6]">
                    Rp {Number(project.budget || 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Link Bukti Transfer / Pembayaran:
                  </label>
                  <input
                    type="text"
                    value={escrowProofUrl}
                    onChange={(e) => setEscrowProofUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleInitiateEscrow}
                  className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-[#A1FF00]/25 cursor-pointer"
                >
                  Kunci Dana Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* MODAL: PUBLISH SHOWCASE PORTOFOLIO                       */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isShowcaseModalOpen && project && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    Publikasikan Showcase Portofolio
                  </h3>
                </div>
                <button
                  onClick={() => setIsShowcaseModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateShowcase} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Judul Portofolio:
                  </label>
                  <input
                    type="text"
                    value={showcaseTitle}
                    onChange={(e) => setShowcaseTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    URL Gambar Hasil / Screenshot Karya:
                  </label>
                  <input
                    type="text"
                    value={showcaseImage}
                    onChange={(e) => setShowcaseImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Testimoni untuk Siswa:
                  </label>
                  <textarea
                    rows={3}
                    value={showcaseTestimonial}
                    onChange={(e) => setShowcaseTestimonial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Rating Kepuasan (1-5 Bintang):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setShowcaseRating(star)}
                        className={`p-1.5 rounded-lg ${
                          showcaseRating >= star ? "text-amber-400" : "text-slate-300"
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsShowcaseModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isShowcaseSubmitting}
                    className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    {isShowcaseSubmitting ? "Menyimpan..." : "Publikasikan Karya"}
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
