"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Check,
  Building2,
  Calendar,
} from "lucide-react";
import { umkmApi } from "@/lib/api/umkm";
import { ProjectItem, ApplicationItem } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmApplicantsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [allApplications, setAllApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("" );
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const loadAllApplicants = async () => {
    setIsLoading(true);
    try {
      const myProjs = await umkmApi.getMyProjects();
      setProjects(myProjs);

      const appsList: ApplicationItem[] = [];
      await Promise.all(
        myProjs.map(async (p) => {
          try {
            const apps = await umkmApi.getApplicantsByProject(p.id);
            if (Array.isArray(apps)) {
              apps.forEach((a) => {
                appsList.push({
                  ...a,
                  project: p,
                });
              });
            }
          } catch {
            if (Array.isArray(p.applications)) {
              p.applications.forEach((a) => {
                appsList.push({ ...a, project: p });
              });
            }
          }
        })
      );

      setAllApplications(appsList);
    } catch (err) {
      console.warn("Failed to load applicants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllApplicants();
  }, []);

  const handleUpdateStatus = async (
    applicationId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    setProcessingId(applicationId);
    try {
      await umkmApi.updateApplicationStatus(applicationId, status);
      setToast({
        isOpen: true,
        message:
          status === "ACCEPTED"
            ? "Pelamar berhasil disetujui (ACCEPTED)!"
            : "Pelamar ditolak.",
        type: "success",
      });

      setAllApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal mengubah status pelamar.",
        type: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApps = allApplications.filter((app) => {
    const studentName = app.siswa?.fullName || "";
    const projectTitle = app.project?.title || "";
    const pitch = app.pitchMessage || "";

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pitch.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "ALL") return matchesSearch;
    return matchesSearch && app.status === filterStatus;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Kelola Pelamar Siswa Vokasi
            <span className="text-xs font-bold bg-[#0B38E6] text-white px-3 py-1 rounded-full">
              {allApplications.length} Pelamar
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Daftar siswa SMK yang mengajukan pitch lamaran pada semua proyek aktif Anda.
          </p>
        </div>

        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm hover:text-[#0B38E6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Overview
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama siswa, proyek, atau pitch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0B38E6] focus:bg-white text-slate-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto justify-center">
          {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-[#0B38E6] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st === "ALL" ? "Semua" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-9 w-9 rounded-full border-3 border-[#0B38E6] border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Mengambil data seluruh pelamar...
          </p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center space-y-3 border border-slate-100">
          <Users className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">
            Tidak Ada Pelamar Ditemukan
          </h3>
          <p className="text-xs text-slate-500">
            Coba ganti filter status atau publikasikan proyek baru untuk menarik pelamar SMK.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredApps.map((app) => {
            const studentName =
              app.siswa?.fullName || app.siswa?.user?.email || "Siswa SMK";
            const studentJurusan =
              app.siswa?.jurusan || app.project?.category || "Vokasi";
            const isPending = app.status === "PENDING";
            const isAccepted = app.status === "ACCEPTED";
            const isRejected = app.status === "REJECTED";

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-[30px] p-6 shadow-sm border transition-all flex flex-col justify-between space-y-4 ${
                  isAccepted
                    ? "border-emerald-300 bg-emerald-50/15"
                    : isRejected
                    ? "border-slate-200 opacity-60"
                    : "border-slate-100 hover:border-[#0B38E6]/40"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#0B38E6]/10 text-[#0B38E6] inline-block mb-1">
                        {app.project?.title || "Proyek Digital"}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {studentName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Jurusan {studentJurusan} • NISN:{" "}
                        {app.siswa?.nisn || "Terverifikasi"}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isAccepted
                          ? "bg-emerald-100 text-emerald-800"
                          : isRejected
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Pitch Message */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Pitch Lamaran Siswa:
                    </span>
                    "{app.pitchMessage}"
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                          disabled={processingId === app.id}
                          className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 font-black text-xs px-3.5 py-2 rounded-xl shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          ACC Siswa
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                          disabled={processingId === app.id}
                          className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl"
                        >
                          Tolak
                        </button>
                      </>
                    )}

                    {isAccepted && (
                      <Link
                        href={`/umkm/projects/${app.projectId}`}
                        className="text-xs font-bold text-[#0B38E6] hover:underline"
                      >
                        Lihat Escrow & Detail →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
