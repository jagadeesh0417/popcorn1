import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BundleCard } from "@/components/home/BundleCard";
import { DeliveryInfo } from "@/components/home/DeliveryInfo";
import { OurValues } from "@/components/home/OurValues";
import { InstagramGallery } from "@/components/home/InstagramGallery";

function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
  );
}

export default function HomePage() {
  return (
    <>
      <FeaturedProducts />
      <SectionDivider />
      <BundleCard />
      <SectionDivider />
      <TrustBar />
      <SectionDivider />
      <DeliveryInfo />
      <SectionDivider />
      <OurValues />
      <SectionDivider />
      <InstagramGallery />
    </>
  );
}
