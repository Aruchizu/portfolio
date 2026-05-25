import { z } from "zod";

export const PHOTO_CATEGORIES = ["Aviation", "Landscape", "Cars"] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

export type PhotoRecord = {
  id: string;
  title: string;
  caption: string;
  category: PhotoCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  camera?: string;
  location?: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const photoPayloadSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  caption: z.string().trim().max(500).default(""),
  category: z.enum(PHOTO_CATEGORIES),
  imageUrl: z.string().url(),
  cloudinaryPublicId: z.string().trim().min(1),
  width: z.coerce.number().int().positive(),
  height: z.coerce.number().int().positive(),
  camera: z.string().trim().max(80).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
});

export type PhotoPayload = z.infer<typeof photoPayloadSchema>;

export function parsePhotoPayload(payload: unknown): PhotoPayload {
  const parsed = photoPayloadSchema.parse(payload);

  return {
    ...parsed,
    caption: parsed.caption ?? "",
    camera: parsed.camera || undefined,
    location: parsed.location || undefined,
  };
}

export function getPublicPhotos(photos: PhotoRecord[]): PhotoRecord[] {
  return photos
    .filter((photo) => photo.isPublished)
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    });
}

export function getCategoryCount(
  photos: PhotoRecord[],
  category: PhotoCategory,
): number {
  return photos.filter((photo) => photo.category === category).length;
}
