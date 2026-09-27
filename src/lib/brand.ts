/**
 * Central brand configuration for Blue Dino.
 *
 * Everything that used to be hardcoded per-component (name, contact details,
 * social links, domain, fulfilment copy) now resolves from here, so a
 * rebrand or a domain change is a single-file edit.
 *
 * Values that are NOT supplied yet (domain, Instagram, logo files) deliberately
 * have no invented default. They fall back to `null` / a local dev origin and
 * the UI degrades gracefully instead of rendering a fake URL or a broken
 * image. See `src/lib/brand-assets.server.ts` for the asset drop-in slots.
 */

export const BRAND = {
  name: "Blue Dino",
  previousName: "Poprika",
  tagline: "Small-batch gourmet popcorn from Mysuru, India",
  description:
    "Handcrafted gourmet popcorn made in small batches in Mysuru. No palm oil, no preservatives, no artificial anything. Just real spices, real ghee, and popcorn done properly.",
  keywords: [
    "premium popcorn",
    "gourmet popcorn",
    "Mysuru popcorn",
    "artisanal popcorn",
    "ghee popcorn",
    "small batch popcorn",
    "Indian gourmet snacks",
  ].join(", "),
  founder: "Sanjan",
  foundedIn: "Mysuru",
} as const;

/** Business contact email. Override with CONTACT_EMAIL for the contact form. */
export const BRAND_EMAIL = "bluedino.snacks@gmail.com";

/**
 * Public site origin. Set NEXT_PUBLIC_SITE_URL to the live domain.
 * Falls back to localhost so local development and metadata resolution work
 * without a hardcoded production domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SOCIAL = {
  /**
   * Supplied per-project. No default: the icon is not rendered until a real
   * handle exists, so the site never links to a wrong or invented profile.
   */
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || null,
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918197175807",
} as const;

export const PHONE = {
  display: `+91 ${SOCIAL.whatsappNumber.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "")}`,
  tel: `+${SOCIAL.whatsappNumber.replace(/\D/g, "")}`,
} as const;

export const BUSINESS_HOURS = "Monday – Sunday, 9:30 AM – 8:00 PM";

/** Kitchen / fulfilment address. Used for pickup, schema and the contact page. */
export const KITCHEN_ADDRESS = {
  line1: "#30, Sri Nivasa, RCE Layout",
  line2: "Vijayanagar 4th Stage",
  city: "Mysore",
  zip: "570032",
  region: "Karnataka",
  country: "IN",
  /** Single-line form, exactly as supplied in the requirements. */
  singleLine: "#30, Sri Nivasa, RCE Layout, Vijayanagar 4th Stage, Mysore – 570032",
} as const;

export const FULFILMENT = {
  pickup: {
    label: "Pickup (Mysore Only)",
    shortLabel: "Pickup",
    blurb: "If you’re in Mysore, you can collect your order directly from our kitchen.",
    steps: [
      "Choose “Pickup” during checkout",
      "Your order will be ready within 2 working days",
      "Message us on WhatsApp for order updates",
    ],
    address: KITCHEN_ADDRESS.singleLine,
  },
  delivery: {
    label: "Delivery (Mysore & Pan-India)",
    shortLabel: "Delivery",
    blurb: "We deliver fresh popcorn across India, including Mysore.",
    steps: [
      "Choose “Delivery” during checkout",
      "Your order will be dispatched within 2 working days",
      "Delivery usually takes 2–7 business days, depending on your location",
    ],
  },
} as const;

/**
 * Order fulfilment values. `pickup` is stored on the order so the admin panel
 * and the customer's confirmation can show the right instructions.
 */
export type FulfillmentMethod = "pickup" | "delivery";

/** Order reference prefix (was `POP`). */
export const ORDER_ID_PREFIX = "BD";

/** Copy used for the WhatsApp deep link prefills. */
export const WHATSAPP_MESSAGES = {
  default: `Hi ${BRAND.name}, I have a question.`,
  pickup: `Hi ${BRAND.name}, I have placed a pickup order and would like an update.`,
} as const;
