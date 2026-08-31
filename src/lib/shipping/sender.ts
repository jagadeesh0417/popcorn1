// Centralized sender (FROM) configuration for the shipping label.
// This is the single source of truth used everywhere the label prints.
// Change values here to update the sender block across the whole app.
export const senderConfig = {
  brand: "POPRIKA",
  name: "Sanjan (POPRIKA)",
  phone: "8197175807",
  address: "#30 Srinivasa, RCE Layout, Vijayanagar 4th Stage, Mysore, Karnataka - 570032",
} as const;
