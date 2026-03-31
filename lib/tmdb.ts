export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
  vote_average: number;
}

export interface TMDBSearchResponse {
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
}

export interface TMDBCredits {
  crew: Array<{
    job: string;
    name: string;
  }>;
}

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function searchMovies(
  query: string,
  language = "zh-CN"
): Promise<TMDBMovie[]> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY is not configured");

  const url = `${TMDB_BASE}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=${language}&include_adult=false`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB search failed: ${res.statusText}`);

  const data: TMDBSearchResponse = await res.json();
  return data.results;
}

export async function getMovieDetails(
  tmdbId: number,
  language = "zh-CN"
): Promise<TMDBMovie & { credits?: TMDBCredits }> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error("TMDB_API_KEY is not configured");

  const url = `${TMDB_BASE}/movie/${tmdbId}?api_key=${apiKey}&language=${language}&append_to_response=credits`;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`TMDB details failed: ${res.statusText}`);

  return res.json();
}

export function extractDirector(credits?: TMDBCredits): string | undefined {
  return credits?.crew.find((p) => p.job === "Director")?.name;
}
