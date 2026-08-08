"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  Wallet,
  Sparkles,
  Building2,
  LogOut,
  Menu,
  X,
  Bell,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Client-side Token Guard
  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-[#0B38E6] flex items-center justify-center p-2 shadow-xl shadow-[#0B38E6]/25 animate-bounce">
          <Building2 className="h-8 w-8 text-[#A1FF00]" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-black text-slate-800 tracking-wider uppercase">
            SkillLoom UMKM Portal
          </p>
          <p className="text-xs text-slate-400 font-medium">
            Memuat dashboard dan data mitra industri...
          </p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard Overview",
      href: "/umkm",
      icon: LayoutDashboard,
    },
    {
      name: "Buat Proyek Baru",
      href: "/umkm/create",
      icon: PlusCircle,
      badge: "Baru",
    },
    {
      name: "Kelola Pelamar",
      href: "/umkm/applicants",
      icon: Users,
    },
    {
      name: "Transaksi & Escrow",
      href: "/umkm/transactions",
      icon: Wallet,
    },
    {
      name: "Showcase Portofolio",
      href: "/umkm/showcases",
      icon: Sparkles,
    },
    {
      name: "Profil Usaha / Brand",
      href: "/umkm/profile",
      icon: Building2,
    },
  ];

  const handleLogout = () => {
    setToast({
      isOpen: true,
      message: "Berhasil keluar dari akun UMKM...",
      type: "success",
    });
    logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const displayName =
    user?.umkmProfile?.companyName ||
    user?.name ||
    "Mitra UMKM SkillLoom";

  const industryType =
    user?.umkmProfile?.industryType || "Industri Kreatif & Digital";

  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "UM";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col md:flex-row relative selection:bg-[#A1FF00] selection:text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100/90 p-6 shrink-0 h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center p-1.5 shadow-lg shadow-slate-900/15 overflow-hidden shrink-0 border border-slate-800">
            <img
              src="/logo-s.png"
              alt="SkillLoom Logo"
              className="h-full w-full object-contain drop-shadow"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
              SkillLoom
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#0B38E6] text-white px-2 py-0.5 rounded-full">
                UMKM
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wider">
              Mitra Industri & Vokasi
            </p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <Link
          href="/umkm/profile"
          className="mb-6 p-4 bg-gradient-to-br from-slate-50 to-slate-100/60 hover:to-slate-100 transition-all rounded-[24px] border border-slate-200/60 flex items-center gap-3.5 group cursor-pointer shadow-sm hover:shadow"
        >
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-[#0B38E6]/20">
              {initials}
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#A1FF00] rounded-full border-2 border-white flex items-center justify-center shadow-sm"
              title="Mitra UMKM Terverifikasi"
            >
              <ShieldCheck className="h-2.5 w-2.5 text-slate-900 stroke-[3]" />
            </div>
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0B38E6] transition-colors truncate">
              {displayName}
            </h4>
            <p className="text-xs text-slate-500 truncate">{industryType}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#0B38E6] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 -mr-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/umkm" && pathname === "/umkm/dashboard") ||
              (item.href !== "/umkm" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#0B38E6] text-white shadow-lg shadow-[#0B38E6]/20 scale-[1.01]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      isActive ? "text-[#A1FF00]" : "text-slate-400 group-hover:text-[#0B38E6]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#A1FF00] text-slate-900"
                        : "bg-[#A1FF00]/20 text-[#0B38E6]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Escrow Guarantee Pill Card */}
        <div className="my-4 p-4 rounded-2xl bg-[#0B38E6]/5 border border-[#0B38E6]/10 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#0B38E6] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-[#A1FF00]" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-extrabold text-[#0B38E6] leading-tight">
              SkillLoom Escrow Protected
            </p>
            <p className="text-[10px] text-slate-500 leading-tight truncate">
              Dana cair setelah hasil disetujui
            </p>
          </div>
        </div>

        {/* Bottom / Logout */}
        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center p-1 shadow-md shadow-slate-900/10 overflow-hidden shrink-0 border border-slate-800">
            <img src="/logo-s.png" alt="SkillLoom Logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 leading-none">
              SkillLoom
            </h1>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              UMKM Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/umkm/create"
            className="bg-[#A1FF00] hover:bg-[#8ee600] text-slate-900 p-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Proyek</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200/60"
            aria-label="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center p-1 overflow-hidden shrink-0 border border-slate-800">
                  <img src="/logo-s.png" alt="SkillLoom Logo" className="h-full w-full object-contain" />
                </div>
                <h1 className="font-black text-lg text-slate-900">SkillLoom UMKM</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Section for Mobile */}
            <Link
              href="/umkm/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-white font-extrabold text-sm">
                {initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {displayName}
                </h4>
                <p className="text-xs text-slate-500 truncate">{industryType}</p>
              </div>
            </Link>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/umkm" && pathname === "/umkm/dashboard") ||
                  (item.href !== "/umkm" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#0B38E6] text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-[#A1FF00]" : "text-slate-400"}`}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-[#A1FF00] text-slate-900"
                            : "bg-[#A1FF00]/20 text-[#0B38E6]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-100 pt-4 mt-auto">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Workspace Kolaborasi Mitra
              </span>
              <h2 className="font-extrabold text-slate-900 text-sm">
                Dashboard Manajemen Proyek & Talenta
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Create Project Button */}
            <Link
              href="/umkm/create"
              className="bg-[#A1FF00] hover:bg-[#91e800] text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:shadow transition-all transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-slate-900" />
              Buat Proyek Baru
            </Link>

            {/* Escrow Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-[#0B38E6]" />
              <span>Escrow Protected</span>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200"></div>

            {/* Notification Bell */}
            <button
              onClick={() =>
                setToast({
                  isOpen: true,
                  message: "Semua sistem notifikasi dan escrow berjalan normal.",
                  type: "info",
                })
              }
              className="relative p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-emerald-500 rounded-full"></span>
            </button>

            {/* Brand Profile Quick Chip */}
            <Link
              href="/umkm/profile"
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                {initials}
              </div>
              <div className="text-left hidden xl:block">
                <span className="block text-xs font-bold text-slate-900 truncate max-w-[140px]">
                  {displayName}
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600">
                  Verified Brand
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Container */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

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
