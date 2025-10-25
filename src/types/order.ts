import { CartItem } from '@/context/CartContext';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'awaiting_payment' | 'paid' | 'failed';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

export interface Order {
  id: string;
  orderDate: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus; // New field
  orderNumber: string; // New field
  shippingCost: number; // New field
  
  items: CartItem[];
  
  // Detailed Buyer Info (mapped from ShippingAddress + user data)
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
  buyerCountry: string;

  shippingAddress: ShippingAddress; // Kept for frontend compatibility
  paymentMethod: string;
  estimatedDelivery: string;
}