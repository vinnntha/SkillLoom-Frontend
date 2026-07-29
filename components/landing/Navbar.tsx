"use client";

import React, { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#tentang" },
    { name: "Workflow", href: "#workflow" },
    { name: "Testimonial", href: "#testimoni" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Branded Logo Pill */}
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hover:drop-shadow-[0_0_20px_rgba(161,255,0,0.6)] transition-all duration-300"
        >
          <motion.div 
            className="relative h-10 sm:h-12 w-auto flex items-center justify-center"
            whileHover={{ rotate: [0, -5, 5, -2, 0] }}
            transition={{ duration: 0.4 }}
          >
            {/* User's uploaded logo image */}
            <img 
              src="/logo.png" 
              alt="SkillLoom Logo" 
              className="h-full w-auto object-contain transition-all duration-300"
            />
          </motion.div>
        </motion.a>

        {/* Center: Desktop Navigation Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-full shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-xs lg:text-sm font-semibold text-[#A1FF00] rounded-full hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              {link.name}
            </a>
          ))}
        </motion.div>

        {/* Right: Auth Action Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center gap-3"
        >
          <a
            href="/auth"
            className="group relative inline-flex items-center gap-2 border border-white text-white rounded-full px-5 py-2 text-sm font-bold hover:bg-white hover:text-[#0B38E6] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <span>Masuk / Daftar</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 max-w-7xl mx-auto bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-semibold text-white/90 rounded-2xl hover:bg-white/10 hover:text-[#A1FF00] transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 mt-1">
                <a
                  href="#auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#A1FF00] text-slate-950 font-bold py-3 px-5 rounded-2xl hover:bg-[#8ee600] transition-colors"
                >
                  <span>Masuk / Daftar Sekarang</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
