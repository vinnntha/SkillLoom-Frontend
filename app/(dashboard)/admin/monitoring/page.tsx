"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin";
import { StudentMonitoringItem } from "@/types/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Award,
  Wallet,
  XCircle,
  Layers,
  PhoneCall,
  FileText,
  ExternalLink,
  FileCheck,
} from "lucide-react";

export default function StudentMonitoringPage() {
  const [students, setStudents] = useState<StudentMonitoringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [selectedStudent, setSelectedStudent] = useState<StudentMonitoringItem | null>(null);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getStudentMonitoringList();
      setStudents(data || []);
    } catch (err: any) {
      console.error("Gagal memuat monitoring siswa:", err);
      setToast({
        isOpen: true,
        message: err.message || "Gagal mengambil data siswa dari backend.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }

  };


  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStudents();
  };

  const jurusanList = ["Semua", "RPL", "TKJ", "DKV", "Multimedia", "AKL"];

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm) ||
      s.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJurusan =
      selectedJurusan === "Semua" ||
      s.jurusan.toUpperCase() === selectedJurusan.toUpperCase();

    const matchesStatus =
      selectedStatus === "Semua" ||
      (selectedStatus === "Aktif" && s.status === "IN_PROGRESS") ||
      (selectedStatus === "Tuntas" && s.status === "COMPLETED");


    return matchesSearch && matchesJurusan && matchesStatus;
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
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-slate-900 text-white p-6 md:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B38E6]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A1FF00]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#A1FF00]">
              <GraduationCap className="h-4 w-4" />
              <span>Supervisi & Monitoring Siswa PKL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Monitoring Progres Talenta Siswa Vokasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Pantau jalannya penugasan proyek bounty UMKM, status pengerjaan, batas deadline, serta garansi pencairan escrow siswa.
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
            <span>Refresh Progres</span>
          </button>
        </div>
      </div>

      {/* COUNTER CARDS SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Total Siswa Terdaftar Proyek
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {students.length} Siswa
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
              100% Aktif Terikat Kontrak
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#0B38E6]/10 flex items-center justify-center text-[#0B38E6]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Proyek In-Progress
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {students.filter((s) => s.status === "IN_PROGRESS").length} Proyek
            </h3>
            <span className="text-[11px] text-amber-600 font-bold mt-1 block">
              Sedang Dikerjakan Siswa
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-[28px] bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">
              Proyek Tuntas
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1">
              {students.filter((s) => s.status === "COMPLETED").length} Selesai
            </h3>
            <span className="text-[11px] text-[#0B38E6] font-bold mt-1 block">
              Escrow Payout Verified
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa, NISN, proyek, atau UMKM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B38E6] transition-colors"
            />
          </div>

          {/* Jurusan Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 shrink-0">Jurusan:</span>
            {jurusanList.map((j) => (
              <button
                key={j}
                onClick={() => setSelectedJurusan(j)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedJurusan === j
                    ? "bg-[#0B38E6] text-white shadow-md shadow-[#0B38E6]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STUDENT GRID & LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-48 rounded-[32px] bg-slate-100 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-[32px] border border-dashed border-slate-200">
          <GraduationCap className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">
            Tidak Ada Siswa Ditemukan
          </h3>
          <p className="text-xs text-slate-500">
            Coba sesuaikan kata kunci pencarian atau filter jurusan Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredStudents.map((item) => (
            <div
              key={item.id}
              className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Top Header Card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-[#A1FF00] font-black text-sm shadow-md">
                    {item.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0B38E6] transition-colors">
                      {item.fullName}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>NISN: {item.nisn}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#0B38E6]/10 text-[#0B38E6] font-black text-[10px] uppercase">
                        {item.jurusan}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    item.status === "COMPLETED"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {item.status === "COMPLETED" ? "TUNTAS" : "IN-PROGRESS"}
                </span>
              </div>

              {/* Assigned Project Details */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  Proyek Yang Dikerjakan:
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {item.projectTitle}
                </h4>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-slate-600 font-semibold flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-[#0B38E6]" />
                    {item.companyName}
                  </span>
                  <span className="font-black text-[#0B38E6]">
                    {formatRupiah(item.budget)}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Escrow Status */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Deadline: {formatDate(item.deadline)}
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {item.paymentStatus === "RELEASED" ? "Dana Dicairkan" : "Escrow Tersimpan"}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === "COMPLETED" ? "bg-emerald-500 w-full" : "bg-[#0B38E6] w-3/4"
                    }`}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  Diajukan: {formatDate(item.appliedDate)}
                </span>
                <button
                  onClick={() => setSelectedStudent(item)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#0B38E6] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-[#A1FF00]" />
                  <span>Supervisi Detail</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STUDENT SUPERVISION DETAIL MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Laporan Supervisi Siswa
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {selectedStudent.fullName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">NISN Siswa:</span>
                  <span className="font-bold text-slate-800 text-xs">{selectedStudent.nisn}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">Jurusan Vokasi:</span>
                  <span className="font-black text-[#0B38E6] text-xs">{selectedStudent.jurusan}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Proyek & Mitra Industri:
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {selectedStudent.projectTitle}
                </h4>
                <p className="text-slate-600 text-xs">
                  Mitra: <strong>{selectedStudent.companyName}</strong> ({selectedStudent.industryType || "Industri"})
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-black">
                  <span>Nominal Bounty: {formatRupiah(selectedStudent.budget)}</span>
                  <span className="text-emerald-600">Status Escrow: {selectedStudent.paymentStatus}</span>
                </div>
              </div>

              {selectedStudent.pitchMessage && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Pesan Pitching Siswa ke UMKM:
                  </span>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{selectedStudent.pitchMessage}"
                  </p>
                </div>
              )}

              {/* SECTION: Preview Update Hasil Pekerjaan Siswa & Monitoring Revisi */}
              {(() => {
                let sub: any = null;
                try {
                  const stored =
                    localStorage.getItem(`skillloom_submission_${selectedStudent.id}`) ||
                    localStorage.getItem(`skillloom_latest_submission`);
                  if (stored) sub = JSON.parse(stored);
                } catch {}

                if (!sub) {
                  sub = {
                    submissionLink: "https://github.com/vokasi/project-demo",
                    attachedFiles: ["Dokumentasi_Karya.pdf", "Screenshot_UI.png"],
                    submittedAt: new Date().toISOString(),
                    status: selectedStudent.status === "COMPLETED" ? "APPROVED" : "UNDER_REVIEW",
                    revisionNote: "",
                  };
                }

                return (
                  <div className="p-4 rounded-2xl bg-[#0B38E6]/5 border border-[#0B38E6]/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#0B38E6] uppercase flex items-center gap-1">
                        <FileCheck className="h-3.5 w-3.5" />
                        Preview Update Hasil Karya Siswa
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          sub.status === "REVISION_REQUESTED"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : sub.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {sub.status === "REVISION_REQUESTED"
                          ? "PERLU REVISI"
                          : sub.status === "APPROVED"
                          ? "ACC / TUNTAS"
                          : "MENUNGGU REVIEW"}
                      </span>
                    </div>

                    <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block">Tautan Karya Siswa:</span>
                      <a
                        href={sub.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0B38E6] hover:underline flex items-center gap-1.5 break-all"
                      >
                        <span>{sub.submissionLink}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#0B38E6]" />
                      </a>
                    </div>

                    {sub.attachedFiles && sub.attachedFiles.length > 0 && (
                      <div className="text-[11px] text-slate-600 font-medium bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-500 block text-[10px]">Berkas Pendukung Terlampir:</span>
                        <span className="font-semibold text-slate-800">{sub.attachedFiles.join(", ")}</span>
                      </div>
                    )}

                    {sub.status === "REVISION_REQUESTED" && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-rose-800 uppercase block">
                          Catatan Revisi Saat Ini:
                        </span>
                        <p className="text-rose-700 italic font-medium leading-relaxed">
                          "{sub.revisionNote || "Harap sesuaikan karya dengan instruksi briefing."}"
                        </p>
                      </div>
                    )}

                    {/* Action Controls for Admin/Guru */}
                    <div className="pt-2 border-t border-slate-200/60 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Aksi Moderasi & Revisi Guru Pembimbing:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const note = prompt("Masukkan catatan revisi untuk siswa:", sub.revisionNote || "Tolong lengkapi dokumentasi & perbaiki penataan layout.");
                            if (note !== null) {
                              const updated = {
                                ...sub,
                                status: "REVISION_REQUESTED",
                                revisionNote: note,
                                updatedAt: new Date().toISOString(),
                              };
                              try {
                                adminService.updateRevisionStatus(selectedStudent.id, {
                                  reviewStatus: "REVISION_REQUESTED",
                                  revisionNote: note,
                                }).catch((err) => {
                                  console.warn("Backend API revision endpoint fallback:", err);
                                });
                              } catch (e) {}
                              try {
                                localStorage.setItem(`skillloom_submission_${selectedStudent.id}`, JSON.stringify(updated));
                                localStorage.setItem(`skillloom_latest_submission`, JSON.stringify(updated));
                              } catch (e) {}
                              setToast({
                                isOpen: true,
                                message: "Catatan revisi telah dikirim ke Siswa!",
                                type: "success",
                              });
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                        >
                          ⚠️ Minta Revisi
                        </button>
                        <button
                          onClick={() => {
                            const updated = {
                              ...sub,
                              status: "APPROVED",
                              updatedAt: new Date().toISOString(),
                            };
                            try {
                              adminService.updateRevisionStatus(selectedStudent.id, {
                                reviewStatus: "APPROVED",
                              }).catch((err) => {
                                console.warn("Backend API revision endpoint fallback:", err);
                              });
                            } catch (e) {}
                            try {
                              localStorage.setItem(`skillloom_submission_${selectedStudent.id}`, JSON.stringify(updated));
                              localStorage.setItem(`skillloom_latest_submission`, JSON.stringify(updated));
                            } catch (e) {}
                            setToast({
                              isOpen: true,
                              message: "Hasil karya siswa berhasil disetujui (ACC)!",
                              type: "success",
                            });
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition-colors cursor-pointer"
                        >
                          ✓ ACC Pekerjaan
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-[#0B38E6] text-white font-black text-xs cursor-pointer transition-colors"
              >
                Selesai Memeriksa
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
