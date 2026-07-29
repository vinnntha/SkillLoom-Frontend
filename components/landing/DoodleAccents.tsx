"use client";

import React from "react";
import { motion } from "framer-motion";

export const NeonDoodleArrow1: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      viewBox="0 0 160 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-28 sm:w-36 md:w-44 text-[#A1FF00] filter drop-shadow-[0_0_8px_rgba(161,255,0,0.6)] ${className}`}
    >
      {/* Curved Doodle Path */}
      <path
        d="M10 20 C 50 5, 110 15, 140 70"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        fill="none"
      />
      {/* Arrow Head */}
      <path
        d="M125 65 L 142 72 L 140 52"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Little accent star */}
      <path
        d="M25 45 L 30 50 M 30 45 L 25 50"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </motion.svg>
  );
};

export const NeonDoodleArrow2: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-24 sm:w-32 text-[#A1FF00] filter drop-shadow-[0_0_8px_rgba(161,255,0,0.6)] ${className}`}
    >
      {/* Curved Arrow Pointing Left */}
      <path
        d="M100 10 C 70 60, 40 40, 20 90"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrowhead */}
      <path
        d="M15 75 L 18 92 L 35 88"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </motion.svg>
  );
};

export const NeonHighlightTag: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span className="relative inline-block px-3 py-1 font-mono font-bold text-slate-950 bg-[#A1FF00] rounded-md shadow-md transform -rotate-1 border border-slate-900">
      {text}
    </span>
  );
};
