import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="brand-pattern-soft nav-blur sticky top-0 z-40 border-b border-line">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <BrandMark priority />
          <span className="mono-label text-sm uppercase text-foreground">
            Apron / Photo
          </span>
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mono-label text-xs uppercase text-muted transition-colors hover:text-austrian-red"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
