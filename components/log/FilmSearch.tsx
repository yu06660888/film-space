"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Loader2, Check } from "lucide-react";
import { getPosterUrl } from "@/lib/utils";

interface TMDBResult {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface ShelfFilm {
  id: string;
  title: string;
  posterPath: string | null;
  year: number | null;
  tmdbId: number | null;
}

interface SelectedFilm {
  localId?: string;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  posterPath?: string | null;
  year?: number;
  overview?: string;
}

interface FilmSearchProps {
  onSelect: (film: SelectedFilm) => void;
  selected?: SelectedFilm | null;
  shelfFilms?: ShelfFilm[];
}

export function FilmSearch({ onSelect, selected, shelfFilms = [] }: FilmSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length < 1) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  if (selected) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-200">
        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <Image
            src={getPosterUrl(selected.posterPath)}
            alt={selected.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{selected.title}</p>
          {selected.year && <p className="text-xs text-gray-400 mt-0.5">{selected.year}</p>}
        </div>
        <button
          onClick={() => onSelect(null as unknown as SelectedFilm)}
          className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
        >
          更换
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Shelf films */}
      {shelfFilms.length > 0 && !query && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">书架中的电影</p>
          <div className="flex gap-2 flex-wrap">
            {shelfFilms.slice(0, 8).map((film) => (
              <button
                key={film.id}
                onClick={() =>
                  onSelect({
                    localId: film.id,
                    tmdbId: film.tmdbId ?? undefined,
                    title: film.title,
                    posterPath: film.posterPath,
                    year: film.year ?? undefined,
                  })
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-700"
              >
                {film.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="搜索电影名称..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-0 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900/20 focus:bg-white outline-none transition-all"
        />
        {loading && (
          <Loader2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden z-50 max-h-72 overflow-y-auto">
          {results.slice(0, 8).map((movie) => {
            const year = movie.release_date?.split("-")[0];
            return (
              <button
                key={movie.id}
                onMouseDown={() => {
                  onSelect({
                    tmdbId: movie.id,
                    title: movie.title,
                    originalTitle: movie.original_title,
                    posterPath: movie.poster_path,
                    year: year ? parseInt(year) : undefined,
                    overview: movie.overview,
                  });
                  setQuery("");
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative w-8 h-11 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={getPosterUrl(movie.poster_path, "w185")}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{movie.title}</p>
                  {movie.original_title !== movie.title && (
                    <p className="text-xs text-gray-400 truncate">{movie.original_title}</p>
                  )}
                  {year && <p className="text-xs text-gray-400">{year}</p>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
