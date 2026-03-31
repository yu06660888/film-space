const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  // Fallback to API key query param (handled per-request)
  return { "Content-Type": "application/json" };
}

function buildUrl(path: string): string {
  const base = `${TMDB_BASE}${path}`;
  if (!process.env.TMDB_ACCESS_TOKEN && process.env.TMDB_API_KEY) {
    const sep = path.includes("?") ? "&" : "?";
    return `${base}${sep}api_key=${process.env.TMDB_API_KEY}`;
  }
  return base;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
  runtime?: number | null;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
}

export interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

export async function searchMovies(
  query: string,
  language = "zh-CN"
): Promise<TMDBMovie[]> {
  const url = buildUrl(
    `/search/movie?query=${encodeURIComponent(query)}&language=${language}&include_adult=false`
  );
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB search failed: ${res.statusText}`);
  const data: TMDBSearchResponse = await res.json();
  return data.results;
}

export async function getMovieDetails(
  tmdbId: number,
  language = "zh-CN"
): Promise<TMDBMovie & { credits?: { crew: Array<{ job: string; name: string }> } }> {
  const url = buildUrl(
    `/movie/${tmdbId}?language=${language}&append_to_response=credits`
  );
  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`TMDB details failed: ${res.statusText}`);
  return res.json();
}

export function extractDirector(
  credits?: { crew: Array<{ job: string; name: string }> }
): string | undefined {
  return credits?.crew.find((p) => p.job === "Director")?.name;
}

export type PosterSize = "w185" | "w342" | "w500" | "w780" | "original";
export type BackdropSize = "w780" | "w1280" | "original";

export function posterUrl(
  path: string | null | undefined,
  size: PosterSize = "w342"
): string {
  if (!path) return "/placeholder-poster.svg";
  if (path.startsWith("/uploads/") || path.startsWith("/")) {
    if (!path.startsWith("/t/p")) return path;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function backdropUrl(
  path: string | null | undefined,
  size: BackdropSize = "w1280"
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
