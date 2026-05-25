"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { PHOTO_CATEGORIES, type PhotoRecord } from "@/lib/photos";

type AdminUploadFormProps = {
  photos: PhotoRecord[];
};

export function AdminUploadForm({ photos }: AdminUploadFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadPhoto(formData: FormData) {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Upload failed.");
      }

      const data = await response.json();
      setFiles([]);
      setMessage(
        `${data.photos?.length ?? 1} photo${
          (data.photos?.length ?? 1) === 1 ? "" : "s"
        } uploaded and saved.`,
      );
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deletePhoto(id: string) {
    setMessage("");
    const response = await fetch(`/api/admin/photos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.error ?? "Delete failed.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <form
        action={uploadPhoto}
        className="min-w-0 rounded border border-line bg-white p-4 sm:p-5"
      >
        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setFiles(Array.from(event.dataTransfer.files));
          }}
          className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-line bg-background px-4 text-center sm:min-h-52 sm:px-6"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="mb-4 text-austrian-red" size={32} />
          <p className="font-semibold">Drop a photo here</p>
          <p className="mt-2 text-sm text-muted">
            Upload one or many JPG, PNG, or WebP files. Keep each under 10MB.
          </p>
          <input
            ref={inputRef}
            name="files"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            required
            onChange={(event) =>
              setFiles(Array.from(event.target.files ?? []))
            }
          />
          {files.length > 0 ? (
            <div className="mt-4 max-w-full space-y-1">
              <p className="mono-label text-xs uppercase text-austrian-red">
                {files.length} selected
              </p>
              <p className="truncate text-xs text-muted">
                {files
                  .slice(0, 3)
                  .map((selectedFile) => selectedFile.name)
                  .join(", ")}
                {files.length > 3 ? "..." : ""}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <input
            name="title"
            placeholder="Title or batch name"
            className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
          />
          <textarea
            name="caption"
            placeholder="Caption"
            className="min-h-28 w-full rounded border border-line p-4 outline-none focus:border-austrian-red"
          />
          <select
            name="category"
            className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
            defaultValue="Aviation"
          >
            {PHOTO_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            name="location"
            placeholder="Location (optional)"
            className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
          />
          <input
            name="camera"
            placeholder="Camera / lens (optional)"
            className="h-12 w-full rounded border border-line px-4 outline-none focus:border-austrian-red"
          />
          <label className="flex items-center gap-3 text-sm text-muted">
            <input name="isFeatured" type="checkbox" className="h-4 w-4" />
            Feature this photo
          </label>
          <label className="flex items-center gap-3 text-sm text-muted">
            <input
              name="isPublished"
              type="checkbox"
              className="h-4 w-4"
              defaultChecked
            />
            Publish immediately
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Upload size={18} />
          )}
          {files.length > 1 ? `Upload ${files.length} photos` : "Upload photo"}
        </button>
        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
      </form>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mono-label text-xs uppercase text-austrian-red">
              {"// manifest"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Current photos</h2>
          </div>
          <p className="mono-label text-xs uppercase text-muted">
            {photos.length} records
          </p>
        </div>
        <div className="divide-y divide-line rounded border border-line bg-white">
          {photos.length === 0 ? (
            <div className="px-5 py-10 text-sm leading-6 text-muted">
              No uploads yet. Use the form to add your first photo.
            </div>
          ) : null}
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="grid min-w-0 gap-4 p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="h-24 w-24 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="break-words font-semibold">{photo.title}</p>
                <p className="mono-label mt-1 text-xs uppercase text-muted">
                  {photo.category} / {photo.isPublished ? "published" : "draft"}
                  {photo.isFeatured ? " / featured" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deletePhoto(photo.id)}
                className="flex h-10 w-10 items-center justify-center rounded border border-line text-muted transition hover:border-austrian-red hover:text-austrian-red"
                aria-label={`Delete ${photo.title}`}
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
