import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { authOptions } from "@/lib/auth";
import { hasCloudinaryConfig, uploadPhotoToCloudinary } from "@/lib/cloudinary";
import { hasMongoConfig } from "@/lib/mongodb";
import { createPhoto } from "@/lib/photo-service";
import { parsePhotoPayload } from "@/lib/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!hasMongoConfig() || !hasCloudinaryConfig()) {
    return NextResponse.json(
      {
        error:
          "MONGODB_URI and Cloudinary environment variables are required for uploads.",
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

    const upload = await uploadPhotoToCloudinary(file);
    const payload = parsePhotoPayload({
      title: formData.get("title"),
      caption: formData.get("caption") ?? "",
      category: formData.get("category"),
      camera: formData.get("camera") ?? "",
      location: formData.get("location") ?? "",
      isFeatured: formData.has("isFeatured"),
      isPublished: formData.has("isPublished"),
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
