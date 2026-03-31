"use client";

import { motion } from "framer-motion";
import { FilmCard } from "./FilmCard";
import { Film } from "@/types";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface FilmGridProps {
  films: (Film & { _count?: { sessions: number } })[];
}

export function FilmGrid({ films }: FilmGridProps) {
  if (films.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <BookOpen className="text-gray-400" size={28} />
        </div>
        <p className="text-gray-900 font-medium">你的书架还是空的</p>
        <p className="text-gray-400 text-sm mt-1">开始记录你的第一次观影体验</p>
        <Link
          href="/log"
          className="mt-6 px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
        >
          记录第一部电影
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
      {films.map((film, i) => (
        <motion.div
          key={film.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <FilmCard film={film} />
        </motion.div>
      ))}
    </div>
  );
}
