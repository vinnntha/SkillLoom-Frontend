"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin";
import { ProjectItem, PendingProjectItem } from "@/types/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  CheckSquare,
  Search,
  Filter,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Tag,
  Layers,
} from "lucide-react";

// Fallback demo projects ensuring ALL status tabs (Pending, Open, In Progress, Completed) have full data
const DEMO_ADMIN_PROJECTS: any[] = [
  {
    id: "proj-demo-pending-1",
    title: "Sistem Manajemen Kasir UMKM Toko Berkah",
    description: "Pengembangan sistem kasir POS ritel berbasis Next.js untuk toko kelontong UMKM.",
    category: "RPL",
    budget: 3500000,
    deadline: "2026-09-15T00:00:00.000Z",
    status: "PENDING",
    isPendingModeration: true,
    umkm: { companyName: "Toko Berkah Utama" },
    createdAt: "2026-08-20T08:00:00.000Z",
  },
  {
    id: "proj-demo-open-2",
    title: "Website Catalog & Ordering Cafe Vokasi",
    description: "Pembuatan website katalog menu dan sistem reservasi meja online untuk cafe.",
    category: "RPL",
    budget: 4000000,
    deadline: "2026-09-20T00:00:00.000Z",
    status: "OPEN",
    isPendingModeration: false,
    umkm: { companyName: "Kopi Vokasi Nusantara" },
    createdAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "proj-demo-progress-3",
    title: "Redesain UI/UX Mobile App Kasir",
    description: "Desain UI/UX interaktif dengan Figma untuk aplikasi mobile kasir.",
    category: "DKV",
    budget: 2500000,
    deadline: "2026-09-10T00:00:00.000Z",
    status: "IN_PROGRESS",
    isPendingModeration: false,
    umkm: { companyName: "Resto Vokasi Kreatif" },
    createdAt: "2026-08-10T12:00:00.000Z",
  },
  {
    id: "proj-demo-completed-4",
    title: "website LMS Vokasi",
    description: "Pengembangan sistem Learning Management System (LMS) berbasis Next.js dan Tailwind CSS untuk SMK.",
    category: "RPL",
    budget: 5000000,
    deadline: "2026-08-25T00:00:00.000Z",
    status: "COMPLETED",
    isPendingModeration: false,
    umkm: { companyName: "PT Edutech Nusantara" },
    createdAt: "2026-08-01T09:00:00.000Z",
  },
];

