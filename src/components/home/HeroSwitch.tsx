"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./HeroSection";
import { HeroSectionV2 } from "./HeroSectionV2";
import { BannerCarousel } from "./BannerCarousel";

export function HeroSwitch() {
  const [hasBanners, setHasBanners] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/banners")
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) {
          const active = d.data.filter((b: { isActive: boolean }) => b.isActive);
          setHasBanners(active.length > 0);
        }
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  if (!checked) return null;

  if (hasBanners) return <BannerCarousel />;

  const variant = process.env.NEXT_PUBLIC_HERO_VARIANT;
  if (variant === "v2") return <HeroSectionV2 />;
  return <HeroSection />;
}
