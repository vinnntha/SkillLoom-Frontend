"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Clock, 
  MapPin, 
  Briefcase, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

// Types
interface Project {
  id: string;
  title: string;
  umkmName: string;
  timePosted: string;
  stipend: string;
  stipendRaw: number;
  deadline: string;
  tags: string[];
  jurusan: string;
  category: string;
  location: string;
  logoText: string;
  logoBg: string;
  description: string;
  requirements: string[];
}

export default function EksplorasiProyekPage() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJurusan, setSelectedJurusan] = useState("Semua");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // State for backend loaded projects
  const [apiProjects, setApiProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // State for active modal (Pitch/Lamar)
  const [activePitchProject, setActivePitchProject] = useState<Project | null>(null);
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);

  // Form State for application
  const [pitchText, setPitchText] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch Projects strictly from backend API (GET /projects)
  useEffect(() => {
    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const fetched = await api.projects.getAll({
          category: selectedCategory !== "Semua" ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });

        if (Array.isArray(fetched)) {
          const mapped: Project[] = fetched.map((item: any) => ({
            id: item.id || item._id,
            title: item.title,
            umkmName: item.umkm?.companyName || "UMKM Partner",
            timePosted: "Baru saja",
            stipend: `Rp ${Number(item.budget || 0).toLocaleString("id-ID")}`,
            stipendRaw: Number(item.budget || 0),
            deadline: item.deadline ? new Date(item.deadline).toLocaleDateString("id-ID") : "7 Hari",
            tags: [item.category || "General", "Vokasi"],
            jurusan: item.category || "RPL",
            category: item.category || "Web Development",
            location: item.umkm?.address || "Indonesia",
            logoText: (item.umkm?.companyName || "U").substring(0, 3).toUpperCase(),
            logoBg: "bg-blue-100 text-blue-800",
            description: item.description || "Deskripsi proyek.",
            requirements: ["Siswa Aktif SMK", "Komitmen Selesai Tepat Waktu"],
          }));
          setApiProjects(mapped);
        } else {
          setApiProjects([]);
        }
      } catch (err) {
        console.warn("Error loading projects from backend API (http://10.132.27.105:3001):", err);
        setApiProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    }

    loadProjects();
  }, [selectedCategory, searchQuery]);

  const projectsToDisplay = apiProjects;

  // Unique categories derived from projects
  const categories = ["Semua", "Web Development", "Desain Grafis", "Sosial Media", "RPL", "DKV"];
  const jurusans = ["Semua", "RPL", "DKV", "Pemasaran Digital"];

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projectsToDisplay.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.umkmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesJurusan = 
        selectedJurusan === "Semua" || project.jurusan === selectedJurusan;

      const matchesCategory = 
        selectedCategory === "Semua" || project.category === selectedCategory;

      return matchesSearch && matchesJurusan && matchesCategory;
    });
  }, [projectsToDisplay, searchQuery, selectedJurusan, selectedCategory]);

  // Handle pitching form submission (POSTMAN Endpoint: POST /applications)
  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchText) {
      alert("Harap isi pesan pitching Anda!");
      return;
    }
    if (!activePitchProject) return;

    setIsSubmitting(true);

    try {
      // POST /applications
      await api.applications.apply({
        projectId: activePitchProject.id,
        pitchMessage: pitchText,
      });

      setActivePitchProject(null);
      setPitchText("");
      setEstimatedDays("");
      setPortfolioLink("");

      setToastMessage("Lamaran berhasil dikirim! Silakan pantau status pengerjaan Anda di Workspace.");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err: any) {
      alert(err.message || "Gagal melamar proyek. Silakan pastikan Anda telah login sebagai Siswa.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 left-6 md:left-auto md:w-96 bg-slate-900 text-white p-4 rounded-2xl shadow-xl z-50 flex items-start gap-3 border border-slate-800"
          >
            <div className="h-9 w-9 rounded-xl bg-[#A1FF00] text-slate-950 flex items-center justify-center shrink-0">
              <Check className="h-5 w-5 font-bold" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-sm">Berhasil Mengirim Pitch!</h5>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-[#0B38E6] to-[#0A2EB0] text-white p-6 rounded-3xl relative overflow-hidden group shadow-lg shadow-[#0B38E6]/10">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Briefcase className="h-44 w-44" />
          </div>
          <div className="relative z-10 space-y-4">
            <span className="bg-white/20 text-[#A1FF00] font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm">
              Rekomendasi Proyek
            </span>
            <div>
              <h3 className="text-3xl font-black text-white">4 Proyek</h3>
              <p className="text-xs text-slate-200 mt-1 font-medium">Sesuai dengan keahlian RPL & Portofolio Anda</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#A1FF00] font-bold">
              <span>Mulai eksplorasi sekarang</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reward Terbuka</span>
            <h3 className="text-2xl font-black text-slate-800">Rp 4.000.000+</h3>
            <p className="text-[11px] text-slate-500 font-medium">Berdasarkan seluruh proyek aktif di dashboard</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Persaingan</span>
            <h3 className="text-2xl font-black text-slate-800">Rendah - Sedang</h3>
            <p className="text-[11px] text-slate-500 font-medium">Kesempatan emas untuk mengumpulkan portofolio</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#0B38E6]/5 text-[#0B38E6] flex items-center justify-center">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Header & Search Section */}
      <div className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cari Proyek UMKM</h1>
            <p className="text-sm text-slate-500 mt-1">
              Temukan tantangan nyata dari pelaku UMKM dan kembangkan portofolio profesionalmu.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-2.5 flex flex-col md:flex-row items-center gap-3 shadow-sm border border-slate-100 rounded-3xl">
          {/* Search Input */}
          <div className="relative flex-1 w-full flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Cari kata kunci (e.g. Landing page, Desain, Kopi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-slate-800 bg-transparent text-sm font-medium border-0 focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Filter Dropdown Jurusan */}
          <div className="w-full md:w-auto shrink-0 flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-2.5 md:pt-0 md:pl-3">
            <FilterIcon className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jurusan:</span>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="text-sm font-bold text-slate-700 bg-transparent border-none cursor-pointer focus:outline-none focus:ring-0 py-1"
            >
              {jurusans.map((jurusan) => (
                <option key={jurusan} value={jurusan}>
                  {jurusan === "Semua" ? "Semua Jurusan" : jurusan}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category / Tags (Horizontal Scroll) */}
      <div className="overflow-x-auto pb-2 scrollbar-none flex items-center gap-2.5">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#0B38E6] text-white shadow-md shadow-[#0B38E6]/25 scale-[1.02]"
                  : "bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Project Grid (Bounty Cards) */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-[#0B38E6]/20 relative flex flex-col h-full group"
            >
              {/* Top Section: UMKM Logo & Metadata */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-2xl ${project.logoBg} flex items-center justify-center font-black text-sm tracking-wider shrink-0 shadow-inner`}>
                    {project.logoText}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 tracking-tight group-hover:text-[#0B38E6] transition-colors">
                      {project.umkmName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{project.timePosted}</span>
                  </div>
                </div>

                {/* Jurusan Tag Badge */}
                <span className="bg-[#0B38E6]/5 text-[#0B38E6] text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                  {project.jurusan}
                </span>
              </div>

              {/* Title & Short Description */}
              <div className="space-y-2 mb-6">
                <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-[#0B38E6] transition-colors cursor-pointer" onClick={() => setActiveDetailProject(project)}>
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom Section (Pushed to bottom) */}
              <div className="mt-auto pt-4 border-t border-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Uang Saku / Stipend</span>
                    <span className="text-[#0B38E6] font-extrabold text-lg">{project.stipend}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{project.deadline}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveDetailProject(project)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 border border-slate-100"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => setActivePitchProject(project)}
                    className="bg-slate-950 text-white hover:bg-[#A1FF00] hover:text-slate-950 px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Lamar Proyek
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-4">
          <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-extrabold text-slate-800 text-lg">Proyek Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tidak ada proyek aktif yang cocok dengan kata kunci "{searchQuery}" atau filter jurusan yang Anda pilih. Coba bersihkan filter pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedJurusan("Semua");
                setSelectedCategory("Semua");
              }}
              className="mt-2 text-xs font-extrabold text-[#0B38E6] bg-[#0B38E6]/5 px-4 py-2 rounded-xl hover:bg-[#0B38E6]/10 transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeDetailProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 border border-slate-100 flex flex-col relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDetailProject(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Top Metadata */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-12 w-12 rounded-2xl ${activeDetailProject.logoBg} flex items-center justify-center font-black text-sm tracking-wide shrink-0 shadow-inner`}>
                  {activeDetailProject.logoText}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">{activeDetailProject.umkmName}</h4>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5 font-semibold">
                    <MapPin className="h-3 w-3" />
                    <span>{activeDetailProject.location}</span>
                    <span>•</span>
                    <span>{activeDetailProject.timePosted}</span>
                  </div>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="space-y-3 mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#0B38E6] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {activeDetailProject.jurusan}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {activeDetailProject.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
                  {activeDetailProject.title}
                </h2>
              </div>

              {/* Description */}
              <div className="space-y-4 border-t border-slate-100 pt-5 mb-6">
                <div>
                  <h5 className="font-bold text-sm text-slate-900 mb-2">Deskripsi Pekerjaan</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeDetailProject.description}
                  </p>
                </div>

                <div>
                  <h5 className="font-bold text-sm text-slate-900 mb-2">Kualifikasi / Persyaratan</h5>
                  <ul className="space-y-2">
                    {activeDetailProject.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Stipend & Time Matrix */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Uang Saku/Stipend</span>
                  <span className="text-[#0B38E6] font-black text-xl">{activeDetailProject.stipend}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Metode Escrow Terjamin</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Batas Waktu Kerja</span>
                  <span className="text-slate-800 font-black text-xl flex items-center gap-1.5">
                    <Clock className="h-5 w-5 text-slate-500" />
                    {activeDetailProject.deadline}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Dihitung sejak proposal disetujui</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 mt-auto border-t border-slate-100 pt-5">
                <button
                  onClick={() => setActiveDetailProject(null)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl text-xs text-center border border-slate-100 transition-colors"
                >
                  Tutup Detail
                </button>
                <button
                  onClick={() => {
                    const proj = activeDetailProject;
                    setActiveDetailProject(null);
                    setActivePitchProject(proj);
                  }}
                  className="flex-1 bg-slate-950 text-white hover:bg-[#A1FF00] hover:text-slate-950 font-bold py-3 rounded-xl text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10"
                >
                  Lamar Proyek Ini
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lamar Proyek / Pitching Modal */}
      <AnimatePresence>
        {activePitchProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 border border-slate-100 flex flex-col relative"
            >
              {/* Close button */}
              <button
                onClick={() => setActivePitchProject(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-[#0B38E6] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Pitching Modul
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">Kirim proposal Anda ke UMKM</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                  Lamar: {activePitchProject.title}
                </h3>
                <div className="p-3 bg-[#0B38E6]/5 border border-[#0B38E6]/10 rounded-xl flex items-start gap-2.5">
                  <AlertCircle className="h-4.5 w-4.5 text-[#0B38E6] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    Sajikan pitching menarik, portofolio relevan, dan jangka waktu yang realistis untuk memperbesar peluang diterima oleh <span className="font-bold text-slate-800">{activePitchProject.umkmName}</span>.
                  </p>
                </div>
              </div>

              {/* Pitch Form */}
              <form onSubmit={handlePitchSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Pitch Message / Pesan Pendahuluan
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Contoh: Halo! Saya siswa SMK spesialis di bidang ini. Saya memiliki keterampilan yang sesuai dengan kriteria proyek ini dan berkomitmen menyelesaikan pekerjaan secara profesional..."
                    value={pitchText}
                    onChange={(e) => setPitchText(e.target.value)}
                    className="w-full text-xs p-3.5 text-slate-850 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all resize-none placeholder-slate-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Estimasi Pengerjaan
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 5"
                        value={estimatedDays}
                        onChange={(e) => setEstimatedDays(e.target.value)}
                        className="w-full text-xs p-3 text-slate-850 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all placeholder-slate-400 font-semibold"
                      />
                      <span className="absolute right-3 text-xs font-bold text-slate-400">Hari</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Stipend Ditawarkan
                    </label>
                    <div className="w-full text-xs p-3 text-slate-500 bg-slate-100 border border-slate-200/50 rounded-xl font-bold flex items-center">
                      {activePitchProject.stipend}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Link Hasil Karya / Portofolio Terkait
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://github.com/username/project-kopi"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full text-xs p-3 text-slate-850 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white transition-all placeholder-slate-400 font-semibold"
                    />
                    <ExternalLink className="absolute right-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Modal actions */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setActivePitchProject(null)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl text-xs text-center border border-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-slate-950 text-white hover:bg-[#A1FF00] hover:text-slate-950 font-bold py-3 rounded-xl text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white hover:text-slate-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim...
                      </>
                    ) : (
                      <>Kirim Lamaran</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
