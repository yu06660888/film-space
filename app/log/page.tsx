export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { SessionForm } from "@/components/log/SessionForm";

interface Props {
  searchParams: Promise<{ filmId?: string }>;
}

export default async function LogPage({ searchParams }: Props) {
  const { filmId } = await searchParams;

  const shelfFilms = await db.film.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, posterPath: true, year: true, tmdbId: true },
  });

  return (
    <main className="min-h-screen pt-14">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            记录观影
          </h1>
          <p className="text-sm text-gray-400 mt-1">记录此刻的感受</p>
        </div>

        <SessionForm
          initialFilmId={filmId}
          shelfFilms={shelfFilms}
        />
      </div>
    </main>
  );
}
