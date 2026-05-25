import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { hasCloudinaryConfig, uploadPhotoToCloudinary } from "@/lib/cloudinary";
import { createPhoto } from "@/lib/photo-service";
import { parsePhotoPayload } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      {
        error: "Cloudinary environment variables are required for uploads.",
      },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Keep uploads under 10MB for the free Cloudinary plan." },
        { status: 400 },
      );
    }

    const metadata = {
      title: String(formData.get("title") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      category: formData.get("category"),
      camera: String(formData.get("camera") ?? "").trim() || undefined,
      location: String(formData.get("location") ?? "").trim() || undefined,
      isFeatured: formData.has("isFeatured"),
      isPublished: formData.has("isPublished"),
    };

    const upload = await uploadPhotoToCloudinary(file, {
      title: metadata.title,
      caption: metadata.caption,
      category: metadata.category as never,
      camera: metadata.camera,
      location: metadata.location,
      isFeatured: metadata.isFeatured,
      isPublished: metadata.isPublished,
    });
    const payload = parsePhotoPayload({
      ...metadata,
      imageUrl: upload.secure_url,
      cloudinaryPublicId: upload.public_id,
      width: upload.width,
      height: upload.height,
    });

    const photo = await createPhoto(payload);

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 },
    );
  }
}
