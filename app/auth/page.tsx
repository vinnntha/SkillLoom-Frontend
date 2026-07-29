import React from "react";
import { Metadata } from "next";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export const metadata: Metadata = {
  title: "Autentikasi - SkillLoom | Platform Kolaborasi Vokasi & UMKM",
  description: "Masuk atau Daftar akun SkillLoom Anda untuk terhubung dengan proyek nyata UMKM dan portofolio vokasi.",
};

export default function AuthPage() {
  return <AuthPageContainer defaultMode="signin" />;
}
