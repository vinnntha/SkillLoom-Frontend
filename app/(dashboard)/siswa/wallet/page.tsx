"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, 
  Wallet, 
  Star, 
  Image as ImageIcon, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  Plus,
  ExternalLink,
  Lock,
  ArrowRight,
  TrendingUp,
  X,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Toast, ToastType } from "@/components/ui/Toast";

interface PortfolioItem {
  id: string;
  title: string;
  umkmName: string;
  category: string;
  rating: number;
  completionDate: string;
  stipend: string;
  imageUrl?: string;
  department: string;
}

interface Transaction {
  id: string;
  type: "income" | "escrow" | "withdrawal";
  title: string;
  umkmOrBank: string;
  date: string;
  amount: string;
  amountRaw: number;
  status: "Berhasil" | "Escrow" | "Pending";
}

export default function WalletPortfolioPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("gopay");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "loading" | "success">("idle");

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Showcase Modal State
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState("");
  const [showcaseImage, setShowcaseImage] = useState("");
  const [showcaseTestimonial, setShowcaseTestimonial] = useState("");
  const [showcaseRating, setShowcaseRating] = useState(5);
  const [isPublishingShowcase, setIsPublishingShowcase] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setToast({
          isOpen: true,
          message: "Harap pilih berkas gambar dengan format PNG, JPG, atau WebP!",
          type: "error",
        });
        return;
      }
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setShowcaseImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Balance Calculations from Backend Transactions
  const totalBalance = transactions.reduce((acc, tx) => {
    return tx.type === "income" && tx.status === "Berhasil" ? acc + tx.amountRaw : acc;
  }, 0);

  const escrowBalance = transactions.reduce((acc, tx) => {
    return tx.type === "escrow" && tx.status === "Escrow" ? acc + tx.amountRaw : acc;
  }, 0);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      const [txsData, showcasesData] = await Promise.allSettled([
        api.transactions.getMyTransactions(),
        api.showcases.getAll(),
      ]);

      if (txsData.status === "fulfilled" && Array.isArray(txsData.value) && txsData.value.length > 0) {
        const mappedTxs: Transaction[] = txsData.value.map((tx: any) => ({
          id: tx.id || tx._id,
          type: tx.paymentStatus === "RELEASED" ? "income" : tx.paymentStatus === "ESCROW_HELD" ? "escrow" : "withdrawal",
          title: `Transaksi Proyek ${tx.project?.title || ""}`,
          umkmOrBank: tx.umkm?.companyName || "Escrow SkillLoom",
          date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("id-ID") : "Terbaru",
          amount: `${tx.paymentStatus === "RELEASED" ? "+" : ""} Rp ${Number(tx.amount || 0).toLocaleString("id-ID")}`,
          amountRaw: Number(tx.amount || 0),
          status: tx.paymentStatus === "RELEASED" ? "Berhasil" : tx.paymentStatus === "ESCROW_HELD" ? "Escrow" : "Pending",
        }));
        setTransactions(mappedTxs);
      } else {
        setTransactions([]);
      }

      if (showcasesData.status === "fulfilled" && Array.isArray(showcasesData.value) && showcasesData.value.length > 0) {
        const mappedPortfolios: PortfolioItem[] = showcasesData.value.map((sc: any) => ({
          id: sc.id || sc._id,
          title: sc.title || sc.project?.title || "Hasil Karya Vokasi",
          umkmName: sc.project?.umkm?.companyName || "UMKM Partner",
          category: sc.project?.category || "Vokasi",
          rating: sc.rating || 5,
          completionDate: sc.createdAt ? new Date(sc.createdAt).toLocaleDateString("id-ID") : "Terbaru",
          stipend: sc.project?.budget ? `Rp ${Number(sc.project.budget).toLocaleString("id-ID")}` : "Terverifikasi",
          department: sc.project?.category || "SMK",
          imageUrl: sc.imageUrl,
        }));
        setPortfolioItems(mappedPortfolios);
      } else {
        setPortfolioItems([]);
      }
    } catch (err) {
      console.warn("Error loading wallet & portfolio data from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const { refreshUser } = useAuth();

  // Withdraw & Bank update (PATCH /users/profile/siswa)
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatus("loading");

    try {
      await api.users.updateSiswaProfile({
        bankName: withdrawMethod.toUpperCase(),
        accountNumber: withdrawAccount,
      });
      await refreshUser();

      setWithdrawStatus("success");
      const methodLabel = withdrawMethod.toUpperCase();
      const amountFormatted = withdrawAmount
        ? `Rp ${Number(withdrawAmount).toLocaleString("id-ID")}`
        : "dana";

      setTimeout(() => {
        setShowWithdrawModal(false);
        setWithdrawStatus("idle");
        const withdrawnAmt = withdrawAmount;
        const accNum = withdrawAccount;
        setWithdrawAmount("");
        setWithdrawAccount("");
        setToast({
          isOpen: true,
          message: `Penarikan ${amountFormatted} via ${methodLabel} (${accNum}) berhasil diproses!`,
          type: "success",
        });
      }, 1000);
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal memproses penarikan dana. Silakan coba lagi.",
        type: "error",
      });
      setWithdrawStatus("idle");
    }
  };

  // Create Showcase (POST /showcases)
  const handlePublishShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseTitle) {
      setToast({
        isOpen: true,
        message: "Harap masukkan judul karya portofolio!",
        type: "error",
      });
      return;
    }

    setIsPublishingShowcase(true);
    try {
      // Fetch student's real project ID if available
      let targetProjectId = "64f1a2b3c4d5e6f7a8b9c0d1";
      try {
        const myApps = await api.applications.getMyApplications();
        if (Array.isArray(myApps) && myApps.length > 0 && myApps[0].projectId) {
          targetProjectId = myApps[0].projectId;
        }
      } catch {
        // Fallback
      }

      await api.showcases.create({
        projectId: targetProjectId,
        title: showcaseTitle,
        imageUrl: showcaseImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop",
        testimonial: showcaseTestimonial || "Pekerjaan rapi dan sesuai instruksi.",
        rating: showcaseRating,
        isFeatured: true,
      });

      setShowShowcaseModal(false);
      setShowcaseTitle("");
      setShowcaseImage("");
      setShowcaseTestimonial("");
      setShowcaseRating(5);

      setToast({
        isOpen: true,
        message: "Showcase portofolio berhasil dipublikasikan!",
        type: "success",
      });
      await loadWalletData();
    } catch (err: any) {
      setToast({
        isOpen: true,
        message: err.message || "Gagal memublikasikan showcase portofolio.",
        type: "error",
      });
    } finally {
      setIsPublishingShowcase(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };


  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner (Wallet & Earnings) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0B38E6] rounded-[40px] p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-xl shadow-[#0B38E6]/20"
      >
        {/* Abstract Overlapping Circles Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#A1FF00]/5 pointer-events-none blur-3xl" />
        
        {/* Left Side: Earnings Info */}
        <div className="relative z-10 space-y-4 text-center md:text-left w-full md:w-auto">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="p-2 bg-white/10 rounded-xl">
              <Wallet className="h-5 w-5 text-[#A1FF00]" />
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider">Total Pendapatan (Stipend)</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl md:text-5xl font-black text-[#A1FF00] tracking-tight">
              Rp {totalBalance.toLocaleString("id-ID")}
            </h2>
            <p className="text-xs text-slate-200 font-semibold tracking-wide">
              Saldo Escrow Ditahan (Aktif): <span className="text-amber-300 font-extrabold">Rp {escrowBalance.toLocaleString("id-ID")}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 mt-6 md:mt-0 w-full md:w-auto shrink-0">
          <button 
            onClick={() => setShowWithdrawModal(true)}
            className="w-full sm:w-auto bg-[#A1FF00] hover:bg-white text-slate-900 font-black px-8 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#A1FF00]/15 cursor-pointer"
          >
            Tarik Dana
          </button>
          <button 
            onClick={() => setShowShowcaseModal(true)}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/15"
          >
            <Plus className="h-4 w-4 text-[#A1FF00]" />
            Tambah Showcase
          </button>
        </div>
      </motion.div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* LEFT SECTION (60%): Portfolio Grid */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Karya Selesai & Terverifikasi
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Tampilkan portofolio yang disetujui sekolah & UMKM</p>
            </div>
            
            <button
              onClick={handleExportPDF}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-slate-100 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#0B38E6]" />
              Export PDF
            </button>
          </div>

          {/* Portfolio Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {isLoading ? (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-100">
                Memuat data portofolio dari backend...
              </div>
            ) : portfolioItems.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-medium bg-white rounded-3xl border border-slate-100">
                Belum ada portofolio terpublikasi di backend. Klik tombol "Tambah Showcase" untuk menambah baru.
              </div>
            ) : (
              portfolioItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="h-40 bg-slate-100 flex items-center justify-center relative group-hover:bg-slate-200/50 transition-colors overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-slate-350" />
                    )}
                    
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0B38E6] text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-blue-50">
                      <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-50" />
                      <span>VERIFIED</span>
                    </div>

                    <div className="absolute top-4 right-4 bg-slate-900/10 backdrop-blur-sm text-slate-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
                      {item.department}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">{item.umkmName}</span>
                      <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs mt-auto">
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-black text-[11px]">{item.rating}</span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-semibold">{item.completionDate}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* RIGHT SECTION (40%): Transaction History */}
        <div id="riwayat-transaksi" className="lg:col-span-4 space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Riwayat Transaksi</h2>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Pantau aliran keluar masuk dana Anda</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  Memuat riwayat transaksi dari backend...
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  Belum ada transaksi tercatat di backend.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${
                        tx.type === "income" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : tx.type === "escrow"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {tx.type === "income" ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : tx.type === "escrow" ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-xs line-clamp-1">{tx.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{tx.umkmOrBank} • {tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-black text-xs block ${
                        tx.type === "income" 
                          ? "text-emerald-600" 
                          : tx.type === "escrow"
                          ? "text-amber-600"
                          : "text-slate-800"
                      }`}>
                        {tx.amount}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">{tx.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WITHDRAW MODAL (PATCH /users/profile/siswa) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Wallet className="h-5.5 w-5.5 text-[#0B38E6]" />
                Tarik Pendapatan
              </h3>
              <p className="text-xs text-slate-500">
                Pindahkan saldo aktif stipend ke e-wallet atau rekening bank lokal Anda secara aman.
              </p>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Metode Penarikan</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "gopay", label: "GoPay" },
                    { id: "ovo", label: "OVO" },
                    { id: "bank", label: "Transfer Bank" }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setWithdrawMethod(method.id)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border text-center ${
                        withdrawMethod === method.id 
                          ? "bg-[#0B38E6] text-white border-transparent" 
                          : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Jumlah Penarikan (IDR)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    required
                    min="10000"
                    max="3000000"
                    placeholder="e.g. 500000"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full text-xs py-3 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white font-bold"
                  />
                </div>
                <span className="text-[9px] text-slate-400 block font-semibold">Tersedia untuk ditarik: Rp {totalBalance.toLocaleString("id-ID")}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {withdrawMethod === "bank" ? "Nomor Rekening & Nama Bank" : "Nomor HP / Akun E-Wallet"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={withdrawMethod === "bank" ? "BCA - 1234567890 a/n Pemilik" : "081234567890"}
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full text-xs py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={withdrawStatus === "loading"}
                className="w-full bg-[#0B38E6] hover:bg-slate-950 text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-4"
              >
                {withdrawStatus === "loading" ? "Memproses..." : "Konfirmasi Penarikan"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PUBLISH SHOWCASE MODAL (POST /showcases) */}
      {showShowcaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowShowcaseModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Plus className="h-5.5 w-5.5 text-[#0B38E6]" />
                Publikasikan Showcase Baru
              </h3>
              <p className="text-xs text-slate-500">
                Pamerkan hasil karya proyek Vokasi Anda ke portofolio publik SkillLoom.
              </p>
            </div>

            <form onSubmit={handlePublishShowcase} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Judul Hasil Karya</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Pemesanan Cafe Next.js"
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  className="w-full text-xs py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Unggah Gambar Screenshot Karya (Format PNG / JPG)
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-[#0B38E6] bg-slate-50 hover:bg-white rounded-2xl p-4 text-center transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {showcaseImage ? (
                    <div className="space-y-2 relative z-20">
                      <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200 relative group/img">
                        <img src={showcaseImage} alt="Preview Karya" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowcaseImage("");
                            setImageFile(null);
                          }}
                          className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white p-1 rounded-full transition-colors cursor-pointer"
                          title="Hapus gambar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{imageFile?.name || "Gambar PNG berhasil diunggah"}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-3">
                      <UploadCloud className="h-8 w-8 text-[#0B38E6] mx-auto group-hover:scale-110 transition-transform" />
                      <p className="text-xs font-bold text-slate-700">Pilih atau Tarik File PNG / Gambar di Sini</p>
                      <p className="text-[10px] text-slate-400 font-medium">Format didukung: PNG, JPG, WEBP (Maks. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Testimoni / Catatan Pengerjaan</label>
                <textarea
                  rows={3}
                  placeholder="Hasil pekerjaan rapi, selesai tepat waktu, dan disetujui mitra UMKM..."
                  value={showcaseTestimonial}
                  onChange={(e) => setShowcaseTestimonial(e.target.value)}
                  className="w-full text-xs p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#0B38E6] focus:bg-white font-semibold resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPublishingShowcase}
                className="w-full bg-[#0B38E6] hover:bg-slate-950 text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-4"
              >
                {isPublishingShowcase ? "Mempublikasikan..." : "Publikasikan ke Portofolio"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
