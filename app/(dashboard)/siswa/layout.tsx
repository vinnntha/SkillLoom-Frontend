"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Briefcase, 
  LayoutDashboard, 
  Search, 
  Wallet, 
  FolderGit2, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Award 
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export default function SiswaDashboardLayout({
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

  // Client-side Token Guard: Redirect unauthenticated users
  React.useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.replace("/auth");
      }
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center p-2 shadow-lg animate-bounce">
          <img src="/logo1.png" alt="SkillLoom" className="h-full w-auto object-contain" />
        </div>
        <p className="text-xs font-bold text-slate-500 tracking-wide uppercase">Memeriksa Akses Sesi Autentikasi...</p>
      </div>
    );
  }

  if (!token || !user) {
    return null;
  }

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard Overview",
      href: "/siswa/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Cari Proyek (Bounty)",
      href: "/siswa",
      icon: Search,
    },
    {
      name: "Ruang Kerja (Workspace)",
      href: "/siswa/workspace",
      icon: FolderGit2,
    },
    {
      name: "Portofolio & Wallet",
      href: "/siswa/wallet",
      icon: Wallet,
    },
  ];

  const handleLogout = () => {
    setToast({
      isOpen: true,
      message: "Berhasil keluar dari akun siswa...",
      type: "success",
    });
    logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  };

  const displayName = user?.name || user?.siswaProfile?.fullName || "Siswa SkillLoom";
  const displaySub = user?.siswaProfile?.jurusan ? `Jurusan ${user.siswaProfile.jurusan}` : user?.email || "Siswa SMK";
  const initials = displayName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "SW";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 flex flex-col md:flex-row relative">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 p-6 shrink-0 h-screen sticky top-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center p-1 shadow-md shadow-slate-900/10 overflow-hidden shrink-0 border border-slate-800">
            <img src="/logo-s.png" alt="SkillLoom Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">SkillLoom</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Siswa Dashboard</p>
          </div>
        </div>

        {/* Profile Card Summary */}
        <Link 
          href="/siswa/profile" 
          className="mb-8 p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-2xl border border-slate-100 flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0B38E6] to-[#60a5fa] flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#A1FF00] rounded-full border-2 border-white flex items-center justify-center" title="Verified Account">
              <Award className="h-2 w-2 text-slate-900" />
            </div>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#0B38E6] transition-colors truncate">{displayName}</h4>
            <p className="text-xs text-slate-500 truncate">{displaySub}</p>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/siswa" && pathname === "/siswa");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#0B38E6] text-white shadow-lg shadow-[#0B38E6]/15 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-[#A1FF00]" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom / Logout */}
        <div className="border-t border-slate-100 pt-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
            <img src="/logo.png" alt="SkillLoom Logo" className="h-full w-auto object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-md text-slate-900">SkillLoom</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full"></span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-3/4 max-w-sm h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <img src="/logo.png" alt="SkillLoom Logo" className="h-full w-auto object-contain" />
                </div>
                <h1 className="font-extrabold text-md text-slate-900">SkillLoom</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Section for Mobile */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0B38E6] to-[#60a5fa] flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{displayName}</h4>
                <p className="text-xs text-slate-500"></p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || (item.href === "/siswa" && pathname === "/siswa");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#0B38E6] text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-[#A1FF00]" : ""}`} />
                    {item.name}
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
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-5 w-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Desktop */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-100 sticky top-0 z-30">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Workspace Utama</span>
            <h2 className="font-bold text-slate-800 text-sm">Dashboard Pelajar</h2>
          </div>
          <div className="flex items-center gap-6">
            {/* Notification Badge */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* Divider */}
            <div className="h-6 w-px bg-slate-100"></div>

            {/* User Profile Header Link */}
            <Link 
              href="/siswa/profile"
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="text-right">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-[#0B38E6] transition-colors">{displayName}</span>
                <span className="block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  {user?.siswaProfile?.jurusan ? `Siswa ${user.siswaProfile.jurusan}` : "Verified Siswa"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0B38E6] to-[#60a5fa] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Pages Mount */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
