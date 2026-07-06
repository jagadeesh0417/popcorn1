import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BestSellers } from "@/components/home/BestSellers";
import { Testimonials } from "@/components/home/Testimonials";
import { DeliverySection } from "@/components/home/DeliverySection";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeaturedProducts />
      <WhyChooseUs />
      <BestSellers />
      <Testimonials />
      <DeliverySection />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
