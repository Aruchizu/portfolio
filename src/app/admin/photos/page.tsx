import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AdminUploadForm } from "@/components/admin-upload-form";
import { authOptions } from "@/lib/auth";
import { getAllPhotos } from "@/lib/photo-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Photo Admin",
};

export default async function AdminPhotosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const photos = await getAllPhotos();

  return (
    <main className="photo-surface min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="mono-label text-xs uppercase text-muted">
            portfolio
          </Link>
          <p className="mono-label text-xs uppercase text-austrian-red">
            admin / photos
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="mono-label text-xs uppercase text-austrian-red">
            {"// upload bay"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">
            Photo operations.
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Upload to Cloudinary, store metadata in MongoDB, and decide which
            frames are published or featured.
          </p>
        </div>
        <AdminUploadForm photos={photos} />
      </section>
    </main>
  );
}