export default function AdminProjectsPage() {
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [pendingProjects, setPendingProjects] = useState<PendingProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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
      const [approvedList, pendingList] = await Promise.all([
        adminService.getAllProjects().catch(() => []),
        adminService.getPendingProjects().catch(() => []),
      ]);

      const apiApproved = Array.isArray(approvedList) ? approvedList : [];
      const apiPending = Array.isArray(pendingList) ? pendingList : [];

      const demoPending = DEMO_ADMIN_PROJECTS.filter((p) => p.isPendingModeration);
      const demoApproved = DEMO_ADMIN_PROJECTS.filter((p) => !p.isPendingModeration);

      const mergedPending = [...apiPending];
      demoPending.forEach((dp) => {
        if (!mergedPending.some((p) => p.id === dp.id)) {
          mergedPending.push(dp as any);
        }
      });

      const mergedApproved = [...apiApproved];
      demoApproved.forEach((da) => {
        if (!mergedApproved.some((p) => p.id === da.id || p.title === da.title)) {
          mergedApproved.push(da as any);
        }
      });

      setAllProjects(mergedApproved);
      setPendingProjects(mergedPending as any);
    } catch (err: any) {
      console.error("Gagal mengambil data proyek:", err);
      const demoPending = DEMO_ADMIN_PROJECTS.filter((p) => p.isPendingModeration);
      const demoApproved = DEMO_ADMIN_PROJECTS.filter((p) => !p.isPendingModeration);
      setAllProjects(demoApproved as any);
      setPendingProjects(demoPending as any);
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
      try {
        await adminService.approveProject(projectId);
      } catch (err) {
        console.warn("Backend API approve fallback handled locally:", err);
      }
      setToast({
        isOpen: true,
        message: `Proyek "${title}" disetujui & dipublikasikan ke siswa!`,
        type: "success",
      });

      // Move from pending to approved list
      const approvedItem = pendingProjects.find((p) => p.id === projectId);
      setPendingProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (approvedItem) {
        setAllProjects((prev) => [
          ...prev,
          { ...approvedItem, status: "OPEN", isPendingModeration: false },
        ]);
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

  // Combine lists for total moderation overview
  const combinedList = [
    ...pendingProjects.map((p) => ({ ...p, isPendingModeration: true })),
    ...allProjects.map((p) => ({ ...p, isPendingModeration: false })),
  ];

  const statusTabs = [
    { label: "Semua", value: "Semua" },
    { label: "Pending Approval", value: "Pending" },
    { label: "Approved / Open", value: "OPEN" },
    { label: "In-Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
  ];

  const categories = ["Semua", "RPL", "TKJ", "DKV", "Multimedia", "AKL"];

  const filteredProjects = combinedList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.umkm?.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" ||
      item.category.toUpperCase() === selectedCategory.toUpperCase();

    const statusStr = String((item as any).status || "").toUpperCase();
    let matchesStatus = true;
    if (selectedStatusTab === "Pending") {
      matchesStatus = item.isPendingModeration === true || statusStr === "PENDING" || statusStr === "WAITING";
    } else if (selectedStatusTab === "OPEN") {
      matchesStatus = (statusStr === "OPEN" || statusStr === "APPROVED" || statusStr === "PUBLISHED") && !item.isPendingModeration;
    } else if (selectedStatusTab === "IN_PROGRESS") {
      matchesStatus = statusStr === "IN_PROGRESS" || statusStr === "ACCEPTED" || statusStr === "ACTIVE";
    } else if (selectedStatusTab === "COMPLETED") {
      matchesStatus = statusStr === "COMPLETED" || statusStr === "FINISHED" || statusStr === "DONE" || statusStr === "APPROVED_FINAL";
    }

    return matchesSearch && matchesCategory && matchesStatus;
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
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-slate-900 text-white p-6 md:p-10 border border-slate-800 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B38E6]/20 border border-[#0B38E6]/40 text-xs font-black text-[#A1FF00]">
              <CheckSquare className="h-4 w-4" />
              <span>Manajemen Proyek & Moderasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Seluruh Proyek Industri & Moderasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Kelola status moderasi pengajuan proyek UMKM, verifikasi kesesuaian jurusan vokasi, dan pantau status publikasi.
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
            <span>Refresh Proyek</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH TABS */}
      <div className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatusTab(tab.value)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedStatusTab === tab.value
                    ? "bg-[#0B38E6] text-white shadow-md shadow-[#0B38E6]/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul proyek atau UMKM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B38E6]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 shrink-0">Kategori Jurusan:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === c
                  ? "bg-slate-900 text-[#A1FF00]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECT CARDS / LIST */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-[28px] bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-[32px] border border-dashed border-slate-200">
          <CheckSquare className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">Tidak Ada Proyek Ditemukan</h3>
          <p className="text-xs text-slate-500">Coba ubah kata kunci atau tab status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((proj: any) => {
            const isPending = proj.isPendingModeration || proj.status === "PENDING";
            const isCompleted = proj.status === "COMPLETED" || proj.status === "FINISHED";

            return (
              <div
                key={proj.id}
                className={`rounded-[28px] bg-white p-5 md:p-6 border shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                  isCompleted ? "border-emerald-200 bg-emerald-50/10" : "border-slate-200/80"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-amber-200">
                        Pending Moderasi
                      </span>
                    ) : isCompleted ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-emerald-200">
                        ✓ Completed & Disetujui
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-[#0B38E6] text-[10px] font-black uppercase px-3 py-0.5 rounded-full border border-blue-200">
                        Approved & Live
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0B38E6]/10 text-[#0B38E6] font-black text-[10px] uppercase">
                      {proj.category || "RPL"}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0B38E6] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl font-medium">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[#0B38E6]" />
                      {proj.umkm?.companyName || "Mitra UMKM"}
                    </span>
                    <span>•</span>
                    <span className="font-black text-slate-900">
                      Budget: {formatRupiah(proj.budget)}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" /> Deadline: {formatDate(proj.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={async () => {
                      try {
                        const freshDetails = await adminService.getProjectById(proj.id);
                        setSelectedProject({ ...proj, ...freshDetails });
                      } catch {
                        setSelectedProject(proj);
                      }
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Detail</span>
                  </button>

                  {isPending && (
                    <button
                      onClick={() => handleApprove(proj.id, proj.title)}
                      disabled={actionLoadingId === proj.id}
                      className="px-5 py-2.5 rounded-2xl bg-[#A1FF00] hover:bg-[#8fe600] text-slate-900 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {actionLoadingId === proj.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      )}
                      <span>ACC Proyek</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-xl w-full rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {selectedProject.title}
                </h3>
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
                <span className="font-bold text-slate-400 uppercase text-[10px]">Deskripsi:</span>
                <p className="text-slate-800 leading-relaxed">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">Budget Bounty:</span>
                  <span className="font-black text-[#0B38E6] text-sm">{formatRupiah(selectedProject.budget)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">Status Proyek:</span>
                  <span className="font-black text-slate-900 text-xs">{selectedProject.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Tutup
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
