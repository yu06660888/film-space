"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MeshBackgroundProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

// Default soft pastel palette for light background
const DEFAULT_COLORS = {
  c1: "rgba(147, 197, 253, 0.4)",
  c2: "rgba(253, 186, 186, 0.35)",
  c3: "rgba(196, 181, 253, 0.3)",
};

export function MeshBackground({
  color1 = DEFAULT_COLORS.c1,
  color2 = DEFAULT_COLORS.c2,
  color3 = DEFAULT_COLORS.c3,
}: MeshBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f5f5f7]">
      {/* Orb 1 — top left */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: color1 }}
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full blur-[120px]"
      />
      {/* Orb 2 — bottom right */}
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ background: color2 }}
        className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full blur-[100px]"
      />
      {/* Orb 3 — center */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ background: color3 }}
        className="absolute top-1/3 left-1/3 w-[40vw] h-[40vw] rounded-full blur-[80px]"
      />
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
        }}
      />
    </div>
  );
}
