import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Popcorn - Premium Gourmet Popcorn Delivered Fresh",
  description: "Freshly popped happiness delivered to your doorstep. Premium gourmet popcorn crafted with the finest ingredients and handcrafted flavours.",
  keywords: "premium popcorn, gourmet popcorn, handcrafted snacks, caramel popcorn, cheese popcorn",
  openGraph: {
    title: "Popcorn - Premium Gourmet Popcorn",
    description: "Freshly popped happiness delivered to your doorstep.",
    type: "website",
    siteName: "Popcorn",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Popcorn - Premium Gourmet Popcorn",
    description: "Freshly popped happiness delivered to your doorstep.",
  },
  robots: "index, follow",
  metadataBase: new URL("https://popcorn.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              name: "Popcorn",
              description: "Premium gourmet popcorn brand",
              url: "https://popcorn.in",
              servesCuisine: "Popcorn",
              address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "10000" },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
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
