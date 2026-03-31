"use client";

import { WatchSession } from "@/types";
import { SessionCard } from "./SessionCard";
import Link from "next/link";
import { Plus } from "lucide-react";

interface SessionTimelineProps {
  sessions: WatchSession[];
  filmId: string;
}

export function SessionTimeline({ sessions, filmId }: SessionTimelineProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">还没有观影记录</p>
        <Link
          href={`/log?filmId=${filmId}`}
          className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
        >
          <Plus size={14} />
          添加第一次观影记录
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1.5 top-6 bottom-6 w-px bg-gray-200" />

      <div className="space-y-6">
        {sessions.map((session, i) => (
          <SessionCard key={session.id} session={session} index={i} />
        ))}
      </div>
    </div>
  );
}
