import { HeroSwitch } from "@/components/home/HeroSwitch";
import { TrustBar } from "@/components/home/TrustBar";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BundleCard } from "@/components/home/BundleCard";
import { InstagramGallery } from "@/components/home/InstagramGallery";

function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F9D976]/20 to-transparent" />
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSwitch />
      <SectionDivider />
      <TrustBar />
      <SectionDivider />
      <FeaturedProducts />
      <SectionDivider />
      <BundleCard />
      <SectionDivider />
      <WhyChooseUs />
      <SectionDivider />
      <InstagramGallery />
    </>
  );
}
