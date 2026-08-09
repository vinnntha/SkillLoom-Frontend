"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Wallet, 
  Star, 
  Clock, 
  Code2, 
  Briefcase, 
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function SiswaDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [applicationsList, setApplicationsList] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const [apps, txs] = await Promise.allSettled([
          api.applications.getMyApplications(),
          api.transactions.getMyTransactions(),
        ]);
        if (apps.status === "fulfilled" && Array.isArray(apps.value)) {
          setApplicationsList(apps.value);
        }
        if (txs.status === "fulfilled" && Array.isArray(txs.value)) {
          const sum = txs.value.reduce((acc: number, item: any) => {
            const val = Number(item.amount || 0);
            return item.paymentStatus === "RELEASED" ? acc + val : acc;
          }, 0);
          setTotalBalance(sum);
        }
      } catch (err) {
        console.warn("Could not fetch user dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  const activeProjectsCount = applicationsList.length;

  // Animation Variants
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
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* A. Overview Section (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Main Balance */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-1 lg:col-span-1 bg-[#0B38E6] text-white rounded-[32px] p-7 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_40px_-15px_rgba(11,56,230,0.3)]"
        >
          <Wallet className="absolute -right-4 -bottom-4 h-40 w-40 text-white/5 rotate-[-15deg] pointer-events-none" />
          
          <div className="relative z-10 space-y-1">
            <span className="text-white/70 text-sm font-semibold uppercase tracking-wider block">Total Uang Saku</span>
            <h3 className="text-4xl font-black text-[#A1FF00] tracking-tight">
              Rp {totalBalance.toLocaleString("id-ID")}
            </h3>
          </div>

          <div className="relative z-10 mt-8">
            <button 
              onClick={() => router.push("/siswa/wallet")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
            >
              Tarik Dana
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Card 2: Active Projects */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-[#0B38E6]/20 transition-colors"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider block">Proyek Berjalan</span>
              <h3 className="text-5xl font-black text-slate-900 group-hover:text-[#0B38E6] transition-colors">
                {activeProjectsCount}
              </h3>
            </div>
            
            <div className="h-14 w-14 rounded-full border-[4px] border-slate-50 flex items-center justify-center relative">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#A1FF00]"
                  strokeDasharray="75, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              <span className="text-xs font-bold text-slate-700">100%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-max">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Aktif Terhubung Backend</span>
          </div>
        </motion.div>

        {/* Card 3: Accepted Applications Metric */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 flex flex-col justify-between"
        >
          <div className="space-y-1 mb-4">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider block">Lamaran Diterima</span>
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-black text-[#0B38E6]">
                {applicationsList.filter((a) => a.status === "ACCEPTED").length}
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-1">
                Disetujui UMKM
              </span>
            </div>
          </div>

          <div className="bg-[#0B38E6]/5 border border-[#0B38E6]/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="bg-[#0B38E6] text-white p-2 rounded-xl">
              <Briefcase className="h-5 w-5 text-[#A1FF00]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Badge Vokasi</p>
              <p className="text-sm font-black text-[#0B38E6]">
                {user?.siswaProfile?.jurusan ? `Verified ${user.siswaProfile.jurusan}` : "Verified Siswa SMK"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      {/* B. Active Workspace Section (Table/List) */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-black text-slate-900">Proyek & Lamaran Saya</h2>
          <span className="text-xs font-bold text-[#0B38E6]">
            Total {applicationsList.length} Proyek
          </span>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400 text-sm font-medium">
              Memuat data lamaran dari backend...
            </div>
          ) : applicationsList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm font-medium">
              Belum ada proyek yang dilamar. Silakan jelajahi menu Cari Proyek.
            </div>
          ) : (
            applicationsList.map((app: any, idx: number) => {
              const projectTitle = app.project?.title || "Proyek Vokasi";
              const umkmName = app.project?.umkm?.companyName || "UMKM Partner";
              const status = app.status || "PENDING";

              return (
                <div 
                  key={app.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-2xl transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-blue-50 text-blue-600 rounded-2xl p-3.5 shrink-0 shadow-sm border border-blue-100">
                      <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{projectTitle}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{umkmName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 min-w-[120px]">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold">
                      {new Date(app.createdAt || Date.now()).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 min-w-[180px]">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm border ${
                      status === "ACCEPTED" 
                        ? "bg-[#A1FF00]/20 text-[#609900] border-[#A1FF00]/30" 
                        : status === "REJECTED"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      {status === "ACCEPTED" ? "DITERIMA" : status === "REJECTED" ? "DITOLAK" : "MENUNGGU"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
