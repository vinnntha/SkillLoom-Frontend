"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  UploadCloud,
  Link as LinkIcon,
  MessageSquare,
  Paperclip,
  Send,
  FileText,
  User,
  Building2,
  Check,
  AlertCircle,
  X,
  FileCheck,
  History,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  Copy,
  FolderGit2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  sender: "UMKM" | "Guru" | "Siswa";
  senderName: string;
  avatar: string;
  avatarBg: string;
  content: string;
  timestamp: string;
}

export default function WorkspaceDetailPage() {
  const { user } = useAuth();

  // Navigation / View state: "workspace" (Detail view) or "history" (Riwayat Workspace view)
  const [activeView, setActiveView] = useState<"workspace" | "history">("workspace");

  // History Filter & Search State
  const [historyFilter, setHistoryFilter] = useState<"ALL" | "APPROVED" | "IN_PROGRESS" | "REVIEW">("ALL");
  const [historySearch, setHistorySearch] = useState("");

  // Submission Form State
  const [submissionLink, setSubmissionLink] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Editing link mode for approved/completed projects
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null);

  // Applications from API
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppIndex, setSelectedAppIndex] = useState(0);
  const [isLoadingApps, setIsLoadingApps] = useState(true);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(2); // 1: Diterima, 2: Pengerjaan, 3: Review UMKM, 4: Selesai & Dibayar

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Revision & Submission Status state
  const [revisionInfo, setRevisionInfo] = useState<{
    status: string;
    note: string;
    submittedAt?: string;
  } | null>(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load applications from API (GET /applications/my-applications)
  useEffect(() => {
    async function loadMyApplications() {
      setIsLoadingApps(true);
      try {
        const data = await api.applications.getMyApplications();
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
        } else {
          try {
            const stored = localStorage.getItem("skillloom_registered_applications");
            const localApps = stored ? JSON.parse(stored) : [];
            setApplications(localApps);
          } catch (e) {
            setApplications([]);
          }
        }
      } catch (err) {
        console.warn("Failed to load applications from API:", err);
        setApplications([]);
      } finally {
        setIsLoadingApps(false);
      }
    }
    loadMyApplications();
  }, [user]);

  // Update dynamic chat, stepper & revision info whenever selected project changes
  useEffect(() => {
    if (applications.length > 0) {
      const active = applications[selectedAppIndex] || applications[0];
      const dynamicMsgs: Message[] = [];

      if (active.project?.description) {
        dynamicMsgs.push({
          id: `msg-project-${active.project.id || "1"}`,
          sender: "UMKM",
          senderName: `${active.project.umkm?.companyName || "UMKM Partner"}`,
          avatar: (active.project.umkm?.companyName || "U").substring(0, 2).toUpperCase(),
          avatarBg: "bg-amber-100 text-amber-800",
          content: `Halo! Instruksi proyek "${active.project.title}": ${active.project.description}`,
          timestamp: active.createdAt ? new Date(active.createdAt).toLocaleDateString("id-ID") : "Terbaru",
        });
      }

      if (active.pitchMessage) {
        dynamicMsgs.push({
          id: `msg-pitch-${active.id}`,
          sender: "Siswa",
          senderName: `${user?.name || "Anda"} (Siswa)`,
          avatar: (user?.name || "S").substring(0, 2).toUpperCase(),
          avatarBg: "bg-[#0B38E6] text-white",
          content: `Pesan Lamaran Saya: "${active.pitchMessage}"`,
          timestamp: active.createdAt ? new Date(active.createdAt).toLocaleDateString("id-ID") : "Terbaru",
        });
      }

      setMessages(dynamicMsgs);

      if (active.status === "ACCEPTED") {
        setCurrentStep(2);
      } else if (active.status === "PENDING") {
        setCurrentStep(1);
      } else if (active.status === "REJECTED") {
        setCurrentStep(1);
      }

      // Check localStorage for submission & revision status
      const appId = active.id;
      const projId = active.projectId || active.project?.id;
      try {
        const stored =
          localStorage.getItem(`skillloom_submission_${appId}`) ||
          (projId ? localStorage.getItem(`skillloom_submission_proj_${projId}`) : null) ||
          localStorage.getItem(`skillloom_latest_submission`);

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.applicationId === appId || parsed.projectId === projId || !parsed.applicationId) {
            setIsSubmitted(true);
            if (parsed.submissionLink) setSubmissionLink(parsed.submissionLink);
            setRevisionInfo({
              status: parsed.status || "UNDER_REVIEW",
              note: parsed.revisionNote || "",
              submittedAt: parsed.submittedAt,
            });

            if (parsed.status === "APPROVED") {
              setCurrentStep(4);
            } else {
              setCurrentStep(3);
            }
          }
        } else if (active.id === "app-lms-01") {
          // Default demo completed status for website LMS demo
          setIsSubmitted(true);
          setSubmissionLink("https://github.com/vokasi-siswa/website-lms-vokasi");
          setRevisionInfo({
            status: "APPROVED",
            note: "Pekerjaan sangat rapi dan sesuai instruksi brief UMKM!",
            submittedAt: "2026-08-09T12:00:00.000Z",
          });
          setCurrentStep(4);
        }
      } catch (e) {
        console.warn("Failed reading submission state:", e);
      }
    }
  }, [applications, selectedAppIndex, user]);

  // Listen for real-time submission & approval updates across tabs/actions
  useEffect(() => {
    const handleUpdate = () => {
      if (applications.length > 0) {
        const active = applications[selectedAppIndex] || applications[0];
        const appId = active.id;
        const projId = active.projectId || active.project?.id;
        try {
          const stored =
            localStorage.getItem(`skillloom_submission_${appId}`) ||
            (projId ? localStorage.getItem(`skillloom_submission_proj_${projId}`) : null) ||
            localStorage.getItem(`skillloom_latest_submission`);
          if (stored) {
            const parsed = JSON.parse(stored);
            setIsSubmitted(true);
            if (parsed.submissionLink) setSubmissionLink(parsed.submissionLink);
            setRevisionInfo({
              status: parsed.status || "UNDER_REVIEW",
              note: parsed.revisionNote || "",
              submittedAt: parsed.submittedAt,
            });

            if (parsed.status === "APPROVED") {
              setCurrentStep(4);
            } else {
              setCurrentStep(3);
            }
          }
        } catch (e) {}
      }
    };

    window.addEventListener("skillloom_submission_updated", handleUpdate);
    return () => window.removeEventListener("skillloom_submission_updated", handleUpdate);
  }, [applications, selectedAppIndex]);

  // Drag and Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit & Update Deliverable handler
  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink && attachedFiles.length === 0) {
      alert("Harap masukkan tautan karya atau unggah berkas!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setIsEditingLink(false);

      const activeApp = applications[selectedAppIndex] || applications[0];
      const appId = activeApp?.id || "default_app";
      const projId = activeApp?.projectId || activeApp?.project?.id || "default_proj";

      // Preserve status APPROVED if project was already approved
      const targetStatus = revisionInfo?.status === "APPROVED" ? "APPROVED" : "UNDER_REVIEW";

      if (targetStatus === "APPROVED") {
        setCurrentStep(4);
      } else {
        setCurrentStep(3);
      }

      const submissionPayload = {
        applicationId: appId,
        projectId: projId,
        studentName: user?.name || user?.siswaProfile?.fullName || "Siswa SkillLoom",
        jurusan: user?.siswaProfile?.jurusan || "RPL",
        submissionLink: submissionLink,
        attachedFiles: attachedFiles.map((f) => f.name),
        submittedAt: new Date().toISOString(),
        status: targetStatus,
        revisionNote: revisionInfo?.note || "",
      };

      try {
        api.applications.submitDeliverable(appId, { submissionLink }).catch((err) => {
          console.warn("Backend API submit endpoint fallback:", err);
        });
      } catch (e) {}

      try {
        localStorage.setItem(`skillloom_submission_${appId}`, JSON.stringify(submissionPayload));
        localStorage.setItem(`skillloom_submission_proj_${projId}`, JSON.stringify(submissionPayload));
        localStorage.setItem(`skillloom_latest_submission`, JSON.stringify(submissionPayload));
      } catch (err) {
        console.warn("Error saving submission to localStorage:", err);
      }

      setRevisionInfo({
        status: targetStatus,
        note: revisionInfo?.note || "",
        submittedAt: submissionPayload.submittedAt,
      });

      // Broadcast update event
      window.dispatchEvent(new Event("skillloom_submission_updated"));

      // Add message to chat about submission/update
      const botMessage: Message = {
        id: `msg-submit-${Date.now()}`,
        sender: "Siswa",
        senderName: `${user?.name || "Anda"} (Anda)`,
        avatar: (user?.name || "S").substring(0, 2).toUpperCase(),
        avatarBg: "bg-[#0B38E6] text-white",
        content: `Sistem: Tautan karya telah diperbarui ke: ${submissionLink}. ${attachedFiles.length > 0 ? `Berkas terlampir: ${attachedFiles.length}` : ""}`,
        timestamp: "Baru saja",
      };
      setMessages(prev => [...prev, botMessage]);

      setToastMessage("Tautan hasil karya berhasil diperbarui & disimpan!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1200);
  };

  // Copy link helper
  const handleCopyLink = (linkStr: string, id: string) => {
    if (!linkStr) return;
    navigator.clipboard.writeText(linkStr);
    setCopiedAppId(id);
    setTimeout(() => setCopiedAppId(null), 2500);
  };

  // Send Message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      sender: "Siswa",
      senderName: `${user?.name || "Anda"} (Anda)`,
      avatar: (user?.name || "S").substring(0, 2).toUpperCase(),
      avatarBg: "bg-[#0B38E6] text-white",
      content: newMessage.trim(),
      timestamp: "Baru saja"
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  // Open quick edit link for a specific app from History
  const handleQuickEditFromHistory = (index: number) => {
    setSelectedAppIndex(index);
    setActiveView("workspace");
    setIsEditingLink(true);
  };

  // Extract active application from API
  const activeApp = applications.length > 0 ? (applications[selectedAppIndex] || applications[0]) : null;
  const projectTitle = activeApp?.project?.title || "Proyek Vokasi";
  const umkmName = activeApp?.project?.umkm?.companyName || "UMKM Partner";
  const projectBudget = activeApp?.project?.budget
    ? `Rp ${Number(activeApp.project.budget).toLocaleString("id-ID")}`
    : "Rp 0";
  const projectDescription = activeApp?.project?.description ||
    "Belum ada deskripsi instruksi proyek.";
  const appStatus = activeApp?.status || "PENDING";

  if (isLoadingApps) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center text-slate-500 font-medium border border-slate-100 shadow-sm">
        Memuat data workspace dari backend...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">Belum Ada Proyek Aktif</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Anda belum melamar atau memiliki proyek berjalan. Silakan jelajahi daftar proyek pada menu Cari Proyek untuk mulai berkolaborasi.
        </p>
        <Link href="/siswa" className="inline-block bg-[#0B38E6] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md hover:bg-blue-700 transition-colors">
          Cari Proyek Sekarang
        </Link>
      </div>
    );
  }

  // Get submission helper for history listing
  const getAppSubmission = (app: any) => {
    const appId = app.id;
    const projId = app.projectId || app.project?.id;
    try {
      const stored =
        localStorage.getItem(`skillloom_submission_${appId}`) ||
        (projId ? localStorage.getItem(`skillloom_submission_proj_${projId}`) : null) ||
        (appId === "app-lms-01" ? localStorage.getItem(`skillloom_latest_submission`) : null);
      if (stored) return JSON.parse(stored);
    } catch {}

    if (appId === "app-lms-01") {
      return {
        submissionLink: "https://github.com/vokasi-siswa/website-lms-vokasi",
        submittedAt: "2026-08-09T12:00:00.000Z",
        status: "APPROVED",
        revisionNote: "Hasil karya disetujui",
      };
    }
    return null;
  };

  // Filter applications for History View
  const filteredHistoryApps = applications.filter((app) => {
    const sub = getAppSubmission(app);
    const titleMatch = app.project?.title?.toLowerCase().includes(historySearch.toLowerCase()) ||
      app.project?.umkm?.companyName?.toLowerCase().includes(historySearch.toLowerCase());

    if (!titleMatch) return false;

    if (historyFilter === "APPROVED") {
      return sub?.status === "APPROVED" || app.id === "app-lms-01";
    }
    if (historyFilter === "IN_PROGRESS") {
      return app.status === "ACCEPTED" && sub?.status !== "APPROVED";
    }
    if (historyFilter === "REVIEW") {
      return sub?.status === "UNDER_REVIEW";
    }
    return true;
  });

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
              <h5 className="font-bold text-sm">Update Berhasil</h5>
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

      {/* Top Header Bar & Navigation Menu */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {/* Navigation Row: Back Menu to Riwayat Workspace & Eksplorasi */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeView === "workspace" ? (
              <button
                onClick={() => setActiveView("history")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-[#0B38E6] hover:text-white transition-all text-xs font-bold shadow-sm cursor-pointer group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Riwayat Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView("workspace")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B38E6] text-white hover:bg-slate-900 transition-all text-xs font-bold shadow-sm cursor-pointer"
              >
                <FolderGit2 className="h-4 w-4 text-[#A1FF00]" />
                <span>Ke Detail Workspace Aktif</span>
              </button>
            )}

            <Link
              href="/siswa"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#0B38E6] transition-colors"
            >
              Eksplorasi Proyek
            </Link>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveView("workspace")}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeView === "workspace"
                  ? "bg-[#0B38E6] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Detail Proyek
            </button>
            <button
              onClick={() => setActiveView("history")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeView === "history"
                  ? "bg-[#0B38E6] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Riwayat Workspace ({applications.length})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Header Information depending on View Mode */}
        {activeView === "workspace" ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  {projectTitle}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    revisionInfo?.status === "APPROVED" || currentStep >= 4
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : appStatus === "ACCEPTED"
                      ? "bg-[#A1FF00] text-slate-900"
                      : appStatus === "REJECTED"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {revisionInfo?.status === "APPROVED" || currentStep >= 4
                    ? "✓ SELESAI & ACC"
                    : appStatus === "ACCEPTED"
                    ? "DITERIMA (IN PROGRESS)"
                    : appStatus === "REJECTED"
                    ? "DITOLAK"
                    : "MENUNGGU (PENDING)"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>{umkmName}</span>
                <span>•</span>
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Batas Waktu: 5 Hari Lagi</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0 self-start md:self-auto">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Nilai Proyek</span>
                <span className="text-[#0B38E6] font-black text-base">{projectBudget}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 pt-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <History className="h-6 w-6 text-[#0B38E6]" />
              Riwayat Workspace & Portofolio Karya
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Daftar seluruh proyek pengerjaan, riwayat proyek yang telah disetujui (ACC), serta kelola update tautan karya secara langsung.
            </p>
          </div>
        )}

        {/* Multi-Project Tabs Selector when in workspace view */}
        {activeView === "workspace" && applications.length > 1 && (
          <div className="pt-2 flex items-center gap-2 overflow-x-auto border-t border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Pilih Proyek:
            </span>
            {applications.map((app: any, idx: number) => {
              const isSelected = selectedAppIndex === idx;
              const sub = getAppSubmission(app);
              const isAcc = sub?.status === "APPROVED" || app.id === "app-lms-01";

              return (
                <button
                  key={app.id || idx}
                  onClick={() => {
                    setSelectedAppIndex(idx);
                    setIsEditingLink(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#0B38E6] text-white border-transparent shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                  }`}
                >
                  {isAcc && <CheckCircle2 className="h-3.5 w-3.5 text-[#A1FF00]" />}
                  <span>{app.project?.title || `Proyek ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RENDER VIEW MODE CONTENT */}
      {activeView === "history" ? (
        /* ================= HISTORY VIEW PAGE ================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0B38E6] flex items-center justify-center font-bold shrink-0">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Workspace</span>
                <h3 className="text-xl font-black text-slate-900">{applications.length} Proyek</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Selesai & ACC</span>
                <h3 className="text-xl font-black text-emerald-600">
                  {applications.filter((a) => getAppSubmission(a)?.status === "APPROVED" || a.id === "app-lms-01").length} Proyek
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Dalam Pengerjaan</span>
                <h3 className="text-xl font-black text-amber-600">
                  {applications.filter((a) => getAppSubmission(a)?.status !== "APPROVED" && a.id !== "app-lms-01").length} Proyek
                </h3>
              </div>
            </div>
          </div>

          {/* Search & Filter controls */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul proyek atau UMKM..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full text-xs py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] font-semibold"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setHistoryFilter("ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  historyFilter === "ALL"
                    ? "bg-[#0B38E6] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setHistoryFilter("APPROVED")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  historyFilter === "APPROVED"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                ✓ Selesai (ACC)
              </button>
              <button
                onClick={() => setHistoryFilter("IN_PROGRESS")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  historyFilter === "IN_PROGRESS"
                    ? "bg-[#0B38E6] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Pengerjaan
              </button>
            </div>
          </div>

          {/* History Projects Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHistoryApps.map((app, idx) => {
              const sub = getAppSubmission(app);
              const isAcc = sub?.status === "APPROVED" || app.id === "app-lms-01";
              const currentLink = sub?.submissionLink || (app.id === "app-lms-01" ? "https://github.com/vokasi-siswa/website-lms-vokasi" : "");

              return (
                <div
                  key={app.id || idx}
                  className={`bg-white rounded-3xl p-6 border shadow-sm transition-all hover:shadow-md flex flex-col justify-between space-y-5 ${
                    isAcc ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#0B38E6] uppercase tracking-wider block mb-1">
                          {app.project?.umkm?.companyName || "UMKM Partner"}
                        </span>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {app.project?.title || "Proyek Vokasi"}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">
                          Nilai Proyek: <span className="text-[#0B38E6] font-bold">Rp {Number(app.project?.budget || 0).toLocaleString("id-ID")}</span>
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shrink-0 ${
                          isAcc
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : app.status === "ACCEPTED"
                            ? "bg-blue-100 text-[#0B38E6]"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isAcc ? "✓ ACC & SELESAI" : app.status === "ACCEPTED" ? "DALAM PENGERJAAN" : "PENDING"}
                      </span>
                    </div>

                    {/* Submission Link Display Box */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-400">
                        <span>Tautan Hasil Karya:</span>
                        {isAcc && <span className="text-emerald-600 font-extrabold">✓ Terverifikasi</span>}
                      </div>

                      {currentLink ? (
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={currentLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-[#0B38E6] hover:underline truncate flex items-center gap-1.5"
                          >
                            <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{currentLink}</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>

                          <button
                            onClick={() => handleCopyLink(currentLink, app.id)}
                            className="text-[10px] font-bold text-slate-500 hover:text-[#0B38E6] shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
                          >
                            {copiedAppId === app.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ada link karya dikirim.</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        const originalIndex = applications.findIndex((a) => a.id === app.id);
                        setSelectedAppIndex(originalIndex >= 0 ? originalIndex : 0);
                        setActiveView("workspace");
                        setIsEditingLink(false);
                      }}
                      className="flex-1 bg-slate-900 hover:bg-[#0B38E6] text-white py-2.5 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
                    >
                      Buka Detail Workspace
                    </button>

                    <button
                      onClick={() => {
                        const originalIndex = applications.findIndex((a) => a.id === app.id);
                        handleQuickEditFromHistory(originalIndex >= 0 ? originalIndex : 0);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-[#0B38E6] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Update Link</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= WORKSPACE DETAIL VIEW PAGE ================= */
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* LEFT COLUMN (70%): Project Brief & Submission */}
          <div className="lg:col-span-7 space-y-6">

            {/* Card 1: Detail Proyek & Brief */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#0B38E6]" />
                  Brief Proyek & Instruksi Kerja
                </h2>
                <div className="h-1 w-12 bg-[#0B38E6] rounded-full mt-2"></div>
              </div>

              {/* Real Project Brief Content */}
              <div className="prose prose-slate max-w-none text-xs text-slate-700 space-y-4 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-800 leading-relaxed">
                  {projectDescription}
                </p>
              </div>

            </div>

            {/* Card 2: Form Pengiriman & Link Update (Deliverables Submission) */}
            <div className="bg-[#0B38E6]/5 border border-[#0B38E6]/10 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-[#0B38E6]" />
                    Kirim & Perbarui Hasil Pekerjaan
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kirim hasil kerjamu di sini. Anda dapat memperbarui link karya kapan saja.
                  </p>
                </div>

                {isSubmitted && !isEditingLink && (
                  <button
                    onClick={() => setIsEditingLink(true)}
                    className="flex items-center gap-1.5 bg-[#0B38E6] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Perbarui Link Karya</span>
                  </button>
                )}
              </div>

              {/* Revision Banner if Requested */}
              {revisionInfo?.status === "REVISION_REQUESTED" && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>Ada Catatan Revisi dari UMKM / Guru Pembimbing</span>
                    </div>
                    <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-black">
                      PERLU PERBAIKAN
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 italic font-medium pl-6 leading-relaxed">
                    "{revisionInfo.note || "Harap perbaiki hasil karya sesuai dengan instruksi briefing."}"
                  </p>
                  <p className="text-[10px] text-rose-500 font-semibold pl-6">
                    Silakan perbarui tautan karya atau unggah ulang file perbaikan di bawah ini.
                  </p>
                </div>
              )}

              {/* SUBMITTED STATE BANNER / FORM MODES */}
              {isSubmitted && !isEditingLink && revisionInfo?.status !== "REVISION_REQUESTED" ? (
                <div className="bg-white rounded-3xl p-6 border border-emerald-100 space-y-4 shadow-inner">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">
                        {revisionInfo?.status === "APPROVED"
                          ? "Proyek Selesai & Hasil Karya Disetujui!"
                          : "Hasil Karya Berhasil Dikirim!"}
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                        {revisionInfo?.status === "APPROVED"
                          ? "Selamat! Pekerjaan Anda telah disetujui oleh UMKM. Dana escrow segera dicairkan ke dompet Anda."
                          : "Pekerjaan Anda sedang dalam tahap review oleh pihak UMKM dan Guru Pembimbing. Anda dapat memperbarui tautan karya kapan saja di bawah ini."}
                      </p>
                    </div>
                  </div>

                  {/* Prominent Current Submission Link Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                      Tautan Karya Saat Ini:
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <a
                        href={submissionLink || "https://github.com/vokasi-siswa/website-lms-vokasi"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0B38E6] hover:underline flex items-center gap-1.5 truncate"
                      >
                        <LinkIcon className="h-4 w-4 shrink-0 text-[#0B38E6]" />
                        <span className="truncate">{submissionLink || "https://github.com/vokasi-siswa/website-lms-vokasi"}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#0B38E6]" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(submissionLink || "https://github.com/vokasi-siswa/website-lms-vokasi", activeApp?.id || "curr")}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:text-[#0B38E6] transition-colors shrink-0 shadow-sm cursor-pointer"
                      >
                        {copiedAppId === (activeApp?.id || "curr") ? "Copied!" : "Copy Link"}
                      </button>
                    </div>
                  </div>

                  {/* Actions for Update Link & Riwayat */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setIsEditingLink(true)}
                      className="px-5 py-2.5 bg-[#0B38E6] text-white rounded-2xl text-xs font-extrabold hover:bg-slate-950 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Perbarui Link Karya</span>
                    </button>

                    <button
                      onClick={() => setActiveView("history")}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>Lihat Riwayat Workspace</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* EDITING / INITIAL SUBMISSION FORM */
                <form onSubmit={handleSubmission} className="space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  {isEditingLink && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-2xl border border-blue-100 text-xs text-[#0B38E6] font-bold">
                      <span>Editing Tautan Hasil Karya:</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingLink(false)}
                        className="text-slate-400 hover:text-slate-700 text-[11px]"
                      >
                        Batal
                      </button>
                    </div>
                  )}

                  {/* Link Tautan Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Tautan Karya (GitHub/Figma/Drive)
                    </label>
                    <div className="relative flex items-center">
                      <LinkIcon className="absolute left-4 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/username/repo-name"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        className="w-full text-xs py-3.5 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#0B38E6] shadow-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* File Upload Zone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                      Upload Berkas Pendukung (Opsional)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-200/80 hover:border-[#0B38E6] bg-slate-50/50 rounded-2xl p-6 text-center transition-colors cursor-pointer relative group"
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="h-9 w-9 text-slate-400 mx-auto mb-2 group-hover:scale-105 transition-transform" />
                      <p className="text-xs font-bold text-slate-700">Tarik & lepas file di sini, atau cari berkas</p>
                      <p className="text-[10px] text-slate-400 mt-1">Mendukung format ZIP, PDF, PNG, JPG (Maks. 50MB)</p>
                    </div>

                    {/* Attached Files List */}
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">File Siap Dikirim:</span>
                        <div className="space-y-1.5">
                          {attachedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="h-4 w-4 text-[#0B38E6] shrink-0" />
                                <span className="font-semibold text-slate-700 truncate max-w-[200px]">{file.name}</span>
                                <span className="text-[10px] text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachedFile(idx)}
                                className="text-slate-400 hover:text-rose-500 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit / Update button */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-[#0B38E6] hover:bg-slate-950 text-white font-extrabold py-3.5 rounded-2xl text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#0B38E6]/10 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sedang menyimpan perubahan link...
                        </>
                      ) : (
                        <>{isEditingLink ? "Simpan Perubahan Link" : revisionInfo?.status === "REVISION_REQUESTED" ? "Kirim Ulang Hasil Revisi" : "Kirim Hasil Karya"}</>
                      )}
                    </button>

                    {isEditingLink && (
                      <button
                        type="button"
                        onClick={() => setIsEditingLink(false)}
                        className="px-5 py-3.5 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        Batal
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (30%): Timeline stepper & chat */}
          <div className="lg:col-span-3 space-y-6">

            {/* Card 3: Milestone / Timeline Stepper */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-sm text-slate-800 tracking-tight">Timeline Proyek</h3>
                <div className="h-0.5 w-8 bg-[#0B38E6] rounded-full mt-1.5"></div>
              </div>

              {/* Stepper items */}
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">

                {/* Step 1: Diterima */}
                <div className="flex gap-4 relative">
                  <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm relative z-10">
                    <Check className="h-4 w-4 font-bold" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800">Proyek Diterima</h4>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {activeApp?.createdAt ? `${new Date(activeApp.createdAt).toLocaleDateString("id-ID")} - Disetujui` : "Terverifikasi"}
                    </span>
                  </div>
                </div>

                {/* Step 2: Pengerjaan */}
                <div className="flex gap-4 relative">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-colors duration-300 ${
                    currentStep >= 3 || revisionInfo?.status === "APPROVED"
                      ? "bg-emerald-500 text-white"
                      : "bg-[#0B38E6] text-white"
                    }`}>
                    {currentStep >= 3 || revisionInfo?.status === "APPROVED" ? (
                      <Check className="h-4 w-4 font-bold" />
                    ) : (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1FF00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A1FF00]"></span>
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${currentStep === 2 ? "text-[#0B38E6]" : "text-slate-800"}`}>Pengerjaan Proyek</h4>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {user?.name || user?.siswaProfile?.fullName || "Siswa SkillLoom"} {user?.siswaProfile?.jurusan ? `(${user.siswaProfile.jurusan})` : ""}
                    </span>
                  </div>
                </div>

                {/* Step 3: Review UMKM */}
                <div className="flex gap-4 relative">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-all ${
                    revisionInfo?.status === "REVISION_REQUESTED"
                      ? "bg-rose-500 text-white"
                      : revisionInfo?.status === "APPROVED" || currentStep >= 4
                      ? "bg-emerald-500 text-white"
                      : currentStep >= 3
                      ? "bg-[#0B38E6] text-white animate-pulse"
                      : "bg-slate-50 text-slate-400 border border-slate-100"
                    }`}>
                    {revisionInfo?.status === "APPROVED" || currentStep >= 4 ? (
                      <Check className="h-4 w-4 font-bold" />
                    ) : revisionInfo?.status === "REVISION_REQUESTED" ? (
                      <AlertCircle className="h-4 w-4 font-bold" />
                    ) : (
                      <span className="text-xs font-bold">3</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${
                      revisionInfo?.status === "REVISION_REQUESTED"
                        ? "text-rose-600 font-extrabold"
                        : currentStep === 3
                        ? "text-[#0B38E6] font-extrabold"
                        : "text-slate-800"
                    }`}>
                      Review UMKM & Guru
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {revisionInfo?.status === "REVISION_REQUESTED" ? (
                        <span className="text-rose-600 font-bold block">
                          ⚠️ Perlu Revisi: "{revisionInfo.note || "Lihat catatan revisi"}"
                        </span>
                      ) : revisionInfo?.status === "APPROVED" ? (
                        <span className="text-emerald-600 font-bold block">
                          ✓ Hasil Karya Disetujui!
                        </span>
                      ) : isSubmitted ? (
                        <span className="text-[#0B38E6] font-bold block">
                          Menunggu Peninjauan Hasil
                        </span>
                      ) : (
                        "Menilai kesesuaian brief"
                      )}
                    </span>
                  </div>
                </div>

                {/* Step 4: Selesai */}
                <div className="flex gap-4 relative">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 ${
                    currentStep >= 4 || revisionInfo?.status === "APPROVED"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-400 border border-slate-100"
                  }`}>
                    {currentStep >= 4 || revisionInfo?.status === "APPROVED" ? (
                      <Check className="h-4 w-4 font-bold" />
                    ) : (
                      <span className="text-xs font-bold">4</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold ${
                      currentStep >= 4 || revisionInfo?.status === "APPROVED"
                        ? "text-emerald-700 font-extrabold"
                        : "text-slate-500"
                    }`}>
                      Selesai & Uang Saku Cair
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {currentStep >= 4 || revisionInfo?.status === "APPROVED"
                        ? "Dana Escrow telah ditransfer & Sertifikat rilis"
                        : "Tercatat di wallet & sertifikat"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Card 4: Catatan & Feedback (Mini Chat) */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col h-[400px]">
              <div className="mb-4">
                <h3 className="font-bold text-sm text-slate-800 tracking-tight flex items-center gap-1.5">
                  <MessageSquare className="h-4.5 w-4.5 text-[#0B38E6]" />
                  Diskusi & Revisi
                </h3>
                <div className="h-0.5 w-8 bg-[#0B38E6] rounded-full mt-1.5"></div>
              </div>

              {/* Chat message listing */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-100">
                {messages.map((msg) => {
                  const isSelf = msg.sender === "Siswa";
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`h-8 w-8 rounded-full ${msg.avatarBg} flex items-center justify-center font-bold text-[10px] shrink-0 shadow-sm`}>
                        {msg.avatar}
                      </div>
                      <div className="space-y-1 max-w-[80%]">
                        <div className={`flex items-center gap-1.5 ${isSelf ? "justify-end" : "justify-start"}`}>
                          <span className="text-[9px] font-bold text-slate-500">{msg.senderName}</span>
                          <span className="text-[8px] text-slate-400 font-semibold">{msg.timestamp}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${isSelf
                          ? "bg-[#0B38E6] text-white rounded-tr-none"
                          : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none"
                          }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Send Input Form */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Tulis pesan..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 text-xs px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] font-semibold"
                />
                <button
                  type="submit"
                  className="h-9 w-9 bg-[#0B38E6] hover:bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
