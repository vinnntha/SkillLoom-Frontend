"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Phone,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: any;
  }
}

type RoleType = "siswa" | "umkm" | "admin";

interface AuthFormContainerProps {
  isSignIn: boolean;
  setIsSignIn: (val: boolean) => void;
}

export const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  isSignIn,
  setIsSignIn,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSuccess } = useAuth();
  const [userRole, setUserRole] = useState<RoleType>("siswa");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    nisn: "",
    businessName: "",
    phoneNumber: "",
    schoolName: "",
    jurusan: "",
    jenisUsaha: "",
    jabatan: "",
  });

  const formDataRef = React.useRef(formData);
  React.useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Toast Notification State
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  React.useEffect(() => {
    if (!searchParams) return;
    const errParam = searchParams.get("error");
    if (errParam === "unregistered") {
      showToast("Email akun Anda belum terdaftar. Silakan lakukan pendaftaran (Daftar / Sign Up) terlebih dahulu.", "error");
      setIsSignIn(false);
    }
  }, [searchParams, setIsSignIn]);

  const userRoleRef = React.useRef(userRole);
  const isGsiInitializedRef = React.useRef(false);

  React.useEffect(() => {
    userRoleRef.current = userRole;
  }, [userRole]);

  const handleGoogleCredentialResponse = React.useCallback(
    async (response: any) => {
      if (response?.credential) {
        try {
          setIsSubmitting(true);
          showToast("Memverifikasi data Google...", "info");

          // Decode JWT ID Token payload client-side
          const base64Url = response.credential.split(".")[1];
          if (!base64Url) {
            throw new Error("Format token Google tidak valid");
          }
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const googleUser = JSON.parse(jsonPayload);

          const email = googleUser?.email;
          const name =
            googleUser?.name || googleUser?.given_name || "Pengguna Google";
          const sub = googleUser?.sub || "12345678";
          const googlePassword = `GoogleOAuth_${sub}`;
          const currentRole = userRoleRef.current;

          if (!email) {
            throw new Error("Email Google tidak ditemukan");
          }

          let loginRes: any = null;

          // 1. Coba login dengan kredensial Google
          try {
            loginRes = await api.auth.login({
              email: email,
              password: googlePassword,
            });
          } catch (loginErr: any) {
            // 2. Jika akun belum ada, daftarkan otomatis sesuai peran yang dipilih
            try {
              showToast("Mendaftarkan akun Google baru...", "info");
              const currentFormData = formDataRef.current;

              if (currentRole === "siswa") {
                await api.auth.registerSiswa({
                  email: email,
                  password: googlePassword,
                  fullName: currentFormData.fullName || name,
                  nisn: currentFormData.nisn || sub.slice(0, 10),
                  jurusan: currentFormData.jurusan || "RPL",
                });
              } else if (currentRole === "umkm") {
                await api.auth.registerUmkm({
                  email: email,
                  password: googlePassword,
                  companyName: currentFormData.businessName || name,
                  industryType: currentFormData.jenisUsaha || "Kuliner",
                  phoneNumber: currentFormData.phoneNumber || ("08" + sub.slice(0, 10)),
                });
              } else if (currentRole === "admin") {
                await api.auth.registerAdmin({
                  email: email,
                  password: googlePassword,
                  schoolName: currentFormData.schoolName || "Sekolah SMK",
                  position: currentFormData.jabatan || "Guru Pembimbing",
                });
              }

              loginRes = await api.auth.login({
                email: email,
                password: googlePassword,
              });
            } catch (regErr: any) {
              const regErrMsg = (regErr?.message || "").toString();
              if (
                regErrMsg.includes("terdaftar") ||
                regErrMsg.includes("already exists")
              ) {
                showToast(
                  "Email Google ini sudah terdaftar. Silakan masuk menggunakan email dan password manual.",
                  "error"
                );
                return;
              }
              throw regErr;
            }
          }

          if (loginRes?.access_token) {
            loginSuccess(loginRes.access_token, loginRes.user);
            showToast(
              loginRes.message || "Berhasil masuk dengan Google!",
              "success"
            );
            const targetRole = (
              loginRes.user?.role || currentRole
            ).toLowerCase();
            setTimeout(() => {
              if (targetRole === "siswa") router.push("/siswa");
              else if (targetRole === "umkm") router.push("/umkm");
              else if (targetRole === "admin" || targetRole === "guru")
                router.push("/admin");
              else router.push("/siswa");
            }, 800);
            return;
          }
        } catch (err: any) {
          showToast(
            err.message || "Gagal memproses otentikasi Google",
            "error"
          );
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    },
    [loginSuccess, router]
  );

  // Load Google GIS Script dynamically
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "811455490687-4ejpv1lrk0gk3nuvgo7tdiac97c2a42s.apps.googleusercontent.com";

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          isGsiInitializedRef.current = true;
        } catch (e) {
          console.warn("GSI init error:", e);
        }
      }
    };

    const scriptId = "google-gsi-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
    } else {
      initGsi();
    }
  }, [handleGoogleCredentialResponse]);

  const fallbackGoogleRedirect = () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://generous-unity-production-a8c9.up.railway.app";
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";
      const redirectCallback = `${currentOrigin}/auth/callback`;

      const params = new URLSearchParams({
        role: userRoleRef.current,
        redirect_uri: redirectCallback,
        frontend_url: currentOrigin,
        callback_url: redirectCallback,
        return_to: redirectCallback,
        state: JSON.stringify({
          role: userRoleRef.current,
          origin: currentOrigin,
          redirect: redirectCallback,
        }),
      });

      window.location.href = `${baseUrl}/auth/google?${params.toString()}`;
    } catch (err: any) {
      showToast(err.message || "Gagal menghubungkan dengan Google", "error");
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    showToast("Menghubungkan dengan layanan Google...", "info");

    const googleClientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "811455490687-4ejpv1lrk0gk3nuvgo7tdiac97c2a42s.apps.googleusercontent.com";

    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        if (!isGsiInitializedRef.current) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          isGsiInitializedRef.current = true;
        }

        window.google.accounts.id.prompt((notification: any) => {
          if (
            notification.isNotDisplayed() ||
            notification.isSkippedMoment() ||
            notification.isDismissedMoment()
          ) {
            console.warn(
              "One Tap prompt ditutup/tidak tampil, mencoba fallback..."
            );
            fallbackGoogleRedirect();
          }
        });
        return;
      } catch (e) {
        console.warn("GIS prompt failed, using fallback redirect:", e);
      }
    }

    fallbackGoogleRedirect();
  };



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isSignIn) {
        // Postman endpoint: POST /auth/login
        const res = await api.auth.login({
          email: formData.email,
          password: formData.password,
        });

        loginSuccess(res.access_token, res.user);
        showToast(res.message || "Berhasil masuk! Mengalihkan ke dashboard...", "success");

        const targetRole = (res.user?.role || "siswa").toLowerCase();
        setTimeout(() => {
          if (targetRole === "siswa") {
            router.push("/siswa");
          } else if (targetRole === "umkm") {
            router.push("/umkm");
          } else if (targetRole === "admin") {
            router.push("/admin");
          } else {
            router.push("/siswa");
          }
        }, 800);
      } else {
        // Register endpoints based on selected role:
        // POST /auth/register/siswa
        // POST /auth/register/umkm
        // POST /auth/register/admin
        if (userRole === "siswa") {
          const res = await api.auth.registerSiswa({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            nisn: formData.nisn,
            jurusan: formData.jurusan,
          });
          showToast(res.message || "Pendaftaran Siswa berhasil! Silakan masuk.", "success");
        } else if (userRole === "umkm") {
          const res = await api.auth.registerUmkm({
            email: formData.email,
            password: formData.password,
            companyName: formData.businessName,
            industryType: formData.jenisUsaha,
            phoneNumber: formData.phoneNumber,
          });
          showToast(res.message || "Pendaftaran UMKM berhasil! Silakan masuk.", "success");
        } else if (userRole === "admin") {
          const res = await api.auth.registerAdmin({
            email: formData.email,
            password: formData.password,
            schoolName: formData.schoolName,
            position: formData.jabatan,
          });
          showToast(res.message || "Pendaftaran Admin/Guru berhasil! Silakan masuk.", "success");
        }

        setIsSignIn(true);
      }
    } catch (err: any) {
      const errStr = (err?.message || "").toString().toLowerCase();
      if (
        errStr.includes("not found") ||
        errStr.includes("tidak ditemukan") ||
        errStr.includes("unregistered") ||
        errStr.includes("belum terdaftar") ||
        errStr.includes("user not exist") ||
        errStr.includes("cannot find") ||
        errStr.includes("404")
      ) {
        showToast("Email Anda belum terdaftar di sistem. Silakan lakukan pendaftaran (Daftar / Sign Up) terlebih dahulu.", "error");
        setIsSignIn(false);
      } else {
        showToast(err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-3 sm:p-8 lg:p-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] p-4 sm:p-8 md:p-10 shadow-2xl relative">

        {/* Mobile Header (visible only on screens < lg) */}
        <div className="flex lg:hidden items-center justify-between gap-4 w-full mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/" className="group flex items-center gap-2">
            <img
              src="/logo.png"
              alt="SkillLoom Logo"
              className="h-6 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
          >
            <ArrowLeft className="w-3 h-3 text-[#0B38E6] dark:text-[#A1FF00]" />
            <span>Kembali</span>
          </Link>
        </div>

        {/* Auth Mode Toggle Pill (Top Bar) */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full flex items-center mb-4 sm:mb-6 relative border border-slate-200/60 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
              isSignIn
                ? "bg-[#0B38E6] text-white shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Masuk / Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 sm:py-3 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
              !isSignIn
                ? "bg-[#0B38E6] text-white shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Daftar / Sign Up</span>
          </button>
        </div>

        {/* Animated Form Content */}
        <AnimatePresence mode="wait">
          {isSignIn ? (
            /* ================= SIGN IN FORM ================= */
            <motion.div
              key="sign-in-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Selamat Datang Kembali
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Masuk ke akun SkillLoom Anda untuk melanjutkan proyek & portofolio.
                </p>
              </div>

              {/* Social Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl py-2 sm:py-3 px-4 flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-slate-700 dark:text-slate-200 text-sm shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="w-4 h-4 sm:w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">Masuk dengan Google</span>
              </button>

              {/* Divider */}
              <div className="my-4 sm:my-6 flex items-center gap-3">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase">
                  atau masuk dengan email
                </span>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Email Terdaftar
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      disabled={isSubmitting}
                      placeholder="Masukkan kata sandi"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-9 sm:pl-11 pr-10 sm:pr-11 py-2 sm:py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#0B38E6] focus:ring-[#A1FF00] border-slate-300 dark:border-slate-700 cursor-pointer"
                    />
                    <span>Ingat Saya</span>
                  </label>
                  <a
                    href="#forgot-password"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast("Fitur reset password belum tersedia.", "info");
                    }}
                    className="font-semibold text-[#0B38E6] dark:text-[#A1FF00] hover:underline"
                  >
                    Lupa Password?
                  </a>
                </div>

                {/* Electric Lime Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 sm:mt-6 bg-[#A1FF00] hover:bg-[#8ee600] active:scale-[0.98] text-slate-950 font-black py-3 sm:py-4 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide border border-slate-950/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>MEMPROSES...</span>
                    </>
                  ) : (
                    <>
                      <span>MASUK SEKARANG</span>
                      <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <motion.div
              key="sign-up-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Buat Akun Baru
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Pilih peran Anda di SkillLoom untuk mulai berkolaborasi.
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="mb-4">
                <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Pilih Peran Akun
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {/* Siswa Tab */}
                  <button
                    type="button"
                    onClick={() => setUserRole("siswa")}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${userRole === "siswa"
                      ? "bg-[#0B38E6]/10 border-[#0B38E6] text-[#0B38E6] dark:text-[#A1FF00] dark:bg-[#0B38E6]/30 dark:border-[#0B38E6] shadow-sm scale-[1.01]"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Siswa SMK</span>
                  </button>

                  {/* UMKM Tab */}
                  <button
                    type="button"
                    onClick={() => setUserRole("umkm")}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${userRole === "umkm"
                      ? "bg-[#0B38E6]/10 border-[#0B38E6] text-[#0B38E6] dark:text-[#A1FF00] dark:bg-[#0B38E6]/30 dark:border-[#0B38E6] shadow-sm scale-[1.01]"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>UMKM</span>
                  </button>

                  {/* Admin / Guru Tab */}
                  <button
                    type="button"
                    onClick={() => setUserRole("admin")}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${userRole === "admin"
                      ? "bg-[#0B38E6]/10 border-[#0B38E6] text-[#0B38E6] dark:text-[#A1FF00] dark:bg-[#0B38E6]/30 dark:border-[#0B38E6] shadow-sm scale-[1.01]"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Guru/Sekolah</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Registration Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                {/* Field Name depending on role */}
                {userRole === "siswa" && (
                  <>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Nama Lengkap Siswa
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          required
                          disabled={isSubmitting}
                          placeholder="Contoh: Budi Pratama"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        NISN (Nomor Induk Siswa Nasional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <FileText className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="nisn"
                          required
                          disabled={isSubmitting}
                          placeholder="Contoh: 0054321098"
                          value={formData.nisn}
                          onChange={handleInputChange}
                          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {userRole === "umkm" && (
                  <>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Nama Usaha / Brand UMKM
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="businessName"
                          required
                          disabled={isSubmitting}
                          placeholder="Contoh: Kopi Studio Nusantara"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Nomor Telepon / WhatsApp
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4 sm:w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          disabled={isSubmitting}
                          placeholder="Contoh: 081234567890"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </>
                )}

                {userRole === "admin" && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nama Sekolah SMK / Instansi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <GraduationCap className="w-4 h-4 sm:w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="schoolName"
                        required
                        disabled={isSubmitting}
                        placeholder="Contoh: SMKN 1 Jakarta"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    {userRole === "admin" ? "Email Resmi Instansi" : "Email Utama"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isSubmitting}
                      placeholder="nama@domain.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-9 sm:pl-11 pr-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kata Sandi (Minimal 6 Karakter)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      disabled={isSubmitting}
                      placeholder="Buat kata sandi aman"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-9 sm:pl-11 pr-10 sm:pr-11 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Dropdown Field depending on role */}
                {userRole === "siswa" && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Jurusan SMK
                    </label>
                    <select
                      name="jurusan"
                      required
                      disabled={isSubmitting}
                      value={formData.jurusan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    >
                      <option value="">Pilih Jurusan Anda</option>
                      <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                      <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                      <option value="Pemasaran">Pemasaran Digital & Bisnis</option>
                      <option value="TKJ">Teknik Komputer & Jaringan (TKJ)</option>
                      <option value="Akuntansi">Akuntansi & Keuangan</option>
                      <option value="MultiMedia">Multimedia & Animasi</option>
                      <option value="Lainnya">Jurusan Lainnya</option>
                    </select>
                  </div>
                )}

                {userRole === "umkm" && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Jenis Kategori Usaha
                    </label>
                    <select
                      name="jenisUsaha"
                      required
                      disabled={isSubmitting}
                      value={formData.jenisUsaha}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    >
                      <option value="">Pilih Kategori Usaha</option>
                      <option value="Kuliner">Kuliner / Food & Beverage (F&B)</option>
                      <option value="Fashion">Fashion & Apparel</option>
                      <option value="JasaDigital">Jasa Digital & Kreatif</option>
                      <option value="Retail">Retail & Perdagangan</option>
                      <option value="Kriya">Kriya & Kerajinan Tangan</option>
                      <option value="Lainnya">Kategori Lainnya</option>
                    </select>
                  </div>
                )}

                {userRole === "admin" && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Jabatan / Peran di Sekolah
                    </label>
                    <select
                      name="jabatan"
                      required
                      disabled={isSubmitting}
                      value={formData.jabatan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#A1FF00] focus:border-[#0B38E6] disabled:opacity-50"
                    >
                      <option value="">Pilih Jabatan</option>
                      <option value="Kepala Sekolah">Kepala Sekolah</option>
                      <option value="Wakasek Hubin / Humas">Wakasek Hubin / Humas</option>
                      <option value="Guru Pembimbing">Guru Pembimbing / Kejuruan</option>
                      <option value="Staf Administrasi">Staf Administrasi Sekolah</option>
                      <option value="Lainnya">Jabatan Lainnya</option>
                    </select>
                  </div>
                )}

                {/* Terms & Privacy Checkbox */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      required
                      disabled={isSubmitting}
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 rounded text-[#0B38E6] focus:ring-[#A1FF00] border-slate-300 dark:border-slate-700 cursor-pointer disabled:opacity-50"
                    />
                    <span className="leading-snug">
                      Saya menyetujui{" "}
                      <a href="#terms" className="text-[#0B38E6] dark:text-[#A1FF00] underline font-semibold text-[10px] sm:text-xs">
                        Syarat & Ketentuan
                      </a>{" "}
                      serta{" "}
                      <a href="#privacy" className="text-[#0B38E6] dark:text-[#A1FF00] underline font-semibold text-[10px] sm:text-xs">
                        Kebijakan Privasi
                      </a>{" "}
                      SkillLoom.
                    </span>
                  </label>
                </div>

                {/* Cobalt Blue Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 bg-[#0B38E6] hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base tracking-wide group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>MEMPROSES...</span>
                    </>
                  ) : (
                    <>
                      <span>DAFTAR AKUN BARU</span>
                      <Sparkles className="w-4 h-4 sm:w-5 h-5 text-[#A1FF00] group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Floating Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
