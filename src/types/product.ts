export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface QA {
  id: number;
  question: string;
  answer: string | null;
  author: string;
  date: string;
}

export interface Shop {
  name: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  memberSince?: string;
  productCount?: number;
}

export interface DeliveryInfo {
  city: string;
  fee: number;
  eta: string;
}

export interface Option {
  name: string;
  values: string[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  shop: Shop;
  stock: number;
  category: string;
  features: string[];
  specifications: Record<string, string>;
  deliveryInfo: DeliveryInfo;
  reviews: Review[];
  qa?: QA[];
  images: string[];
  options: Option[];
  timeDelivery: string;
}