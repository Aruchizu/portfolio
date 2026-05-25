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
    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one image file is required." },
        { status: 400 },
      );
    }

    if (files.length > 20) {
      return NextResponse.json(
        { error: "Upload up to 20 photos at a time." },
        { status: 400 },
      );
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image uploads are allowed." },
          { status: 400 },
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Keep each upload under 10MB for the free Cloudinary plan." },
          { status: 400 },
        );
      }
    }

    const baseTitle = String(formData.get("title") ?? "").trim();
    const metadataBase = {
      caption: String(formData.get("caption") ?? "").trim(),
      category: formData.get("category"),
      camera: String(formData.get("camera") ?? "").trim() || undefined,
      location: String(formData.get("location") ?? "").trim() || undefined,
      isFeatured: formData.has("isFeatured"),
      isPublished: formData.has("isPublished"),
    };

    const photos = [];

    for (const [index, file] of files.entries()) {
      const title =
        files.length === 1
          ? baseTitle || file.name.replace(/\.[^.]+$/, "")
          : `${baseTitle || "Aviation Photo"} ${String(index + 1).padStart(
              2,
              "0",
            )}`;

      const upload = await uploadPhotoToCloudinary(file, {
        title,
        caption: metadataBase.caption,
        category: metadataBase.category as never,
        camera: metadataBase.camera,
        location: metadataBase.location,
        isFeatured: metadataBase.isFeatured && index === 0,
        isPublished: metadataBase.isPublished,
      });

      const payload = parsePhotoPayload({
        ...metadataBase,
        title,
        isFeatured: metadataBase.isFeatured && index === 0,
        imageUrl: upload.secure_url,
        cloudinaryPublicId: upload.public_id,
        width: upload.width,
        height: upload.height,
      });

      photos.push(await createPhoto(payload));
    }

    return NextResponse.json({ photos }, { status: 201 });
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
