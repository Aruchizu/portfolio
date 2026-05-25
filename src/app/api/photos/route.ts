import { NextResponse } from "next/server";

import { getPublishedPhotos } from "@/lib/photo-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const photos = await getPublishedPhotos();

  return NextResponse.json({ photos });
}
