import type { Metadata } from "next";
import { Poppins, Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poprika - Premium Artisanal Popcorn from Mysuru",
  description: "Handcrafted gourmet popcorn made in small batches in Mysuru. 100% natural ingredients, no palm oil. Ghee & Black Pepper, Coffee Chikki, and more.",
  keywords: "premium popcorn, gourmet popcorn, handcrafted snacks, Mysuru popcorn, artisanal popcorn, ghee popcorn, Indian gourmet snacks",
  openGraph: {
    title: "Poprika - Premium Artisanal Popcorn from Mysuru",
    description: "Handcrafted gourmet popcorn made in small batches in Mysuru.",
    type: "website",
    siteName: "Poprika",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Poprika - Premium Artisanal Popcorn",
    description: "Handcrafted gourmet popcorn made in small batches in Mysuru.",
  },
  robots: "index, follow",
  metadataBase: new URL("https://poprika.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              name: "Poprika",
              description: "Premium artisanal popcorn brand from Mysuru",
              url: "https://poprika.in",
              servesCuisine: "Popcorn",
              address: { "@type": "PostalAddress", addressLocality: "Mysuru", addressCountry: "IN" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "10000" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
