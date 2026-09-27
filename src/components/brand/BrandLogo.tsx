import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type BrandLogoProps = {
  /** Public path to the supplied logo. `null` renders the text wordmark. */
  src?: string | null;
  /** `dark` = for coloured/dark backgrounds, `light` = for white backgrounds. */
  tone?: "light" | "dark";
  className?: string;
  /** Height only; width is always intrinsic so the logo is never distorted. */
  heightClassName?: string;
  priority?: boolean;
};

/**
 * Brand logo slot.
 *
 * Renders the supplied Blue Dino artwork when it exists. Until the artwork is
 * dropped into `public/brand/`, it renders a typographic wordmark instead of a
 * broken image or the previous brand's logo.
 */
export function BrandLogo({
  src,
  tone = "light",
  className,
  heightClassName = "h-11 md:h-14",
  priority = false,
}: BrandLogoProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${BRAND.name} logo`}
        className={cn(heightClassName, "w-auto max-w-[220px] object-contain", className)}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 leading-none select-none",
        heightClassName,
        "text-[1.35rem] md:text-[1.6rem]",
        tone === "dark" ? "text-white" : "text-[#1A1A1A]",
        className
      )}
      style={{ fontFamily: "var(--font-playfair)" }}
      aria-label={`${BRAND.name} logo`}
    >
      <span className={tone === "dark" ? "text-white" : "text-brand"}>Blue</span>
      <span className={tone === "dark" ? "text-[#F9D976]" : "text-[#B8891B]"}>Dino</span>
    </span>
  );
}
