
import { toast } from "@/components/ui/sonner";

const API_URL = 'http://localhost:8000';

// Types based on Django models
export interface Pizza {
  id: number;
  pizza_name: string;
  description: string;
}

export interface Size {
  id: number;
  size_name: string;
  diameter: number;
  description: string;
}

export interface Beverage {
  id: number;
  beverage_name: string;
  description: string;
  price: number;
}

export interface PizzaPrice {
  id: number;
  pizza: number;
  size: number;
  price: number;
}

export interface User {
  id?: number;
  full_name: string;
  contact_number: string;
  saved_address: string;
  saved_info: boolean;
}

export interface StoreInfo {
  id: number;
  address: string;
  directions: string;
  contact_phone: string;
}

export interface Order {
  id?: number;
  user: number;
  order_date?: string;
  delivery_address: string;
  contact_phone: string;
  estimated_delivery_time?: string;
  total_price: number;
  status?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id?: number;
  order?: number;
  item_type: string;
  pizza?: number;
  size?: number;
  beverage?: number;
  quantity: number;
  price: number;
}

export interface Payment {
  id?: number;
  order: number;
  payment_method: string;
  payment_status?: string;
  card_last_four?: string;
  transaction_id?: string;
}

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('Failed to fetch data');
    throw error;
  }
}

// API Service functions
export const apiService = {
  // Pizza endpoints
  getPizzas: () => fetchApi<Pizza[]>('pizzas/'),
  getPizza: (id: number) => fetchApi<Pizza>(`pizzas/${id}/`),
  
  // Size endpoints
  getSizes: () => fetchApi<Size[]>('sizes/'),
  
  // Beverage endpoints
  getBeverages: () => fetchApi<Beverage[]>('beverages/'),
  
  // PizzaPrice endpoints
  getPizzaPrices: () => fetchApi<PizzaPrice[]>('pizza-prices/'),
  
  // StoreInfo endpoints
  getStoreInfo: () => fetchApi<StoreInfo[]>('store-info/'),
  
  // User endpoints
  createUser: (userData: User) => fetchApi<User>('users/', 'POST', userData),
  
  // Order endpoints
  createOrder: (orderData: Order) => fetchApi<Order>('orders/', 'POST', orderData),
  getOrder: (id: number) => fetchApi<Order>(`orders/${id}/`),
  
  // Payment endpoints
  createPayment: (paymentData: Payment) => fetchApi<Payment>('payments/', 'POST', paymentData),
};
