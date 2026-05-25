"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  PHOTO_CATEGORIES,
  getCategoryCount,
  type PhotoCategory,
  type PhotoRecord,
} from "@/lib/photos";

type PhotoGridProps = {
  photos: PhotoRecord[];
};

export function PhotoGrid({ photos }: PhotoGridProps) {
  const [activeCategory, setActiveCategory] =
    useState<PhotoCategory>("Aviation");
  const [activePhoto, setActivePhoto] = useState<PhotoRecord | null>(null);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => photo.category === activeCategory);
  }, [activeCategory, photos]);

  const visiblePhotos = filteredPhotos.length > 0 ? filteredPhotos : photos;

  if (photos.length === 0) {
    return (
      <div className="rounded border border-dashed border-line bg-white px-5 py-12 text-center sm:px-6 sm:py-16">
        <p className="mono-label text-xs uppercase text-austrian-red">
          {"// empty gallery"}
        </p>
        <h3 className="mt-3 text-2xl font-semibold sm:text-3xl">
          No photos uploaded yet.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
          Sign in to the admin page and upload your own aviation, landscape, and
          car photos. The gallery will fill from your MongoDB and Cloudinary
          uploads.
        </p>
        <Link
          href="/admin/login"
          className="mt-7 inline-flex h-12 items-center justify-center rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        {PHOTO_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`mono-label flex h-10 shrink-0 items-center gap-2 rounded border px-4 text-xs uppercase transition ${
              activeCategory === category
                ? "border-austrian-red bg-austrian-red text-white"
                : "border-line bg-white text-muted hover:border-austrian-red hover:text-austrian-red"
            }`}
          >
            {category}
            <span className="text-[10px] opacity-70">
              {getCategoryCount(photos, category)}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePhotos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActivePhoto(photo)}
            className={`group relative min-h-72 overflow-hidden rounded text-left sm:min-h-80 ${
              index === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "33vw"}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/28 to-transparent p-5 text-white">
              <p className="mono-label mb-2 text-[11px] uppercase text-white/70">
                {photo.category}
              </p>
              <h3 className="text-2xl font-semibold">{photo.title}</h3>
              <p className="mt-2 max-w-lg text-sm text-white/76">
                {photo.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 bg-black/92 p-4 text-white sm:p-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded bg-white text-black transition hover:bg-austrian-red hover:text-white"
            aria-label="Close photo"
          >
            <X size={18} />
          </button>
          <div className="grid h-full gap-5 overflow-y-auto lg:grid-cols-[1fr_340px] lg:gap-6">
            <div className="relative min-h-[58vh] overflow-hidden rounded sm:min-h-[60vh]">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <aside className="self-end pb-8 lg:self-center">
              <p className="mono-label text-xs uppercase text-austrian-red">
                {activePhoto.category}
              </p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
                {activePhoto.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                {activePhoto.caption}
              </p>
              <dl className="mono-label mt-8 space-y-3 text-xs uppercase text-white/55">
                {activePhoto.location ? (
                  <div>
                    <dt>Location</dt>
                    <dd className="text-white">{activePhoto.location}</dd>
                  </div>
                ) : null}
                {activePhoto.camera ? (
                  <div>
                    <dt>Camera</dt>
                    <dd className="text-white">{activePhoto.camera}</dd>
                  </div>
                ) : null}
              </dl>
            </aside>
          </div>
        </div>
      ) : null}
    </div>
  );
}
