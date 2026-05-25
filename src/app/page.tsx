import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Download, ImagePlus, Mail } from "lucide-react";

import { PhotoGrid } from "@/components/photo-grid";
import { SectionLabel } from "@/components/section-label";
import { SiteHeader } from "@/components/site-header";
import { getPublishedPhotos } from "@/lib/photo-service";
import {
  ABOUT_SKILLS,
  CONTACT_EMAIL,
  CV_DOWNLOAD_PATH,
  PROFILE_HIGHLIGHTS,
  PROFILE_SUMMARY,
} from "@/lib/profile";

export const dynamic = "force-dynamic";

export default async function Home() {
  const photos = await getPublishedPhotos();
  const heroPhoto = photos.find((photo) => photo.isFeatured) ?? photos[0];
  const previewPhotos = photos.slice(0, 6);

  return (
    <main className="photo-surface min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.86fr_1.14fr] lg:gap-10">
        <div className="pt-4 sm:pt-8 lg:pt-10">
          <p className="mono-label text-xs uppercase text-austrian-red">
            OS 01 / Austrian visual approach
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] text-foreground sm:text-6xl lg:text-8xl">
            Oh sinta, tayo&apos;y di man itinadhana. Iyong alaala ay laging
            nasa aking memorya
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            A photography portfolio for aircraft, landscapes, and cars with a
            clean upload workflow behind the scenes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/gallery"
              className="flex h-12 items-center justify-center gap-2 rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark"
            >
              View gallery <ArrowUpRight size={17} />
            </Link>
            <Link
              href="/admin/login"
              className="flex h-12 items-center justify-center rounded border border-line bg-white px-5 font-semibold text-foreground transition hover:border-austrian-red hover:text-austrian-red"
            >
              Upload photos
            </Link>
          </div>
        </div>

        {heroPhoto ? (
          <div className="relative min-h-96 overflow-hidden rounded bg-black sm:min-h-[520px]">
            <Image
              src={heroPhoto.imageUrl}
              alt={heroPhoto.title}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent p-6 text-white sm:p-8">
              <p className="mono-label text-xs uppercase text-white/66">
                runway / featured
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {heroPhoto.title}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/72">
                {heroPhoto.caption}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded border border-dashed border-line bg-white p-6 text-center sm:min-h-[520px] sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded bg-austrian-red text-white">
              <ImagePlus size={24} />
            </div>
            <p className="mono-label mt-6 text-xs uppercase text-austrian-red">
              {"// upload bay waiting"}
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold sm:text-4xl">
              Your first photo becomes the hero.
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Sign in, upload your own shots, and publish them to fill the
              portfolio.
            </p>
            <Link
              href="/admin/login"
              className="mt-7 flex h-12 items-center justify-center rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark"
            >
              Open login
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <SectionLabel index="02" label="selected frames" />
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-semibold sm:text-5xl">
              Gallery-first by default.
            </h2>
            <p className="mt-4 max-w-2xl text-muted">
              Filter the work by collection, open a full-screen frame, and let
              the strongest images do the talking.
            </p>
          </div>
          <Link
            href="/gallery"
            className="mono-label text-xs uppercase text-austrian-red"
          >
            view all photos
          </Link>
        </div>
        <PhotoGrid photos={previewPhotos} />
      </section>

      <section
        id="about"
        className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.72fr_1.28fr]"
      >
        <SectionLabel index="03" label="about" />
        <div className="min-w-0">
          <h2 className="text-3xl font-semibold sm:text-5xl">
            Behind the lens, there is design discipline too.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {PROFILE_SUMMARY}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={CV_DOWNLOAD_PATH}
              download
              className="flex h-12 items-center justify-center gap-2 rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark"
            >
              Download CV <Download size={17} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex h-12 items-center justify-center gap-2 rounded border border-line bg-white px-5 font-semibold text-foreground transition hover:border-austrian-red hover:text-austrian-red"
            >
              Inquire <Mail size={17} />
            </a>
          </div>
        </div>

        <div className="grid gap-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div>
            <p className="mono-label text-xs uppercase text-austrian-red">
              current profile
            </p>
            <div className="mt-4 grid gap-3">
              {PROFILE_HIGHLIGHTS.map((highlight) => (
                <p
                  key={highlight}
                  className="border-b border-line pb-3 text-lg font-semibold text-foreground"
                >
                  {highlight}
                </p>
              ))}
            </div>
          </div>

          <div>
            <p className="mono-label text-xs uppercase text-austrian-red">
              beyond the lens
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ABOUT_SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-line bg-white px-3 py-2 text-sm font-semibold text-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-line bg-white px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <SectionLabel index="04" label="contact" />
            <h2 className="text-3xl font-semibold sm:text-5xl">
              Let&apos;s work together.
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              For shoots, collaborations, or project inquiries, reach out and
              I&apos;ll get back to you.
            </p>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex h-12 items-center justify-center gap-2 rounded bg-austrian-red px-5 font-semibold text-white transition hover:bg-austrian-red-dark"
          >
            Send inquiry <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
