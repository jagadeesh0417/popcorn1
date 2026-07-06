import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BestSellers } from "@/components/home/BestSellers";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <WhyChooseUs />
      <BestSellers />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
