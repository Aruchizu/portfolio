import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({
  className = "h-8 w-8",
  priority = false,
}: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className}`}
    >
      <Image
        src="/brand-logo.png"
        alt=""
        fill
        priority={priority}
        sizes="64px"
        className="object-cover"
      />
    </span>
  );
}
