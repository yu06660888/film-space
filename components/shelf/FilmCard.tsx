"use client";

import Link from "next/link";
import Image from "next/image";
import { Film } from "@/types";
import { getPosterUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FilmCardProps {
  film: Film & { _count?: { sessions: number } };
}

export function FilmCard({ film }: FilmCardProps) {
  const sessionCount = film._count?.sessions ?? film.sessions?.length ?? 0;
  const posterUrl = getPosterUrl(film.posterPath);

  return (
    <Link href={`/film/${film.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:shadow-lg group-hover:ring-black/10 group-hover:-translate-y-0.5">
        <Image
          src={posterUrl}
          alt={film.title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={posterUrl.includes("image.tmdb.org")}
        />

        {/* Watch count badge */}
        {sessionCount > 0 && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold">
              {sessionCount}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug">
            {film.title}
          </p>
          {film.year && (
            <p className="text-white/70 text-[10px] mt-0.5">{film.year}</p>
          )}
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-medium text-gray-900 line-clamp-1 leading-snug">
          {film.title}
        </p>
        {film.year && (
          <p className="text-xs text-gray-400 mt-0.5">{film.year}</p>
        )}
      </div>
    </Link>
  );
}
