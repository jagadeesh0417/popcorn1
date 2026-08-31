import { senderConfig } from "./sender";

// ---- Shared types ----

export interface ShippingLabelSender {
  brand: string;
  name: string;
  phone: string;
  address: string;
}

export interface ShippingLabelRecipient {
  name: string;
  phone: string;
  addressLines: string[];
  cityState: string;
  pincode?: string;
  isPickup: boolean;
  incomplete: boolean;
  missingFields: string[];
}

export interface ShippingLabelData {
  sender: ShippingLabelSender;
  recipient: ShippingLabelRecipient;
  order: {
    id: string;
    itemCount: number;
  };
}

export interface RawOrder {
  orderId?: string;
  items?: { quantity?: number }[];
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

const CLEANUP_PATTERNS = [/^(undefined|null|NaN)$/i];

function clean(value: unknown): string {
  const raw = typeof value === "string" ? value : "";
  const trimmed = raw.replace(/,\s*$/, "").trim();
  if (!trimmed) return "";
  for (const pattern of CLEANUP_PATTERNS) {
    if (pattern.test(trimmed)) return "";
  }
  return trimmed;
}

function splitAddress(raw: string): string[] {
  const address = clean(raw);
  if (!address) return [];
  if (isPickup(address)) return ["Mysuru Pickup"];
  // Break on commas and semicolons so multi-part addresses print on their own lines.
  return address
    .split(/[;,]+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function isPickup(address: string): boolean {
  return /pickup/i.test(clean(address));
}

/**
 * Normalize a raw order document into a clean, printable shipping label.
 * The order's customerDetails is already a snapshot taken at checkout, so it
 * reflects the address actually used for THAT order (not the latest profile).
 */
export function buildShippingLabel(order: RawOrder): ShippingLabelData | null {
  const details = order.customerDetails || {};
  const fullName = clean(`${details.firstName || ""} ${details.lastName || ""}`);
  const phone = clean(details.phone);
  const city = clean(details.city);
  const state = clean(details.state);
  const pincode = clean(details.zipCode);

  const addressLines = splitAddress(details.address || "");
  const isPickupOrder = addressLines.length === 1 && isPickup(addressLines[0]);

  const missingFields: string[] = [];
  if (!fullName) missingFields.push("Customer Name");
  if (!phone) missingFields.push("Phone number");
  if (addressLines.length === 0) missingFields.push("Delivery address");
  if (!city) missingFields.push("City");
  if (!state) missingFields.push("State");
  if (!pincode) missingFields.push("PIN code");

  const cityState = [city, state].filter(Boolean).join(", ");

  const itemCount = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
    : 0;

  return {
    sender: {
      brand: senderConfig.brand,
      name: senderConfig.name,
      phone: senderConfig.phone,
      address: senderConfig.address,
    },
    recipient: {
      name: fullName.toUpperCase(),
      phone,
      addressLines,
      cityState,
      pincode,
      isPickup: isPickupOrder,
      incomplete: missingFields.length > 0,
      missingFields,
    },
    order: {
      id: clean(order.orderId) || "",
      itemCount,
    },
  };
}
