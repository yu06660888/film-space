"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { ReelCard } from "./ReelCard";
import Link from "next/link";

interface FilmItem {
  id: string;
  title: string;
  posterPath: string | null;
  sessionCount: number;
}

interface ReelCarouselProps {
  films: FilmItem[];
  onFocusedFilmChange?: (film: FilmItem | null) => void;
  onAddRecord?: (film: FilmItem) => void;
}

export function ReelCarousel({
  films,
  onFocusedFilmChange,
  onAddRecord,
}: ReelCarouselProps) {
  const [centerIdx, setCenterIdx] = useState(0);
  const dragX = useMotionValue(0);
  const DRAG_THRESHOLD = 80;

  const focusedFilm = films[centerIdx] ?? null;

  useEffect(() => {
    onFocusedFilmChange?.(focusedFilm);
  }, [centerIdx, focusedFilm, onFocusedFilmChange]);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(films.length - 1, idx));
      setCenterIdx(clamped);
    },
    [films.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(centerIdx - 1);
      if (e.key === "ArrowRight") goTo(centerIdx + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [centerIdx, goTo]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -DRAG_THRESHOLD) goTo(centerIdx + 1);
    else if (info.offset.x > DRAG_THRESHOLD) goTo(centerIdx - 1);
    dragX.set(0);
  }

  if (films.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-6xl">🎬</div>
        <p className="text-white/50 text-sm tracking-wide">还没有影片，搜索添加第一部</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full select-none">
      {/* 3D Carousel */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: dragX, perspective: "1400px", transformStyle: "preserve-3d" }}
        className="relative w-[220px] h-[360px] cursor-grab active:cursor-grabbing"
      >
        {films.map((film, i) => {
          const positionIndex = i - centerIdx;
          if (Math.abs(positionIndex) > 2) return null;
          return (
            <ReelCard
              key={film.id}
              film={film}
              positionIndex={positionIndex}
              onClick={() => {
                // already focused — no-op, let add button handle it
              }}
            />
          );
        })}
      </motion.div>

      {/* Film title (focus) */}
      <motion.div
        key={centerIdx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-white/90 text-base font-medium tracking-wide">
          {focusedFilm?.title}
        </p>
        {focusedFilm && focusedFilm.sessionCount > 0 && (
          <p className="text-white/40 text-xs mt-1">
            已看 {focusedFilm.sessionCount} 次
          </p>
        )}
      </motion.div>

      {/* Pagination dots */}
      {films.length > 1 && (
        <div className="flex gap-1.5 mt-5">
          {films.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === centerIdx
                  ? "w-4 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Action buttons */}
      {focusedFilm && (
        <div className="flex gap-3 mt-6">
          {/* View timeline */}
          <Link
            href={`/film/${focusedFilm.id}`}
            className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium hover:bg-white/20 transition-all"
          >
            查看记录
          </Link>
          {/* Add new session */}
          <button
            onClick={() => onAddRecord?.(focusedFilm)}
            className="px-4 py-2 rounded-full bg-white text-gray-900 text-xs font-semibold hover:bg-white/90 transition-all shadow-lg"
          >
            + 记录此刻
          </button>
        </div>
      )}
    </div>
  );
}
