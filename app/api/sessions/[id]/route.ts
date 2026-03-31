import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await db.watchSession.findUnique({
    where: { id },
    include: { film: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(session);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { watchedAt, mood, location, companion, device, notes, rating, photoPath } =
    body;

  const session = await db.watchSession.update({
    where: { id },
    data: {
      watchedAt: watchedAt ? new Date(watchedAt) : undefined,
      mood,
      location,
      companion,
      device,
      notes,
      rating: rating != null ? Number(rating) : undefined,
      photoPath,
    },
  });

  return NextResponse.json(session);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.watchSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
