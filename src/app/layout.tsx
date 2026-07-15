import type { Metadata } from "next";
import { Playfair_Display, Jost, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/store";
import { ShippingProvider } from "@/lib/shipping-settings";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/layout/CartDrawer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poprika — Small-Batch Gourmet Popcorn from Mysuru, India",
  description: "Handcrafted gourmet popcorn made in small batches in Mysuru. No palm oil, no preservatives, no artificial anything. Just real spices, real ghee, and popcorn done properly.",
  keywords: "premium popcorn, gourmet popcorn, Mysuru popcorn, artisanal popcorn, ghee popcorn, small batch popcorn, Indian gourmet snacks",
  openGraph: {
  title: "Poprika — Small-Batch Gourmet Popcorn from Mysuru, India",
    description: "Handcrafted gourmet popcorn made in small batches in Mysuru. No palm oil, no preservatives, no artificial anything.",
    type: "website",
    siteName: "Poprika",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poprika — Small-Batch Gourmet Popcorn",
    description: "Handcrafted gourmet popcorn made in small batches in Mysuru.",
  },
  robots: "index, follow",
  metadataBase: new URL("https://poprika.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              name: "Poprika",
              description: "Small-batch gourmet popcorn brand from Mysuru",
              url: "https://poprika.in",
              servesCuisine: "Popcorn",
              address: { "@type": "PostalAddress", streetAddress: "#30, Sri Nivasa, RCE Layout, Vijayanagar 4th Stage", addressLocality: "Mysore", postalCode: "570032", addressRegion: "Karnataka", addressCountry: "IN" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "10000" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ShippingProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <CartDrawer />
          </CartProvider>
        </ShippingProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
