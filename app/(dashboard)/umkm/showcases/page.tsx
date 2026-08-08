"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Star,
  PlusCircle,
  ExternalLink,
  Award,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { umkmApi } from "@/lib/api/umkm";
import { ShowcaseItem, ProjectItem } from "@/types/umkm";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function UmkmShowcasesPage() {
  const [showcases, setShowcases] = useState<ShowcaseItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
  );
  const [testimonial, setTestimonial] = useState(
    "Hasil pekerjaan siswa sangat memuaskan, responsif, dan siap pakai!"
  );
  const [rating, setRating] = useState(5);
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
      const [showcaseRes, projRes] = await Promise.allSettled([
        umkmApi.getShowcases(true),
        umkmApi.getMyProjects(),
      ]);

      if (showcaseRes.status === "fulfilled" && Array.isArray(showcaseRes.value)) {
        setShowcases(showcaseRes.value);
      }
      if (projRes.status === "fulfilled" && Array.isArray(projRes.value)) {
        setProjects(projRes.value);
        if (projRes.value.length > 0) {
          setProjectId(projRes.value[0].id);
          setTitle(projRes.value[0].title);
        }
      }
    } catch (err) {
      console.warn("Failed to load showcases:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !title.trim()) {
      setToast({
        isOpen: true,
        message: "Lengkapi data proyek dan judul showcase.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await umkmApi.createShowcase({
        projectId,
        title: title.trim(),
        imageUrl,
        testimonial,
        rating,
        isFeatured: true,
      });

      setToast({
        isOpen: true,
        message: "Showcase portofolio siswa berhasil dipublikasikan!",
        type: "success",
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal membuat showcase.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Showcase Portofolio Vokasi
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-[#A1FF00] text-slate-900">
              Karya Nyata Siswa
            </span>
          </h1>
          <p className="text-sm text-slate-500">
            Publikasikan hasil pekerjaan digital siswa SMK sebagai bukti portofolio industri.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-[#0B38E6]/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-[#A1FF00]" />
          Publikasikan Karya Baru
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#0B38E6] border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Memuat data portofolio...</p>
        </div>
      ) : showcases.length === 0 ? (
        <div className="bg-white rounded-[32px] p-12 text-center space-y-3 border border-slate-100">
          <Sparkles className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-slate-800 text-base">
            Belum Ada Showcase yang Dipublikasikan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Setelah proyek diselesaikan oleh siswa, bagikan hasilnya ke showcase publik untuk mendukung portofolio siswa vokasi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcases.map((sc) => (
            <motion.div
              key={sc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-[#0B38E6]/30 transition-all"
            >
              <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={sc.imageUrl}
                  alt={sc.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-[#A1FF00] flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{sc.rating || 5}.0</span>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-slate-500 italic line-clamp-3">
                    "{sc.testimonial || "Hasil pekerjaan memuaskan dan rapi."}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Featured Portfolio
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(sc.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Publish */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#0B38E6]" />
                  Publikasikan Showcase Portofolio
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Pilih Proyek:</label>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      const p = projects.find((x) => x.id === e.target.value);
                      if (p) setTitle(p.title);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Judul Karya / Aplikasi:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">URL Screenshot / Gambar:</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Testimoni untuk Siswa:</label>
                  <textarea
                    rows={3}
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-black px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    {isSubmitting ? "Menyimpan..." : "Publikasikan"}
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
