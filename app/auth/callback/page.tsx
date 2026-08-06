"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken, removeAuthToken } from "@/lib/api/auth.service";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, loginSuccess } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      // 1. Ambil token dari query params callback (token, access_token, accessToken)
      const token =
        searchParams.get("token") ||
        searchParams.get("access_token") ||
        searchParams.get("accessToken");

      let role = searchParams.get("role");

      // Extract role dari state parameter jika ada (e.g. state={"role":"SISWA"})
      if (!role) {
        const stateParam = searchParams.get("state");
        if (stateParam) {
          try {
            const decoded = decodeURIComponent(stateParam);
            const parsedState = JSON.parse(decoded);
            if (parsedState?.role) {
              role = parsedState.role;
            }
          } catch {
            if (
              typeof stateParam === "string" &&
              ["siswa", "umkm", "admin", "guru"].includes(stateParam.toLowerCase())
            ) {
              role = stateParam;
            }
          }
        }
      }

      // Skenario A: Token langsung diberikan di Callback URL
      if (token) {
        setAuthToken(token);
        try {
          await refreshUser();
        } catch (e) {
          console.warn("Gagal memverifikasi user dari token callback:", e);
          clearSessionAndRedirectToRegister();
          return;
        }

        // Ambil data user resmi dari localStorage (hasil sync getMe)
        const savedUserItem =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;
        let parsedUser: any = null;
        if (savedUserItem) {
          try {
            parsedUser = JSON.parse(savedUserItem);
          } catch {}
        }

        const activeRole = (parsedUser?.role || role || "").toString().toLowerCase();

        // JIKA TIDAK ADA ROLE DAN TOKEN VALID: Kembalikan ke registrasi
        if (!activeRole || !parsedUser) {
          console.warn("Token atau Role tidak valid. Mengalihkan ke registrasi.");
          clearSessionAndRedirectToRegister();
          return;
        }

        // REDIRECT KE DASHBOARD SESUAI ROLE DARI CALLBACK
        redirectToDashboard(activeRole);
        return;
      }

      // Skenario B: Authorization Code diberikan (Exchange Code ke Token)
      const code = searchParams.get("code");
      if (code) {
        try {
          const currentRole = (role || "SISWA").toUpperCase();
          const res = await api.auth.googleLogin({
            idToken: code,
            credential: code,
            role: currentRole,
          });

          if (res?.access_token) {
            loginSuccess(res.access_token, res.user);

            const activeRole = (res.user?.role || role || "")
              .toString()
              .toLowerCase();

            if (!activeRole) {
              clearSessionAndRedirectToRegister();
              return;
            }

            redirectToDashboard(activeRole);
            return;
          }
        } catch (err) {
          console.error("Gagal melakukan exchange code Google OAuth:", err);
        }
      }

      // Skenario C: Tidak ada token atau code -> Kembalikan ke registrasi
      clearSessionAndRedirectToRegister();
    }

    function clearSessionAndRedirectToRegister() {
      removeAuthToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      router.replace("/auth?error=unregistered");
    }

    function redirectToDashboard(roleStr: string) {
      const r = roleStr.toLowerCase();
      if (r === "umkm") {
        router.replace("/umkm");
      } else if (r === "admin" || r === "guru") {
        router.replace("/admin");
      } else {
        router.replace("/siswa");
      }
    }

    handleCallback();
  }, [searchParams, router, refreshUser, loginSuccess]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm shadow-2xl">
        <Loader2 className="w-10 h-10 text-[#A1FF00] animate-spin" />
        <h2 className="text-lg font-bold">Memverifikasi Otentikasi Google...</h2>
        <p className="text-xs text-slate-400">
          Harap tunggu sebentar, kami sedang memeriksa sesi dan mengalihkan Anda.
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm font-bold">
          Memuat...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
