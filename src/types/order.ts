import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

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
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  estimatedDelivery: string;
}