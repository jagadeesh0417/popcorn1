import { HeroSwitch } from "@/components/home/HeroSwitch";
import { TrustBar } from "@/components/home/TrustBar";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ProductGrid } from "@/components/home/ProductGrid";
import { BundleCard } from "@/components/home/BundleCard";
import { DeliveryInfo } from "@/components/home/DeliveryInfo";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSwitch />
      <TrustBar />
      <WhyChooseUs />
      <ProductGrid />
      <div className="mt-8" />
      <BundleCard />
      <DeliveryInfo />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
