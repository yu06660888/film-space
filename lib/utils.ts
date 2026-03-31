import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getWatchLabel(watchNumber: number): string {
  if (watchNumber === 1) return "初次观影";
  if (watchNumber === 2) return "第二刷";
  if (watchNumber === 3) return "第三刷";
  return `第 ${watchNumber} 刷`;
}

export function getPosterUrl(
  posterPath: string | null | undefined,
  size: "w185" | "w342" | "w500" | "original" = "w342"
): string {
  if (!posterPath) return "/placeholder-poster.svg";
  if (posterPath.startsWith("/uploads/")) return posterPath;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
