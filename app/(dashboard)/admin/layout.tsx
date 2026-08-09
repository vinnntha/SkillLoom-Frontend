"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  ShieldCheck,
  Building2,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Search,
  Wallet,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

export default function AdminDashboardLayout({
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

  // Client-side Token & Role Guard
  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.replace("/");
      } else if (
        user.role?.toString().toLowerCase() !== "admin"
      ) {
        // Redirect non-admin users to home or appropriate route
        router.replace("/");
      }

    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-[#0B38E6] flex items-center justify-center p-3 shadow-2xl shadow-[#0B38E6]/30 animate-bounce overflow-hidden border border-white/20">
          <GraduationCap className="h-full w-full text-[#A1FF00]" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-xs font-black text-slate-800 tracking-wider uppercase">
            SkillLoom Admin Portal
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Memuat dashboard supervisi & verifikasi sekolah...
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
      name: "Overview Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Verifikasi Proyek",
      href: "/admin/projects",
      icon: CheckSquare,
      badge: "Pending",
    },
    {
      name: "Monitoring Siswa",
      href: "/admin/monitoring",
      icon: Users,
    },
    {
      name: "Verifikasi Escrow",
      href: "/admin/transactions",
      icon: Wallet,
    },
    {
      name: "Profil Sekolah",
      href: "/admin/profile",
      icon: Building2,
    },
  ];

  const handleLogout = () => {
    setToast({
      isOpen: true,
      message: "Berhasil keluar dari portal Admin Sekolah...",
      type: "success",
    });
    logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const schoolName =
    user?.adminProfile?.schoolName ||
    user?.name ||
    "SMKN 1 Jakarta";

  const positionTitle =
    user?.adminProfile?.position || "Guru Pembimbing / Moderasi Vokasi";

  const initials =
    schoolName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "SK";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col md:flex-row relative selection:bg-[#A1FF00] selection:text-slate-900 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200/80 p-6 shrink-0 h-screen sticky top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0B38E6] to-slate-900 flex items-center justify-center p-2 shadow-xl shadow-[#0B38E6]/25 overflow-hidden shrink-0 border border-white/20">
            <GraduationCap className="h-7 w-7 text-[#A1FF00]" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
              SkillLoom
              <span className="text-[10px] font-black uppercase tracking-widest bg-[#A1FF00] text-slate-900 px-2 py-0.5 rounded-full shadow-sm">
                ADMIN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wider">
              Portal Moderasi & Vokasi
            </p>
          </div>
        </div>

        {/* School/Supervisor Profile Summary Card */}
        <Link
          href="/admin/profile"
          className="mb-6 p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[24px] border border-slate-700/50 flex items-center gap-3.5 group cursor-pointer shadow-lg shadow-slate-900/10 hover:border-[#A1FF00]/40 transition-all"
        >
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#0B38E6] to-blue-500 flex items-center justify-center text-[#A1FF00] font-black text-sm shadow-md">
              {initials}
            </div>
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#A1FF00] rounded-full border-2 border-slate-900 flex items-center justify-center shadow-sm"
              title="Akun Admin Verified"
            >
              <ShieldCheck className="h-2.5 w-2.5 text-slate-900 stroke-[3]" />
            </div>
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="font-bold text-sm text-white group-hover:text-[#A1FF00] transition-colors truncate">
              {schoolName}
            </h4>
            <p className="text-xs text-slate-400 truncate">{positionTitle}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#A1FF00] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 -mr-1">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                  isActive
                    ? "bg-[#0B38E6] text-white shadow-xl shadow-[#0B38E6]/25 scale-[1.01]"
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
                        : "bg-[#0B38E6]/10 text-[#0B38E6]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Moderation Status Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#0B38E6]/10 to-transparent border border-[#0B38E6]/20 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#0B38E6] flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="h-4 w-4 text-[#A1FF00]" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-extrabold text-[#0B38E6] leading-tight">
              Supervisi Sistem Aktif
            </p>
            <p className="text-[10px] text-slate-500 leading-tight truncate">
              PKL & Bounty Moderated
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="border-t border-slate-100 pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Portal
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center p-2 shadow-md shadow-[#0B38E6]/20 overflow-hidden shrink-0">
            <GraduationCap className="h-full w-full text-[#A1FF00]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 leading-none">
              SkillLoom
            </h1>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Admin Sekolah
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200"
            aria-label="Buka Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-4/5 max-w-sm h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center p-2 overflow-hidden shrink-0">
                  <GraduationCap className="h-full w-full text-[#A1FF00]" />
                </div>
                <h1 className="font-black text-lg text-slate-900">Admin Sekolah</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* School Profile Card Mobile */}
            <Link
              href="/admin/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-6 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-2xl bg-[#0B38E6] flex items-center justify-center text-[#A1FF00] font-black text-sm">
                {initials}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-white truncate">
                  {schoolName}
                </h4>
                <p className="text-xs text-slate-400 truncate">{positionTitle}</p>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
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
                            : "bg-[#0B38E6]/10 text-[#0B38E6]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Mobile */}
            <div className="border-t border-slate-100 pt-4 mt-auto">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5" />
                Keluar Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Portal Moderasi & Supervision Vokasi
              </span>
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                {schoolName}
                <span className="bg-[#0B38E6]/10 text-[#0B38E6] text-[10px] font-black px-2 py-0.5 rounded-full">
                  Supervisi Terintegrasi
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Link to Student Monitoring */}
            <Link
              href="/admin/monitoring"
              className="bg-[#0B38E6] hover:bg-[#092ec0] text-white font-extrabold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 shadow-md shadow-[#0B38E6]/20 transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-[#A1FF00]" />
              Supervisi Siswa PKL
            </Link>

            {/* Escrow System Tag */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <ShieldCheck className="h-4 w-4 text-[#0B38E6]" />
              <span>Escrow Verified</span>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Notification Icon */}
            <button
              onClick={() =>
                setToast({
                  isOpen: true,
                  message: "Sistem verifikasi proyek & escrow berjalan optimal.",
                  type: "info",
                })
              }
              className="relative p-2.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[#A1FF00] rounded-full border border-white"></span>
            </button>

            {/* Profile Quick Pill */}
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 pl-2 pr-3.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-[#0B38E6] flex items-center justify-center text-[#A1FF00] font-black text-xs shadow-sm">
                {initials}
              </div>
              <div className="text-left hidden xl:block">
                <span className="block text-xs font-bold text-slate-900 truncate max-w-[140px]">
                  {schoolName}
                </span>
                <span className="block text-[10px] font-semibold text-emerald-600">
                  Moderator Aktif
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 p-5 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>

      {/* Global Toast Component */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
