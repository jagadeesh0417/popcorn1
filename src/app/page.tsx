import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BundleCard } from "@/components/home/BundleCard";
import { DeliveryInfo } from "@/components/home/DeliveryInfo";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { InstagramGallery } from "@/components/home/InstagramGallery";

function SectionDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
  );
}

export default function HomePage() {
  return (
    <>
      <TrustBar />
      <SectionDivider />
      <FeaturedProducts />
      <SectionDivider />
      <BundleCard />
      <SectionDivider />
      <DeliveryInfo />
      <SectionDivider />
      <WhyChooseUs />
      <SectionDivider />
      <InstagramGallery />
    </>
  );
}
