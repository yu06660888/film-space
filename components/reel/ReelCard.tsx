"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { posterUrl } from "@/lib/tmdb";

interface ReelCardProps {
  film: {
    id: string;
    title: string;
    posterPath: string | null;
    sessionCount: number;
  };
  positionIndex: number; // -2, -1, 0, 1, 2
  onClick: () => void;
}

// 3D transform parameters for each position
const POSITION_CONFIG: Record<
  number,
  {
    rotateY: number;
    translateX: number;
    translateZ: number;
    scale: number;
    opacity: number;
    brightness: number;
    zIndex: number;
  }
> = {
  "-2": { rotateY: 55, translateX: -460, translateZ: -280, scale: 0.65, opacity: 0.35, brightness: 0.4, zIndex: 1 },
  "-1": { rotateY: 38, translateX: -260, translateZ: -120, scale: 0.82, opacity: 0.65, brightness: 0.7, zIndex: 2 },
  "0":  { rotateY: 0,  translateX: 0,    translateZ: 0,    scale: 1.0,  opacity: 1.0,  brightness: 1.0, zIndex: 5 },
  "1":  { rotateY: -38,translateX: 260,  translateZ: -120, scale: 0.82, opacity: 0.65, brightness: 0.7, zIndex: 2 },
  "2":  { rotateY: -55,translateX: 460,  translateZ: -280, scale: 0.65, opacity: 0.35, brightness: 0.4, zIndex: 1 },
};

function SprocketRow() {
  return (
    <div className="flex items-center justify-around px-2 py-1.5 bg-black/40">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="w-[10px] h-[8px] rounded-[2px] bg-gray-900/80 border border-gray-700/60"
        />
      ))}
    </div>
  );
}

export function ReelCard({ film, positionIndex, onClick }: ReelCardProps) {
  const clampedIdx = Math.max(-2, Math.min(2, positionIndex));
  const cfg = POSITION_CONFIG[clampedIdx] ?? POSITION_CONFIG["2"];
  const isFocus = positionIndex === 0;

  return (
    <motion.div
      onClick={isFocus ? onClick : undefined}
      animate={{
        rotateY: cfg.rotateY,
        x: cfg.translateX,
        z: cfg.translateZ,
        scale: cfg.scale,
        opacity: cfg.opacity,
        filter: `brightness(${cfg.brightness})`,
        zIndex: cfg.zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
        mass: 0.8,
      }}
      style={{ zIndex: cfg.zIndex, transformStyle: "preserve-3d" }}
      className={`absolute w-[220px] cursor-pointer ${isFocus ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
        {/* Top sprocket row */}
        <SprocketRow />

        {/* Poster */}
        <div className="relative aspect-[2/3] bg-gray-900">
          <Image
            src={posterUrl(film.posterPath, "w500")}
            alt={film.title}
            fill
            sizes="220px"
            className="object-cover"
            unoptimized={!!film.posterPath?.includes("image.tmdb.org")}
          />
        </div>

        {/* Bottom sprocket row */}
        <SprocketRow />

        {/* N-刷 badge — only shown when sessionCount > 0 */}
        {film.sessionCount > 0 && (
          <div className="absolute top-[20px] right-2 z-10">
            <div className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/20">
              <span className="text-white text-[10px] font-bold tracking-wider font-mono">
                {film.sessionCount > 1 ? `×${film.sessionCount}` : "×1"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Focus ring glow */}
      {isFocus && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 pointer-events-none" />
      )}
    </motion.div>
  );
}
