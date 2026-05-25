import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import {
  DEFAULT_PHOTO_CATEGORY,
  normalizePhotoCategory,
  type PhotoCategory,
  type PhotoRecord,
} from "./photos";

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
  filename?: string;
  tags?: string[];
  context?: {
    custom?: Record<string, string>;
  };
};

function cleanContextValue(value: string | undefined): string {
  return (value ?? "").replace(/[=|]/g, " ").trim();
}

function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "photo"
  );
}

function titleFromPublicId(publicId: string): string | undefined {
  const filename = publicId.split("/").at(-1) ?? "";
  const withoutSuffix = filename.replace(/-[a-z0-9]{6,}$/i, "");

  if (!withoutSuffix || isUnhelpfulTitle(withoutSuffix)) {
    return undefined;
  }

  return withoutSuffix
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getFallbackTitle(category: PhotoCategory, resource: CloudinaryResource) {
  const publicIdTitle = titleFromPublicId(resource.public_id);

  if (publicIdTitle) {
    return publicIdTitle;
  }

  const filename = resource.filename?.replace(/[-_]+/g, " ").trim();

  if (filename && !isUnhelpfulTitle(filename)) {
    return filename.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return `${category} Photo`;
}

function isUnhelpfulTitle(title: string): boolean {
  const normalized = title.trim();

  return (
    normalized.length === 0 ||
    /^[a-z0-9]{8,}$/i.test(normalized) ||
    /^file\s+[a-z0-9]{4,}$/i.test(normalized) ||
    /^image\s+\d+$/i.test(normalized) ||
    /^img[_\s-]?\d+$/i.test(normalized)
  );
}

function getCategoryFromResource(resource: CloudinaryResource): PhotoCategory {
  const contextCategory = resource.context?.custom?.category;

  if (contextCategory) {
    return normalizePhotoCategory(contextCategory);
  }

  const tagCategory = resource.tags
    ?.find((tag) => tag.startsWith("category-"))
    ?.replace("category-", "");

  return tagCategory
    ? normalizePhotoCategory(tagCategory)
    : DEFAULT_PHOTO_CATEGORY;
}

export async function uploadPhotoToCloudinary(
  file: File,
  metadata: UploadMetadata,
): Promise<UploadApiResponse> {
  if (!hasCloudinaryConfig()) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeTitle = cleanContextValue(metadata.title) || `${metadata.category} Photo`;
  const uniqueSuffix = Math.random().toString(36).slice(2, 8);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER ?? "aviation-portfolio",
        resource_type: "image",
        public_id: `${slugifyTitle(safeTitle)}-${uniqueSuffix}`,
        display_name: safeTitle,
        use_filename: false,
        unique_filename: false,
        context: [
          `title=${safeTitle}`,
          `caption=${cleanContextValue(metadata.caption)}`,
          `category=${metadata.category}`,
          `camera=${cleanContextValue(metadata.camera)}`,
          `location=${cleanContextValue(metadata.location)}`,
          `isFeatured=${String(metadata.isFeatured)}`,
          `isPublished=${String(metadata.isPublished)}`,
        ].join("|"),
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
    .with_field("tags")
    .sort_by("created_at", "desc")
    .max_results(200)
    .execute();

  return ((result.resources ?? []) as CloudinaryResource[]).map((resource) => {
    const context = resource.context?.custom ?? {};
    const category = getCategoryFromResource(resource);
    const createdAt = new Date(resource.created_at);

    return {
      id: resource.public_id,
      title:
        cleanContextValue(context.title) &&
        !isUnhelpfulTitle(cleanContextValue(context.title))
          ? cleanContextValue(context.title)
          : getFallbackTitle(category, resource),
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
