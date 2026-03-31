import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const film = await db.film.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { watchedAt: "asc" },
      },
      _count: { select: { sessions: true } },
    },
  });

  if (!film) {
    return NextResponse.json({ error: "Film not found" }, { status: 404 });
  }

  return NextResponse.json(film);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.film.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
