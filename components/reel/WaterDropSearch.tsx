"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { posterUrl } from "@/lib/tmdb";
import { Search, Loader2 } from "lucide-react";

interface TMDBResult {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
}

interface WaterDropSearchProps {
  onSelect: (movie: TMDBResult) => void;
}

export function WaterDropSearch({ onSelect }: WaterDropSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show on keypress or scroll
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        setVisible(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results?.slice(0, 6) ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  function handleSelect(movie: TMDBResult) {
    onSelect(movie);
    setQuery("");
    setResults([]);
    setVisible(false);
  }

  return (
    <>
      {/* Trigger button (always visible, minimal) */}
      <button
        onClick={() => { setVisible(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-sm hover:bg-white/15 transition-all"
      >
        <Search size={13} />
        搜索电影
      </button>

      <AnimatePresence>
        {visible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setVisible(false); setQuery(""); setResults([]); }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Search panel — drops from top */}
            <motion.div
              initial={{ y: -60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  {loading ? (
                    <Loader2 size={16} className="text-white/50 animate-spin flex-shrink-0" />
                  ) : (
                    <Search size={16} className="text-white/50 flex-shrink-0" />
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setVisible(false)}
                    placeholder="输入电影名称..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
                    autoComplete="off"
                  />
                </div>

                {/* Results */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      {results.map((movie) => {
                        const year = movie.release_date?.split("-")[0];
                        return (
                          <button
                            key={movie.id}
                            onClick={() => handleSelect(movie)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                          >
                            <div className="relative w-8 h-12 rounded-md overflow-hidden bg-white/5 flex-shrink-0">
                              <Image
                                src={posterUrl(movie.poster_path, "w185")}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 text-sm font-medium truncate">
                                {movie.title}
                              </p>
                              {movie.original_title !== movie.title && (
                                <p className="text-white/40 text-xs truncate">{movie.original_title}</p>
                              )}
                              {year && <p className="text-white/30 text-xs">{year}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
