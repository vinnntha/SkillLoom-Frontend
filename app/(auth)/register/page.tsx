import React from "react";
import { Metadata } from "next";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export const metadata: Metadata = {
  title: "Daftar Akun Baru - SkillLoom | Platform Kolaborasi Vokasi & UMKM",
  description: "Daftar akun SkillLoom sebagai Siswa SMK, UMKM, atau Sekolah untuk mulai berkolaborasi dalam proyek nyata.",
};

export default function RegisterPage() {
  return <AuthPageContainer defaultMode="signup" />;
}
