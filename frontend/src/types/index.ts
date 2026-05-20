// ═══════════════════════════════
//  VELVET ROAST — SHARED TYPES
// ═══════════════════════════════

export interface User {
  id: string;
  fullname: string;
  email: string;
  username: string;
  role: 'admin' | 'staff' | 'user';
  date_registered: string;
  password_needs_reset: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'available' | 'unavailable';
  description?: string;
  image_path?: string;
  date_added: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  city?: string;
  delivery_method: 'pickup' | 'delivery';
  notes?: string;
  payment_method: 'cash' | 'gcash';
  total: number;
  delivery_fee: number;
  discount: number;
  ref_code: string;
  created_at: string;
  status: 'pending' | 'preparing' | 'done' | 'cancelled';
  managed_by?: string;
  managed_by_name?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_img?: string;
  size?: string;
  qty: number;
  price: number;
}

export interface CartItem {
  product_id: string;
  product_name: string;
  product_img?: string;
  category: string;
  size: string;
  qty: number;
  price: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface OrderStats {
  total: number;
  pending: number;
  preparing: number;
  done: number;
  cancelled: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'done' | 'cancelled';
export type DeliveryMethod = 'pickup' | 'delivery';
export type PaymentMethod = 'cash' | 'gcash';
export type UserRole = 'admin' | 'staff' | 'user';
