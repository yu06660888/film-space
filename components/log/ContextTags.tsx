"use client";

import { cn } from "@/lib/utils";
import {
  Mood, WatchLocation, Companion, Device,
  MOOD_LABELS, LOCATION_LABELS, COMPANION_LABELS, DEVICE_LABELS,
} from "@/types";

interface TagGroupProps<T extends string> {
  label: string;
  options: Record<T, string>;
  value: T | null;
  onChange: (v: T | null) => void;
}

function TagGroup<T extends string>({ label, options, value, onChange }: TagGroupProps<T>) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap gap-2">
        {(Object.entries(options) as [T, string][]).map(([key, display]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(value === key ? null : key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm transition-all",
              value === key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {display}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ContextTagsValue {
  mood: Mood | null;
  location: WatchLocation | null;
  companion: Companion | null;
  device: Device | null;
}

interface ContextTagsProps {
  value: ContextTagsValue;
  onChange: (v: ContextTagsValue) => void;
}

export function ContextTags({ value, onChange }: ContextTagsProps) {
  return (
    <div className="space-y-5">
      <TagGroup
        label="此刻心情"
        options={MOOD_LABELS}
        value={value.mood}
        onChange={(mood) => onChange({ ...value, mood })}
      />
      <TagGroup
        label="观看地点"
        options={LOCATION_LABELS}
        value={value.location}
        onChange={(location) => onChange({ ...value, location })}
      />
      <TagGroup
        label="观影伙伴"
        options={COMPANION_LABELS}
        value={value.companion}
        onChange={(companion) => onChange({ ...value, companion })}
      />
      <TagGroup
        label="观看设备"
        options={DEVICE_LABELS}
        value={value.device}
        onChange={(device) => onChange({ ...value, device })}
      />
    </div>
  );
}
