"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Sparkles, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  isOpen: boolean;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number; // duration in ms (default 4000)
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  message,
  type = "success",
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: -30, scale: 0.95, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 z-50 max-w-md w-[90%] sm:w-auto"
        >
          <div
            className={`flex items-center justify-between gap-3 px-5 py-3.5 rounded-full sm:rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white shadow-[0_15px_35px_rgba(11,56,230,0.3)] min-w-[280px] sm:min-w-[340px] ${
              type === "success"
                ? "border-l-4 border-l-[#A1FF00]"
                : type === "error"
                ? "border-l-4 border-l-rose-500"
                : "border-l-4 border-l-[#0B38E6]"
            }`}
          >
            {/* Icon Based on Toast Type */}
            <div className="flex items-center gap-2.5">
              {type === "success" && (
                <div className="w-8 h-8 rounded-full bg-[#A1FF00]/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#A1FF00]" />
                </div>
              )}
              {type === "error" && (
                <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
              )}
              {type === "info" && (
                <div className="w-8 h-8 rounded-full bg-[#0B38E6]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#A1FF00]" />
                </div>
              )}

              {/* Message Text */}
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  SkillLoom Notification
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                  {message}
                </span>
              </div>
            </div>

            {/* Manual Dismiss Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2 shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
