import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { ProductGrid } from "@/components/home/ProductGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BundleCard } from "@/components/home/BundleCard";
import { DeliveryInfo } from "@/components/home/DeliveryInfo";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProductGrid />
      <WhyChooseUs />
      <BundleCard />
      <DeliveryInfo />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
