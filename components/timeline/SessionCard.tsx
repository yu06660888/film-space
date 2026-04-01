"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WatchSession } from "@/types";
import {
  MOOD_LABELS,
  LOCATION_LABELS,
  COMPANION_LABELS,
  DEVICE_LABELS,
  Mood,
  WatchLocation,
  Companion,
  Device,
} from "@/types";
import { formatDate, getWatchLabel } from "@/lib/utils";
import { Star, MapPin, Users, Monitor, Smile } from "lucide-react";

interface SessionCardProps {
  session: WatchSession;
  index: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
              ? "fill-amber-200 text-amber-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

function ContextChip({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
      <Icon size={11} className="text-gray-400" />
      {label}
    </span>
  );
}

export function SessionCard({ session, index }: SessionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative pl-8"
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-5 w-3 h-3 rounded-full bg-gray-900 ring-2 ring-white shadow" />

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-xs font-semibold">
              {getWatchLabel(session.watchNumber)}
            </span>
            <p className="text-xs text-gray-400 mt-1.5">
              {formatDate(session.watchedAt)}
            </p>
          </div>
          {session.rating != null && <StarRating rating={session.rating} />}
        </div>

        {/* Context tags */}
        {(session.mood || session.location || session.companion || session.device) && (
          <div className="flex flex-wrap gap-1.5 mb-4 items-center">
            {session.mood && (
              /^[a-zA-Z_]+$/.test(session.mood)
                ? <ContextChip icon={Smile} label={MOOD_LABELS[session.mood as Mood] ?? session.mood} />
                : <span className="text-2xl leading-none" title="感受">{session.mood}</span>
            )}
            {session.location && (
              <ContextChip
                icon={MapPin}
                label={LOCATION_LABELS[session.location as WatchLocation] ?? session.location}
              />
            )}
            {session.companion && (
              <ContextChip
                icon={Users}
                label={COMPANION_LABELS[session.companion as Companion] ?? session.companion}
              />
            )}
            {session.device && (
              <ContextChip
                icon={Monitor}
                label={DEVICE_LABELS[session.device as Device] ?? session.device}
              />
            )}
          </div>
        )}

        {/* Atmosphere photo */}
        {session.photoPath && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100">
            <Image
              src={session.photoPath}
              alt="观影氛围"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {session.notes}
          </p>
        )}
      </div>
    </motion.div>
  );
}
