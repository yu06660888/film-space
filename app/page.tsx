"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { MeshBackground } from "@/components/reel/MeshBackground";
import { ReelCarousel } from "@/components/reel/ReelCarousel";
import { WaterDropSearch } from "@/components/reel/WaterDropSearch";
import { SessionFormPanel } from "@/components/reel/SessionFormPanel";

interface FilmItem {
  id: string;
  title: string;
  posterPath: string | null;
  sessionCount: number;
}

interface TMDBResult {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  overview?: string;
}

export default function ReelPage() {
  const [films, setFilms] = useState<FilmItem[]>([]);
  const [activeFilm, setActiveFilm] = useState<FilmItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadFilms() {
    try {
      const res = await fetch("/api/films");
      const data = await res.json();
      const mapped: FilmItem[] = data.map((f: {
        id: string;
        title: string;
        posterPath?: string | null;
        _count?: { sessions: number };
      }) => ({
        id: f.id,
        title: f.title,
        posterPath: f.posterPath ?? null,
        sessionCount: f._count?.sessions ?? 0,
      }));
      setFilms(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFilms(); }, []);

  async function handleSearchSelect(movie: TMDBResult) {
    // Upsert film into DB
    const year = movie.release_date?.split("-")[0];
    const res = await fetch("/api/films", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        posterPath: movie.poster_path,
        year: year ? parseInt(year) : undefined,
        overview: movie.overview,
      }),
    });
    const film = await res.json();
    const item: FilmItem = {
      id: film.id,
      title: film.title,
      posterPath: film.posterPath ?? null,
      sessionCount: film._count?.sessions ?? 0,
    };

    setFilms((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) return prev;
      return [item, ...prev];
    });
    setActiveFilm(item);
    setShowForm(true);
  }

  function handleAddRecord(film: FilmItem) {
    setActiveFilm(film);
    setShowForm(true);
  }

  async function handleSessionSuccess(filmId: string) {
    setShowForm(false);
    setActiveFilm(null);
    await loadFilms();
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      <MeshBackground />

      {/* Search */}
      <WaterDropSearch onSelect={handleSearchSelect} />

      {/* Main reel */}
      <div className="flex-1 w-full flex items-center justify-center">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">loading...</p>
        ) : (
          <ReelCarousel
            films={films}
            onFocusedFilmChange={(film) => {
              if (!showForm) setActiveFilm(film);
            }}
            onAddRecord={handleAddRecord}
          />
        )}
      </div>

      {/* Liquid glass vignette edges */}
      <div className="pointer-events-none fixed bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#f5f5f7] to-transparent" />
      <div className="pointer-events-none fixed top-0 inset-x-0 h-16 bg-gradient-to-b from-[#f5f5f7]/60 to-transparent" />

      {/* Session form panel */}
      <AnimatePresence>
        {showForm && activeFilm && (
          <SessionFormPanel
            film={activeFilm}
            onClose={() => { setShowForm(false); setActiveFilm(null); }}
            onSuccess={handleSessionSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
