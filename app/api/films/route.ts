import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
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
  return NextResponse.json(films);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tmdbId, title, originalTitle, posterPath, year, director, overview } =
    body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  // Check if film already exists
  if (tmdbId) {
    const existing = await db.film.findUnique({ where: { tmdbId } });
    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }
  }

  const film = await db.film.create({
    data: {
      tmdbId: tmdbId ? Number(tmdbId) : undefined,
      title,
      originalTitle,
      posterPath,
      year: year ? Number(year) : undefined,
      director,
      overview,
    },
  });

  return NextResponse.json(film, { status: 201 });
}
