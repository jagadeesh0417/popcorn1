import { HeroSection } from "./HeroSection";
import { HeroSectionV2 } from "./HeroSectionV2";

export function HeroSwitch() {
  const variant = process.env.NEXT_PUBLIC_HERO_VARIANT;
  if (variant === "v2") return <HeroSectionV2 />;
  return <HeroSection />;
}
