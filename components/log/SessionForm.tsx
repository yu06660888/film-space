"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ContextTags } from "./ContextTags";
import { FilmSearch } from "./FilmSearch";
import { Mood, WatchLocation, Companion, Device } from "@/types";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SessionFormProps {
  initialFilmId?: string;
  shelfFilms?: ShelfFilm[];
}

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const filled = v <= (hover || value);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(value === v ? 0 : v)}
            onMouseEnter={() => setHover(v)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
          >
            <Star
              size={22}
              className={cn(
                "transition-colors",
                filled ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export function SessionForm({ initialFilmId, shelfFilms = [] }: SessionFormProps) {
  const router = useRouter();
  const initialFilm = initialFilmId
    ? shelfFilms.find((f) => f.id === initialFilmId)
    : undefined;

  const [selectedFilm, setSelectedFilm] = useState<SelectedFilm | null>(
    initialFilm
      ? { localId: initialFilm.id, title: initialFilm.title, posterPath: initialFilm.posterPath, year: initialFilm.year ?? undefined }
      : null
  );
  const [context, setContext] = useState({
    mood: null as Mood | null,
    location: null as WatchLocation | null,
    companion: null as Companion | null,
    device: null as Device | null,
  });
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [watchedAt, setWatchedAt] = useState(new Date().toISOString().slice(0, 10));

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFilm) return;
    setSubmitting(true);

    try {
      // Step 1: Ensure film exists in DB
      let filmId = selectedFilm.localId;

      if (!filmId) {
        const filmRes = await fetch("/api/films", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tmdbId: selectedFilm.tmdbId,
            title: selectedFilm.title,
            originalTitle: selectedFilm.originalTitle,
            posterPath: selectedFilm.posterPath,
            year: selectedFilm.year,
            overview: selectedFilm.overview,
          }),
        });
        const film = await filmRes.json();
        filmId = film.id;
      }

      // Step 2: Upload photo if provided
      let photoPath: string | undefined;
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        photoPath = uploadData.path;
      }

      // Step 3: Create watch session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filmId,
          watchedAt: new Date(watchedAt).toISOString(),
          mood: context.mood,
          location: context.location,
          companion: context.companion,
          device: context.device,
          notes: notes.trim() || undefined,
          rating: rating > 0 ? rating : undefined,
          photoPath,
        }),
      });

      const session = await sessionRes.json();
      router.push(`/film/${filmId}`);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Film selection */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">选择电影</h2>
        <FilmSearch
          onSelect={setSelectedFilm}
          selected={selectedFilm}
          shelfFilms={shelfFilms}
        />
      </section>

      {/* Date */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">观看日期</h2>
        <input
          type="date"
          value={watchedAt}
          onChange={(e) => setWatchedAt(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className="px-4 py-3 rounded-xl bg-gray-100 border-0 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all"
        />
      </section>

      {/* Rating */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">评分</h2>
        <StarRatingInput value={rating} onChange={setRating} />
        {rating > 0 && (
          <button type="button" onClick={() => setRating(0)} className="mt-1.5 text-xs text-gray-400 hover:text-gray-600">
            清除评分
          </button>
        )}
      </section>

      {/* Context tags */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">此次观影的氛围</h2>
        <ContextTags value={context} onChange={setContext} />
      </section>

      {/* Photo upload */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">氛围照片 <span className="text-gray-400 font-normal text-sm">（可选）</span></h2>
        {photoPreview ? (
          <div className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden bg-gray-100">
            <Image src={photoPreview} alt="preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => { setPhoto(null); setPhotoPreview(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 w-fit cursor-pointer px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-600">
            <Upload size={15} />
            上传照片
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </label>
        )}
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">感悟 <span className="text-gray-400 font-normal text-sm">（可选）</span></h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="写下此刻的感受，不设字数限制..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 border-0 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-900/20 focus:bg-white transition-all resize-none leading-relaxed"
        />
      </section>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedFilm || submitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              保存中...
            </>
          ) : (
            "保存记录"
          )}
        </button>
      </div>
    </form>
  );
}
