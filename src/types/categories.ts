export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports",
  "Toys",
  "Vehicles",
  "Beauty",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
