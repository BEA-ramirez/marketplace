export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  seller_email: string;
  image_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  listing_id: string | null;
  buyer_email: string;
  seller_email: string;
  message: string;
  created_at: string;
}
