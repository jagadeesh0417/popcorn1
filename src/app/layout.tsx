import type { Metadata } from "next";
import { Playfair_Display, Jost, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/lib/store";
import { ShippingProvider } from "@/lib/shipping-settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BRAND, BRAND_EMAIL, KITCHEN_ADDRESS, SITE_URL, SOCIAL } from "@/lib/brand";
import { resolveBrandAssets } from "@/lib/brand-assets.server";
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

// Resolved at build time. Missing files are simply omitted, so we never emit a
// link to a missing icon. See public/brand/README.md.
const brandAssets = resolveBrandAssets();

const title = `${BRAND.name} — ${BRAND.tagline}`;

export const metadata: Metadata = {
  title,
  description: BRAND.description,
  keywords: BRAND.keywords,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: BRAND.description,
    type: "website",
    siteName: BRAND.name,
    locale: "en_IN",
    url: SITE_URL,
    ...(brandAssets.ogImage ? { images: [{ url: brandAssets.ogImage, width: 1200, height: 630, alt: BRAND.name }] } : {}),
  },
  twitter: {
    card: brandAssets.ogImage ? "summary_large_image" : "summary",
    title: `${BRAND.name} — Small-Batch Gourmet Popcorn`,
    description: BRAND.description,
    ...(brandAssets.ogImage ? { images: [brandAssets.ogImage] } : {}),
  },
  icons: {
    ...(brandAssets.favicon ? { icon: [{ url: brandAssets.favicon, type: "image/png" }] } : {}),
    ...(brandAssets.appleTouchIcon ? { apple: [{ url: brandAssets.appleTouchIcon, sizes: "180x180" }] } : {}),
  },
  robots: "index, follow",
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sameAs = [SOCIAL.instagram, SOCIAL.youtube].filter(
    (url): url is string => Boolean(url)
  );

  return (
    <html lang="en" className={`${playfair.variable} ${jost.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodService",
              name: BRAND.name,
              alternateName: BRAND.previousName,
              description: BRAND.description,
              url: SITE_URL,
              email: BRAND_EMAIL,
              servesCuisine: "Popcorn",
              address: {
                "@type": "PostalAddress",
                streetAddress: `${KITCHEN_ADDRESS.line1}, ${KITCHEN_ADDRESS.line2}`,
                addressLocality: KITCHEN_ADDRESS.city,
                postalCode: KITCHEN_ADDRESS.zip,
                addressRegion: KITCHEN_ADDRESS.region,
                addressCountry: KITCHEN_ADDRESS.country,
              },
              ...(sameAs.length ? { sameAs } : {}),
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ShippingProvider>
          <CartProvider>
            <Header logoSrc={brandAssets.headerLogo ?? null} />
            <main className="flex-1">{children}</main>
            <Footer logoSrc={brandAssets.footerLogo ?? null} />
            <WhatsAppButton />
          </CartProvider>
        </ShippingProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
