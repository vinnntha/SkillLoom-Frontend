"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const CircularBadge: React.FC = () => {
  return (
    <div className="relative group cursor-pointer inline-block">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-[#A1FF00]/40 rounded-full blur-md group-hover:bg-[#A1FF00]/70 transition duration-300" />
      
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-[#A1FF00] p-1 shadow-2xl flex items-center justify-center border-2 border-slate-950">
        {/* Rotating Circular Text SVG */}
        <motion.svg
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="w-full h-full text-slate-950 font-black tracking-widest uppercase text-[10px] sm:text-[11px]"
          viewBox="0 0 100 100"
        >
          <path
            id="circlePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text className="fill-slate-950 font-extrabold tracking-[0.2em]">
            <textPath href="#circlePath" startOffset="0%">
              MULAI PROYEK • GRATIS • MULAI PROYEK • GRATIS •
            </textPath>
          </text>
        </motion.svg>

        {/* Center Diagonal Arrow Badge */}
        <div className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950 flex items-center justify-center text-[#A1FF00] group-hover:scale-110 group-hover:bg-[#0B38E6] group-hover:text-white transition-all duration-300 shadow-inner">
          <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
};
