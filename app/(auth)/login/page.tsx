import React from "react";
import { Metadata } from "next";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export const metadata: Metadata = {
  title: "Masuk - SkillLoom | Platform Kolaborasi Vokasi & UMKM",
  description: "Masuk ke akun SkillLoom Anda untuk terhubung dengan proyek nyata UMKM dan portofolio vokasi.",
};

export default function LoginPage() {
  return <AuthPageContainer defaultMode="signin" />;
}
