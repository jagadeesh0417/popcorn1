import { Wheat, Flame, Shield, MapPin, Award, type LucideIcon } from "lucide-react";

export type BrandValue = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** "Our Values" copy — wording supplied in the requirements. Do not paraphrase. */
export const BRAND_VALUES: BrandValue[] = [
  { icon: Wheat, title: "100% Natural", description: "No artificial flavours, preservatives, or palm oil. Ever." },
  { icon: Flame, title: "Small Batch", description: "Handcrafted daily in small batches for quality, not quantity." },
  { icon: Shield, title: "Premium Quality", description: "Only the finest kernels and freshest ingredients make the cut." },
  { icon: MapPin, title: "Proudly Mysuru", description: "Handcrafted with love in the cultural capital of Karnataka." },
  { icon: Award, title: "Customer First", description: "Your happiness is our success. We stand by every batch." },
];
