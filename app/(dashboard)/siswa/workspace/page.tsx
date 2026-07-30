"use client";

import React, { useState } from "react";
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
  FileCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  // Submission Form State
  const [submissionLink, setSubmissionLink] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Stepper State
  const [currentStep, setCurrentStep] = useState(2); // 1: Diterima, 2: Pengerjaan, 3: Review UMKM, 4: Selesai & Dibayar

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "UMKM",
      senderName: "Budi (Kedai Kopi Senja)",
      avatar: "KS",
      avatarBg: "bg-amber-100 text-amber-800",
      content: "Halo Arya, terima kasih sudah menerima proyek ini. Untuk warna utama mohon diselaraskan dengan warna brand kami ya (nuansa warm coklat & krem). Aset gambar kopi beresolusi tinggi sudah saya lampirkan di file brief.",
      timestamp: "Kemarin, 14:20"
    },
    {
      id: "msg-2",
      sender: "Guru",
      senderName: "Bu Endah (Pembimbing)",
      avatar: "BE",
      avatarBg: "bg-indigo-100 text-indigo-800",
      content: "Arya, pastikan kode Next.js kamu clean dan strukturnya rapi sesuai standar industri yang dipelajari di kelas. Jangan lupa lakukan kompresi gambar agar performa landing page optimal.",
      timestamp: "Kemarin, 16:45"
    },
    {
      id: "msg-3",
      sender: "Siswa",
      senderName: "Arya Maulana (Anda)",
      avatar: "AM",
      avatarBg: "bg-[#0B38E6] text-white",
      content: "Baik Pak Budi & Bu Endah, saya sedang mengimplementasikan desain di Tailwind CSS. Optimasi gambar akan saya prioritaskan menggunakan komponen next/image.",
      timestamp: "Hari ini, 09:15"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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

  // Submit Deliverable handler
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
      setCurrentStep(3); // Advance stepper to "Review UMKM"
      
      // Add message to chat about submission
      const botMessage: Message = {
        id: `msg-submit-${Date.now()}`,
        sender: "Siswa",
        senderName: "Arya Maulana (Anda)",
        avatar: "AM",
        avatarBg: "bg-[#0B38E6] text-white",
        content: `Sistem: Hasil karya telah dikirimkan. Tautan: ${submissionLink}. Jumlah berkas terlampir: ${attachedFiles.length}`,
        timestamp: "Baru saja"
      };
      setMessages(prev => [...prev, botMessage]);

      setToastMessage("Hasil karya berhasil dikirim ke UMKM & Guru Pembimbing!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }, 1800);
  };

  // Send Message handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: `msg-${Date.now()}`,
      sender: "Siswa",
      senderName: "Arya Maulana (Anda)",
      avatar: "AM",
      avatarBg: "bg-[#0B38E6] text-white",
      content: newMessage.trim(),
      timestamp: "Baru saja"
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage("");

    // Optional: Simulate automated prompt from UMKM for interactive feel
    setTimeout(() => {
      const reply: Message = {
        id: `msg-reply-${Date.now()}`,
        sender: "UMKM",
        senderName: "Budi (Kedai Kopi Senja)",
        avatar: "KS",
        avatarBg: "bg-amber-100 text-amber-800",
        content: "Terima kasih atas update-nya, Arya! Saya akan segera meninjau progressnya.",
        timestamp: "Baru saja"
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
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
              <h5 className="font-bold text-sm">Pengiriman Berhasil</h5>
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

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <Link href="/siswa" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#0B38E6] transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Eksplorasi Proyek
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Pembuatan Landing Page Menu Kopi
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              currentStep === 2 
                ? "bg-[#A1FF00] text-slate-900 animate-pulse" 
                : "bg-amber-100 text-amber-800"
            }`}>
              {currentStep === 2 ? "In Progress" : "Dalam Review"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>Kedai Kopi Senja</span>
            <span>•</span>
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Batas Waktu: 5 Hari Lagi</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0 self-start md:self-auto">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Nilai Proyek</span>
            <span className="text-[#0B38E6] font-black text-base">Rp 750.000</span>
          </div>
        </div>
      </div>

      {/* 2-Column Grid Layout */}
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

            {/* Markdown-style content */}
            <div className="prose prose-slate max-w-none text-xs text-slate-655 space-y-4 leading-relaxed">
              <p>
                Kedai Kopi Senja sedang mengembangkan menu kopi artisan baru. Kami mencari siswa vokasi jurusan Rekayasa Perangkat Lunak untuk membuat landing page promo satu halaman yang interaktif, responsif, dan teroptimasi SEO.
              </p>
              
              <h4 className="font-bold text-slate-900 text-sm mt-4">📋 Target Output Halaman:</h4>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li>Header dengan logo Kedai Kopi Senja & Menu Navigasi simpel.</li>
                <li>Hero Section interaktif (dengan foto produk andalan & tombol CTA "Pesan Sekarang").</li>
                <li>Daftar Menu Kopi Artisan (3 Menu Utama dengan deskripsi, harga, dan rating).</li>
                <li>Formulir Pemesanan cepat terintegrasi (menghasilkan string chat WhatsApp UMKM).</li>
                <li>Footer berisikan jam operasional, alamat maps, dan tautan sosial media.</li>
              </ul>

              <h4 className="font-bold text-slate-900 text-sm mt-4">🎨 Panduan Desain:</h4>
              <p>
                Gunakan tone warna hangat seperti cokelat tua, krem, dan aksen putih gading. Desain harus memancarkan vibes yang cozy, modern, dan minimalis. Anda diperbolehkan menggunakan framework React/Next.js dengan styling Tailwind CSS.
              </p>
            </div>

            {/* Attached Files Section */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Berkas Brief Terlampir:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("Mengunduh aset_gambar_kopi.zip..."); }}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                      <Paperclip className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-700 truncate max-w-[180px]">aset_gambar_kopi.zip</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">14.2 MB • ZIP Archive</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#0B38E6] group-hover:underline">Download</span>
                </a>

                <a 
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("Membuka design_figma_wireframe.fig..."); }}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-700 truncate max-w-[180px]">design_figma_wireframe</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">Figma Canvas Link</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#0B38E6] group-hover:underline">Buka</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Form Pengiriman (Deliverables Submission) */}
          <div className="bg-[#0B38E6]/5 border border-[#0B38E6]/10 rounded-[32px] p-8 space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#0B38E6]" />
                Kirim Hasil Pekerjaan
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Kirim hasil kerjamu di sini. Guru Pembimbing dan UMKM akan meninjau sebelum dana dicairkan.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-white rounded-2xl p-6 border border-emerald-100 text-center space-y-3 shadow-inner">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Hasil Karya Berhasil Dikirim!</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Pekerjaan Anda sedang dalam tahap review oleh pihak UMKM dan Guru Pembimbing. Anda akan mendapatkan notifikasi jika ada perbaikan.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-[#0B38E6] hover:underline"
                >
                  Kirim Ulang / Perbarui Link
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmission} className="space-y-5">
                {/* Link Tautan */}
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
                      className="w-full text-xs py-3.5 pl-11 pr-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-[#0B38E6] shadow-sm font-semibold"
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
                    className="border-2 border-dashed border-slate-200/80 hover:border-[#0B38E6] bg-white rounded-2xl p-6 text-center transition-colors cursor-pointer relative group"
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
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
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

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0B38E6] hover:bg-slate-950 text-white font-extrabold py-3.5 rounded-2xl text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#0B38E6]/10 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sedang mengirimkan hasil karya...
                    </>
                  ) : (
                    <>Kirim Hasil Karya</>
                  )}
                </button>
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
                  <span className="text-[10px] text-slate-400 block font-semibold">25 Juli 2026 - Disetujui Guru</span>
                </div>
              </div>

              {/* Step 2: Pengerjaan */}
              <div className="flex gap-4 relative">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-colors duration-300 ${
                  currentStep >= 3 
                    ? "bg-emerald-500 text-white" 
                    : "bg-[#0B38E6] text-white"
                }`}>
                  {currentStep >= 3 ? (
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
                  <span className="text-[10px] text-slate-400 block font-semibold">Arya Maulana (RPL)</span>
                </div>
              </div>

              {/* Step 3: Review UMKM */}
              <div className="flex gap-4 relative">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 shadow-sm relative z-10 transition-all ${
                  currentStep >= 3 
                    ? "bg-[#0B38E6] text-white animate-pulse" 
                    : "bg-slate-50 text-slate-400 border border-slate-100"
                }`}>
                  <span className="text-xs font-bold">3</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${currentStep === 3 ? "text-[#0B38E6] font-extrabold" : "text-slate-500"}`}>Review UMKM & Guru</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold">Menilai kesesuaian brief</span>
                </div>
              </div>

              {/* Step 4: Selesai */}
              <div className="flex gap-4 relative">
                <div className="h-7 w-7 rounded-full bg-slate-50 text-slate-400 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative z-10">
                  <span className="text-xs font-bold">4</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-500">Selesai & Uang Saku Cair</h4>
                  <span className="text-[10px] text-slate-400 block font-semibold">Tercatat di wallet & sertifikat</span>
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
                      <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                        isSelf 
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
    </div>
  );
}
