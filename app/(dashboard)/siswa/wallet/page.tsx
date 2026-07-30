"use client";

import React, { useState } from "react";
import { 
  Download, 
  Wallet, 
  Star, 
  Image as ImageIcon, 
  ArrowDownRight, 
  ArrowUpRight, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  ArrowRight,
  TrendingUp,
  X
} from "lucide-react";
import { motion } from "framer-motion";

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
  const [activeTab, setActiveTab] = useState<"all" | "portfolio" | "wallet">("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("gopay");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "loading" | "success">("idle");

  const portfolioItems: PortfolioItem[] = [
    {
      id: "port-1",
      title: "Desain Konten Instagram Spesial Ramadan",
      umkmName: "Hijab Chic Style",
      category: "Desain Grafis",
      rating: 5,
      completionDate: "18 Juni 2026",
      stipend: "Rp 500.000",
      department: "DKV"
    },
    {
      id: "port-2",
      title: "Landing Page Katalog Kue & Roti",
      umkmName: "Roti Ibu Baker",
      category: "Web Development",
      rating: 5,
      completionDate: "05 Juli 2026",
      stipend: "Rp 1.200.000",
      department: "RPL"
    },
    {
      id: "port-3",
      title: "Riset Hashtag & Kalender Konten Reels",
      umkmName: "Keripik Pedas Maicih",
      category: "Sosial Media",
      rating: 4.8,
      completionDate: "20 Juli 2026",
      stipend: "Rp 400.000",
      department: "Pemasaran Digital"
    },
    {
      id: "port-4",
      title: "Desain Kemasan Sambal Botol Pedas",
      umkmName: "Sambal Nusantara",
      category: "Desain Grafis",
      rating: 5,
      completionDate: "28 Juli 2026",
      stipend: "Rp 800.000",
      department: "DKV"
    }
  ];

  const transactions: Transaction[] = [
    {
      id: "tx-1",
      type: "income",
      title: "Pembayaran Proyek Sambal Nusantara",
      umkmOrBank: "Sambal Nusantara",
      date: "28 Jul 2026",
      amount: "+ Rp 800.000",
      amountRaw: 800000,
      status: "Berhasil"
    },
    {
      id: "tx-2",
      type: "escrow",
      title: "Escrow: Pembuatan Landing Page Menu Kopi",
      umkmOrBank: "Kedai Kopi Senja",
      date: "25 Jul 2026",
      amount: "Rp 750.000",
      amountRaw: 750000,
      status: "Escrow"
    },
    {
      id: "tx-3",
      type: "income",
      title: "Pembayaran Proyek Kalender Konten",
      umkmOrBank: "Keripik Pedas Maicih",
      date: "20 Jul 2026",
      amount: "+ Rp 400.000",
      amountRaw: 400000,
      status: "Berhasil"
    },
    {
      id: "tx-4",
      type: "withdrawal",
      title: "Penarikan Dana ke GoPay",
      umkmOrBank: "GoPay (0812****9012)",
      date: "10 Jul 2026",
      amount: "- Rp 1.000.000",
      amountRaw: -1000000,
      status: "Berhasil"
    },
    {
      id: "tx-5",
      type: "income",
      title: "Pembayaran Proyek Katalog Kue",
      umkmOrBank: "Roti Ibu Baker",
      date: "05 Jul 2026",
      amount: "+ Rp 1.200.000",
      amountRaw: 1200000,
      status: "Berhasil"
    }
  ];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawAccount) {
      alert("Harap isi semua kolom penarikan!");
      return;
    }
    setWithdrawStatus("loading");
    setTimeout(() => {
      setWithdrawStatus("success");
      setTimeout(() => {
        setWithdrawStatus("idle");
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        setWithdrawAccount("");
        alert("Permintaan penarikan dana berhasil diproses! Dana akan masuk ke e-wallet dalam waktu maksimal 24 jam.");
      }, 1000);
    }, 1500);
  };

  const handleExportPDF = () => {
    alert("Mengekspor portofolio digital terverifikasi ke format PDF. Harap tunggu sebentar...");
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
            <h2 className="text-4xl md:text-5xl font-black text-[#A1FF00] tracking-tight">Rp 3.750.000</h2>
            <p className="text-xs text-slate-200 font-semibold tracking-wide">
              Saldo Escrow Ditahan (Aktif): <span className="text-amber-300 font-extrabold">Rp 750.000</span>
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
            onClick={() => {
              const el = document.getElementById("riwayat-transaksi");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white hover:bg-white/10 text-white font-bold px-7 py-4 rounded-2xl text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            Riwayat Transaksi
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
            {portfolioItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image Placeholder */}
                <div className="h-40 bg-slate-100 flex items-center justify-center relative group-hover:bg-slate-200/50 transition-colors">
                  <ImageIcon className="h-10 w-10 text-slate-350" />
                  
                  {/* Verified Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0B38E6] text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-blue-50">
                    <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-50" />
                    <span>VERIFIED</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-900/10 backdrop-blur-sm text-slate-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase">
                    {item.department}
                  </div>
                </div>

                {/* Content */}
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
            ))}
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
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === "income" 
                        ? "bg-emerald-50 text-emerald-600" 
                        : tx.type === "escrow"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-rose-50 text-rose-600"
                    }`}>
                      {tx.type === "income" ? (
                        <ArrowDownRight className="h-5 w-5" />
                      ) : tx.type === "escrow" ? (
                        <Lock className="h-4.5 w-4.5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 leading-snug line-clamp-1">{tx.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-semibold">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`block text-xs font-black ${
                      tx.type === "income" 
                        ? "text-emerald-600" 
                        : tx.type === "escrow"
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}>
                      {tx.amount}
                    </span>
                    <span className={`inline-block text-[9px] font-black px-1.5 py-0.5 rounded-full mt-1 ${
                      tx.status === "Berhasil"
                        ? "bg-emerald-50 text-emerald-600"
                        : tx.status === "Escrow"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* View Full History Trigger */}
            <button className="w-full text-center py-2 text-xs font-extrabold text-[#0B38E6] bg-[#0B38E6]/5 hover:bg-[#0B38E6]/10 transition-colors rounded-xl">
              Lihat Seluruh Riwayat
            </button>
          </div>
        </div>

      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 border border-slate-100 flex flex-col relative animate-in zoom-in-95 duration-200">
            {/* Close Button */}
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
              {/* Method Selector */}
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

              {/* Amount Input */}
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
                <span className="text-[9px] text-slate-400 block font-semibold">Tersedia untuk ditarik: Rp 3.000.000 (tidak termasuk escrow)</span>
              </div>

              {/* Account details */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {withdrawMethod === "bank" ? "Nomor Rekening & Nama Bank" : "Nomor HP / Akun E-Wallet"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={withdrawMethod === "bank" ? "BCA - 1234567890 a/n Arya" : "081234567890"}
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
                {withdrawStatus === "loading" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>Konfirmasi Penarikan</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
