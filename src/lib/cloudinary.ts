import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

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

export async function uploadPhotoToCloudinary(
  file: File,
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
