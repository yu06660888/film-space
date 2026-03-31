import Image from "next/image";
import { Film } from "@/types";
import { getPosterUrl } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FilmHeroProps {
  film: Film & { _count?: { sessions: number } };
}

export function FilmHero({ film }: FilmHeroProps) {
  const posterUrl = getPosterUrl(film.posterPath, "w500");
  const sessionCount = film._count?.sessions ?? 0;

  return (
    <div className="relative">
      {/* Blurred background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={posterUrl}
          alt=""
          fill
          className="object-cover scale-110 blur-2xl opacity-20"
          unoptimized={posterUrl.includes("image.tmdb.org")}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-10">
        {/* Back button */}
        <Link
          href="/shelf"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          书架
        </Link>

        <div className="flex gap-8 items-start">
          {/* Poster */}
          <div className="relative w-28 sm:w-36 aspect-[2/3] flex-shrink-0 rounded-xl overflow-hidden shadow-xl ring-1 ring-black/10">
            <Image
              src={posterUrl}
              alt={film.title}
              fill
              className="object-cover"
              unoptimized={posterUrl.includes("image.tmdb.org")}
            />
          </div>

          {/* Info */}
          <div className="flex-1 pt-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
              {film.title}
            </h1>
            {film.originalTitle && film.originalTitle !== film.title && (
              <p className="text-sm text-gray-400 mt-1">{film.originalTitle}</p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {film.year && (
                <span className="text-sm text-gray-500">{film.year}</span>
              )}
              {film.director && (
                <span className="text-sm text-gray-500">{film.director} 导演</span>
              )}
            </div>

            {film.overview && (
              <p className="text-sm text-gray-500 mt-3 line-clamp-3 leading-relaxed max-w-lg">
                {film.overview}
              </p>
            )}

            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                已观看 {sessionCount} 次
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
