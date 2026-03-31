export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FilmHero } from "@/components/timeline/FilmHero";
import { SessionTimeline } from "@/components/timeline/SessionTimeline";
import { Film, WatchSession } from "@/types";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FilmPage({ params }: Props) {
  const { id } = await params;

  const film = await db.film.findUnique({
    where: { id },
    include: {
      sessions: { orderBy: { watchedAt: "asc" } },
      _count: { select: { sessions: true } },
    },
  });

  if (!film) notFound();

  return (
    <main className="min-h-screen pt-14">
      <FilmHero film={film as unknown as Film & { _count: { sessions: number } }} />

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900">观影记录</h2>
          <Link
            href={`/log?filmId=${film.id}`}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
          >
            <Plus size={14} />
            新增记录
          </Link>
        </div>

        <SessionTimeline
          sessions={film.sessions as unknown as WatchSession[]}
          filmId={film.id}
        />
      </div>
    </main>
  );
}
