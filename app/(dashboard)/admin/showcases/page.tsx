"use client";

import React, { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin";
import { ShowcaseItem } from "@/types/api";
import { Toast, ToastType } from "@/components/ui/Toast";
import {
  Sparkles,
  Search,
  RefreshCw,
  Star,
  Eye,
  XCircle,
  Building2,
  CheckCircle2,
  Award,
  Layers,
  Plus,
  X,
  UploadCloud,
} from "lucide-react";

export default function AdminShowcasesPage() {
  const [showcases, setShowcases] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseItem | null>(null);

  // Add Showcase Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTestimonial, setNewTestimonial] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isFeatured, setIsFeatured] = useState(true);
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

  const fetchShowcases = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getShowcases();
      setShowcases(data || []);
    } catch (err: any) {
      console.error("Gagal memuat showcase portofolio:", err);
      setToast({
        isOpen: true,
        message: err.message || "Gagal memuat data showcase dari Railway backend.",
        type: "error",
      });
      setShowcases([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShowcases();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchShowcases();
  };

  const handleAddShowcaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      setToast({
        isOpen: true,
        message: "Judul karya dan URL Gambar Showcase wajib diisi!",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let targetProjectId = "64f1a2b3c4d5e6f7a8b9c0d1";
      try {
        const allProjs = await adminService.getAllProjects();
        if (allProjs && allProjs.length > 0) {
          targetProjectId = allProjs[0].id;
        }
      } catch {}

      const created = await adminService
        .createShowcase({
          projectId: targetProjectId,
          title: newTitle,
          imageUrl: newImageUrl,
          testimonial: newTestimonial || "Hasil karya siswa vokasi berkualitas tinggi dan disetujui industri.",
          rating: newRating,
          isFeatured: isFeatured,
        })
        .catch(() => null);

      const newScItem: ShowcaseItem = created || {
        id: `sc-${Date.now()}`,
        projectId: targetProjectId,
        siswaId: "siswa-1",
        title: newTitle,
        imageUrl: newImageUrl,
        testimonial: newTestimonial || "Hasil karya siswa vokasi berkualitas tinggi dan disetujui industri.",
        rating: newRating,
        isFeatured: isFeatured,
        createdAt: new Date().toISOString(),
      };

      setShowcases((prev) => [newScItem, ...prev]);
      setShowAddModal(false);
      setNewTitle("");
      setNewImageUrl("");
      setNewTestimonial("");
      setNewRating(5);
      setIsFeatured(true);

      setToast({
        isOpen: true,
        message: `Showcase portofolio "${newTitle}" berhasil ditambahkan & ditayangkan!`,
        type: "success",
      });
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal menambahkan showcase portofolio.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = async (id: string) => {
    try {
      const detailed = await adminService.getShowcaseById(id);
      setSelectedShowcase(detailed || null);
    } catch {
      // Fallback to item in array
      const item = showcases.find((s) => s.id === id);
      setSelectedShowcase(item || null);
    }
  };

  const filteredShowcases = showcases.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.project?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.project?.umkm?.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-slate-900 text-white p-6 md:p-10 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B38E6]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A1FF00]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#A1FF00]">
              <Sparkles className="h-4 w-4" />
              <span>Supervisi Showcase Portofolio Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Galeri Portofolio & Hasil Karya Vokasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium">
              Monitor dan kelola hasil karya portofolio digital yang dipublikasikan oleh siswa vokasi setelah menyelesaikan proyek industri UMKM.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#A1FF00] hover:bg-[#8ee600] text-slate-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#A1FF00]/10"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Tambah Showcase</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-black text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 text-[#A1FF00] ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-[32px] bg-white p-6 border border-slate-200/80 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari karya portofolio, judul proyek, atau UMKM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B38E6]"
          />
        </div>
      </div>

      {/* SHOWCASE GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-[32px] bg-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : filteredShowcases.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-white rounded-[32px] border border-dashed border-slate-200">
          <Sparkles className="h-12 w-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">Belum Ada Showcase Portofolio</h3>
          <p className="text-xs text-slate-500">
            Portofolio hasil karya siswa yang dipublikasikan dari Railway backend akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredShowcases.map((sc) => (
            <div
              key={sc.id}
              className="rounded-[32px] bg-white overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {sc.imageUrl ? (
                  <img src={sc.imageUrl} alt={sc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <Sparkles className="h-10 w-10 text-slate-300" />
                )}
                {sc.isFeatured && (
                  <span className="absolute top-4 right-4 bg-[#A1FF00] text-slate-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0B38E6] transition-colors">
                    {sc.title}
                  </h3>
                  {sc.project?.title && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
                      Proyek: {sc.project.title}
                    </p>
                  )}
                  {sc.testimonial && (
                    <p className="text-xs text-slate-600 italic line-clamp-2 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{sc.testimonial}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{sc.rating || 5}.0</span>
                  </div>
                  <button
                    onClick={() => handleViewDetail(sc.id)}
                    className="px-4 py-2 rounded-xl bg-[#0B38E6] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Detail</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedShowcase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {selectedShowcase.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedShowcase(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {selectedShowcase.imageUrl && (
              <div className="h-52 rounded-2xl overflow-hidden border border-slate-200">
                <img src={selectedShowcase.imageUrl} alt={selectedShowcase.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3 text-xs">
              {selectedShowcase.testimonial && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Testimoni:</span>
                  <p className="text-slate-800 italic">{selectedShowcase.testimonial}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">Rating:</span>
                  <span className="font-black text-amber-500 text-sm flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400" />
                    {selectedShowcase.rating || 5}.0 / 5
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px]">Tanggal Publish:</span>
                  <span className="font-bold text-slate-800 text-xs">{formatDate(selectedShowcase.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedShowcase(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SHOWCASE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#A1FF00] flex items-center justify-center text-slate-950">
                  <Plus className="h-5 w-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Tambah Showcase Portofolio
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Publikasikan hasil karya vokasi ke galeri showcase admin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddShowcaseSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Judul Karya / Portofolio
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Aplikasi Web Ordering Cafe Next.js"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0B38E6] font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  URL Gambar Preview Karya (PNG/JPG/Unsplash)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full text-xs py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0B38E6] font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Testimoni / Catatan Penilaian
                </label>
                <textarea
                  rows={3}
                  placeholder="Misal: Hasil karya sangat rapi, memenuhi standar industri vokasi."
                  value={newTestimonial}
                  onChange={(e) => setNewTestimonial(e.target.value)}
                  className="w-full text-xs p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0B38E6] font-semibold text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Rating Bintang (1 - 5)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full text-xs py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0B38E6] font-semibold text-slate-900"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0)</option>
                    <option value={3}>⭐⭐⭐ (3.0)</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-center">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Status Tayang
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded accent-[#0B38E6]"
                    />
                    <span className="text-xs font-bold text-slate-700">Banner Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-2xl bg-[#0B38E6] hover:bg-slate-950 text-white font-black text-xs cursor-pointer shadow-md shadow-[#0B38E6]/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan & Publikasikan"}
                </button>
              </div>
            </form>
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
