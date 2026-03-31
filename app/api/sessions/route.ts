import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { filmId, watchedAt, mood, location, companion, device, notes, rating } =
    body;

  if (!filmId) {
    return NextResponse.json({ error: "filmId is required" }, { status: 400 });
  }

  // Auto-calculate watch number
  const existingCount = await db.watchSession.count({ where: { filmId } });
  const watchNumber = existingCount + 1;

  const session = await db.watchSession.create({
    data: {
      filmId,
      watchNumber,
      watchedAt: watchedAt ? new Date(watchedAt) : new Date(),
      mood,
      location,
      companion,
      device,
      notes,
      rating: rating != null ? Number(rating) : undefined,
    },
    include: { film: true },
  });

  return NextResponse.json(session, { status: 201 });
}
