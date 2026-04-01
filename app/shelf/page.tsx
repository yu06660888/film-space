import { db } from "@/lib/db";
import { FilmGrid } from "@/components/shelf/FilmGrid";
import { Film } from "@/types";

export const dynamic = "force-dynamic";

export default async function ShelfPage() {
  const films = await db.film.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { sessions: true } },
      sessions: {
        orderBy: { watchedAt: "desc" },
        take: 1,
        select: { watchedAt: true, rating: true },
      },
    },
  });

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            我的书架
          </h1>
          {films.length > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {films.length} 部作品
            </p>
          )}
        </div>
        <FilmGrid films={films as unknown as Film[]} />
      </div>
    </main>
  );
}
