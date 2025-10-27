export interface Shop {
  id: string; // Alterado para string para corresponder ao UUID do Supabase
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

// Nova interface para as variantes do produto
export interface ProductVariant {
  id: string;
  name: string; // Ex: "Vermelho - 128GB"
  price: number;
  stock: number;
  image_url?: string; // Imagem única para esta variante
  options: Record<string, string>; // Ex: { Cor: "Vermelho", Armazenamento: "128GB" }
}

export interface Option {
  name: string;
  values: string[];
}

export interface Product {
  id: string | number; // Mantendo number para compatibilidade com mocks, mas permitindo string (UUID)
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
  images: string[];
  options: Option[];
  variants: ProductVariant[]; // Novo campo para armazenar todas as variantes
  timeDelivery: string;
}