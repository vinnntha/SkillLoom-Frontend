"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "@/lib/api/auth.service";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, loginSuccess } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const token =
        searchParams.get("token") ||
        searchParams.get("access_token") ||
        searchParams.get("accessToken");

      let role = searchParams.get("role");

      // Parse role from state param if present (e.g., state={"role":"SISWA"})
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
            if (typeof stateParam === "string" && ["siswa", "umkm", "admin"].includes(stateParam.toLowerCase())) {
              role = stateParam;
            }
          }
        }
      }

      if (token) {
        setAuthToken(token);
        try {
          await refreshUser();
        } catch (e) {
          console.warn("Could not refresh user during callback:", e);
        }

        let targetRole = (role || "").toLowerCase();

        // Fallback to saved user role if role query param was not provided
        if (!targetRole) {
          try {
            const userItem = localStorage.getItem("user");
            if (userItem) {
              const u = JSON.parse(userItem);
              targetRole = (u.role || "siswa").toLowerCase();
            }
          } catch {}
        }

        if (targetRole === "umkm") {
          router.replace("/umkm");
        } else if (targetRole === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/siswa");
        }
      } else {
        const code = searchParams.get("code");
        if (code) {
          try {
            const currentRole = (role || "siswa").toUpperCase();
            const res = await api.auth.googleLogin({
              idToken: code,
              credential: code,
              role: currentRole,
            });

            loginSuccess(res.access_token, res.user);

            const targetRole = (res.user?.role || role || "siswa").toLowerCase();
            if (targetRole === "umkm") {
              router.replace("/umkm");
            } else if (targetRole === "admin") {
              router.replace("/admin");
            } else {
              router.replace("/siswa");
            }
            return;
          } catch (err) {
            console.error("Failed to exchange code for token:", err);
          }
        }
        router.replace("/auth");
      }
    }

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm shadow-2xl">
        <Loader2 className="w-10 h-10 text-[#A1FF00] animate-spin" />
        <h2 className="text-lg font-bold">Memverifikasi Otentikasi Google...</h2>
        <p className="text-xs text-slate-400">Harap tunggu sebentar, kami sedang mengalihkan Anda ke dashboard.</p>
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
