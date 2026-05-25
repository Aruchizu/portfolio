import type { Metadata } from "next";

import { PhotoGrid } from "@/components/photo-grid";
import { SectionLabel } from "@/components/section-label";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPhotos } from "@/lib/photo-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
};

export default async function GalleryPage() {
  const photos = await getPublishedPhotos();

  return (
    <main className="photo-surface min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <SectionLabel index="01" label="gallery manifest" />
        <div className="mb-10 max-w-4xl sm:mb-12">
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            Published frames, sorted for inspection.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Use the collection filters to move between Eroplano, Tanawin,
            Kotse, and Tao. Featured frames still power the homepage hero.
          </p>
        </div>
        <PhotoGrid photos={photos} />
      </section>
    </main>
  );
}
