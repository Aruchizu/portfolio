"use client";

import { ArrowUpRight, Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type InstagramPhoneMockupProps = {
  embedHtml: string;
  phoneFramePath: string;
  profileUrl: string;
  username: string;
};

export function InstagramPhoneMockup({
  embedHtml,
  phoneFramePath,
  profileUrl,
  username,
}: InstagramPhoneMockupProps) {
  const embedRef = useRef<HTMLDivElement | null>(null);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const hasEmbed = embedHtml.trim().length > 0;

  useEffect(() => {
    if (!hasEmbed) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]',
    );

    function detectRenderedEmbed() {
      const embedRoot = embedRef.current;
      const rendered = Boolean(
        embedRoot?.querySelector("iframe, .instagram-media-rendered"),
      );

      setEmbedLoaded(rendered);
    }

    function processEmbed() {
      window.instgrm?.Embeds?.process?.();
      window.setTimeout(detectRenderedEmbed, 1200);
    }

    if (existingScript) {
      processEmbed();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = processEmbed;
    script.onerror = () => setEmbedLoaded(false);
    document.body.appendChild(script);
  }, [hasEmbed, embedHtml]);

  return (
    <div
      className="mx-auto w-full max-w-[330px] lg:ml-auto"
      aria-label="Instagram profile preview"
    >
      <div className="relative aspect-[79.2/163.5] drop-shadow-[0_28px_70px_rgba(0,0,0,0.26)]">
        <Image
          src={phoneFramePath}
          alt=""
          aria-hidden="true"
          fill
          sizes="330px"
          unoptimized
          className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
        />
        <div className="absolute inset-x-[8.5%] bottom-[5.3%] top-[5.2%] z-10 overflow-hidden rounded-[2rem] bg-white text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <div className="flex h-full flex-col">
            <div className="flex h-20 shrink-0 items-end justify-between border-b border-line px-4 pb-3">
              <div>
                <p className="mono-label text-[10px] uppercase text-austrian-red">
                  live profile
                </p>
                <p className="text-sm font-semibold">@{username}</p>
              </div>
              <Camera className="text-austrian-red" size={20} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
              {hasEmbed ? (
                <div>
                  <div
                    ref={embedRef}
                    className="instagram-embed-shell min-h-80"
                    dangerouslySetInnerHTML={{ __html: embedHtml }}
                  />
                  {!embedLoaded ? (
                    <FallbackProfile
                      profileUrl={profileUrl}
                      username={username}
                      message="If Instagram pauses the embed, open the profile directly."
                    />
                  ) : null}
                </div>
              ) : (
                <FallbackProfile
                  profileUrl={profileUrl}
                  username={username}
                  message="Official Instagram embed code can be dropped here once it is copied from Instagram."
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex h-12 items-center justify-center gap-2 rounded border border-line bg-white px-5 font-semibold text-foreground transition hover:border-austrian-red hover:text-austrian-red"
      >
        Open @{username} <ArrowUpRight size={17} />
      </a>
    </div>
  );
}

function FallbackProfile({
  message,
  profileUrl,
  username,
}: {
  message: string;
  profileUrl: string;
  username: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-background p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-austrian-red via-foreground to-austrian-red-dark text-2xl font-semibold text-white">
          A
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2 text-center text-xs">
          <Stat value="IG" label="profile" />
          <Stat value="Live" label="link" />
          <Stat value="CV" label="ready" />
        </div>
      </div>
      <div className="mt-5">
        <p className="text-sm font-semibold">@{username}</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          Alaala ni Candia. Moments, frames, and quiet visual notes from the
          photos I keep returning to.
        </p>
      </div>
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex h-10 items-center justify-center rounded bg-foreground text-sm font-semibold text-white transition hover:bg-austrian-red"
      >
        View Instagram
      </a>
      <div className="mt-5 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-sm bg-gradient-to-br from-line via-white to-muted"
          />
        ))}
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">{message}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold">{value}</p>
      <p className="text-muted">{label}</p>
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}
