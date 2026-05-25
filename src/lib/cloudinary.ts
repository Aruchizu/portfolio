import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import type { PhotoCategory, PhotoRecord } from "./photos";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function hasCloudinaryConfig(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

type UploadMetadata = {
  title: string;
  caption: string;
  category: PhotoCategory;
  camera?: string;
  location?: string;
  isFeatured: boolean;
  isPublished: boolean;
};

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  created_at: string;
  context?: {
    custom?: Record<string, string>;
  };
};

export async function uploadPhotoToCloudinary(
  file: File,
  metadata: UploadMetadata,
): Promise<UploadApiResponse> {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER ?? "aviation-portfolio",
        resource_type: "image",
        context: {
          title: metadata.title,
          caption: metadata.caption,
          category: metadata.category,
          camera: metadata.camera ?? "",
          location: metadata.location ?? "",
          isFeatured: String(metadata.isFeatured),
          isPublished: String(metadata.isPublished),
        },
        tags: [
          "portfolio-photo",
          `category-${metadata.category.toLowerCase()}`,
          metadata.isFeatured ? "featured" : "not-featured",
          metadata.isPublished ? "published" : "draft",
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(publicId: string): Promise<void> {
  if (!hasCloudinaryConfig()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export async function getCloudinaryPhotos(): Promise<PhotoRecord[]> {
  if (!hasCloudinaryConfig()) {
    return [];
  }

  const folder = process.env.CLOUDINARY_FOLDER ?? "aviation-portfolio";
  const result = await cloudinary.search
    .expression(`folder:${folder}/* AND tags=portfolio-photo`)
    .with_field("context")
    .sort_by("created_at", "desc")
    .max_results(200)
    .execute();

  return ((result.resources ?? []) as CloudinaryResource[]).map((resource) => {
    const context = resource.context?.custom ?? {};
    const category = (context.category || "Aviation") as PhotoCategory;
    const createdAt = new Date(resource.created_at);

    return {
      id: resource.public_id,
      title: context.title || resource.public_id.split("/").at(-1) || "Photo",
      caption: context.caption || "",
      category,
      imageUrl: resource.secure_url,
      cloudinaryPublicId: resource.public_id,
      width: resource.width,
      height: resource.height,
      camera: context.camera || undefined,
      location: context.location || undefined,
      isFeatured: context.isFeatured === "true",
      isPublished: context.isPublished !== "false",
      createdAt,
      updatedAt: createdAt,
    };
  });
}
