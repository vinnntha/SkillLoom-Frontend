"use client";

import React, { useState } from "react";
import { AuthBrandShowcase } from "./AuthBrandShowcase";
import { AuthFormContainer } from "./AuthFormContainer";

interface AuthPageContainerProps {
  defaultMode?: "signin" | "signup";
}

export const AuthPageContainer: React.FC<AuthPageContainerProps> = ({
  defaultMode = "signin",
}) => {
  const [isSignIn, setIsSignIn] = useState<boolean>(defaultMode === "signin");

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Left Column: Visual Branding & Glassmorphism Showcase (Cobalt Blue Canvas) - Hidden on mobile */}
      <section className="hidden lg:flex w-full h-full flex-col">
        <AuthBrandShowcase />
      </section>

      {/* Right Column: Interactive Form Container */}
      <section className="w-full h-full flex flex-col justify-center">
        <AuthFormContainer isSignIn={isSignIn} setIsSignIn={setIsSignIn} />
      </section>
    </main>
  );
};
