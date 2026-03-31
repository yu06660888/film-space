export interface Film {
  id: string;
  tmdbId?: number | null;
  title: string;
  originalTitle?: string | null;
  posterPath?: string | null;
  year?: number | null;
  director?: string | null;
  overview?: string | null;
  createdAt: Date | string;
  sessions?: WatchSession[];
  _count?: { sessions: number };
}

export interface WatchSession {
  id: string;
  filmId: string;
  film?: Film;
  watchNumber: number;
  watchedAt: Date | string;
  mood?: string | null;
  location?: string | null;
  companion?: string | null;
  device?: string | null;
  photoPath?: string | null;
  notes?: string | null;
  rating?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type Mood =
  | "happy"
  | "melancholy"
  | "excited"
  | "calm"
  | "nostalgic"
  | "inspired"
  | "tense"
  | "moved";

export type WatchLocation = "home" | "cinema" | "outdoor" | "travel" | "other";

export type Companion = "alone" | "partner" | "friends" | "family";

export type Device =
  | "macbook"
  | "ipad"
  | "projector"
  | "tv"
  | "cinema"
  | "phone";

export const MOOD_LABELS: Record<Mood, string> = {
  happy: "开心",
  melancholy: "忧郁",
  excited: "兴奋",
  calm: "平静",
  nostalgic: "怀念",
  inspired: "受到启发",
  tense: "紧张",
  moved: "感动",
};

export const LOCATION_LABELS: Record<WatchLocation, string> = {
  home: "在家",
  cinema: "电影院",
  outdoor: "户外",
  travel: "旅途中",
  other: "其他",
};

export const COMPANION_LABELS: Record<Companion, string> = {
  alone: "独自",
  partner: "与伴侣",
  friends: "与朋友",
  family: "与家人",
};

export const DEVICE_LABELS: Record<Device, string> = {
  macbook: "MacBook",
  ipad: "iPad",
  projector: "投影仪",
  tv: "电视",
  cinema: "电影院银幕",
  phone: "手机",
};
