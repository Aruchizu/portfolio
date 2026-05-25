import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { deletePhoto } from "@/lib/photo-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deletePhoto(id);

  if (!deleted) {
    return NextResponse.json({ deleted: true });
  }

  await deleteCloudinaryAsset(deleted.cloudinaryPublicId);

  return NextResponse.json({ deleted: true });
}
