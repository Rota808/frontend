
import { toast } from "@/components/ui/sonner";

const API_URL = 'http://localhost:8000';

// Types based on Django models
export interface Pizza {
  id: number;
  pizza_name: string;
  description: string;
  image_url?: string;
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

// Interface for pizza creation/update
export interface PizzaInput {
  pizza_name: string;
  description: string;
  image_url?: string;
}

// Interface for pizza price creation/update
export interface PizzaPriceInput {
  pizza: number;
  size: number;
  price: number;
}

// Interface for size creation/update
export interface SizeInput {
  size_name: string;
  diameter: number;
  description: string;
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
  createPizza: (data: PizzaInput) => fetchApi<Pizza>('pizzas/', 'POST', data),
  updatePizza: (id: number, data: PizzaInput) => fetchApi<Pizza>(`pizzas/${id}/`, 'PUT', data),
  deletePizza: (id: number) => fetchApi<void>(`pizzas/${id}/`, 'DELETE'),
  
  // Size endpoints
  getSizes: () => fetchApi<Size[]>('sizes/'),
  createSize: (data: SizeInput) => fetchApi<Size>('sizes/', 'POST', data),
  updateSize: (id: number, data: SizeInput) => fetchApi<Size>(`sizes/${id}/`, 'PUT', data),
  deleteSize: (id: number) => fetchApi<void>(`sizes/${id}/`, 'DELETE'),
  
  // Beverage endpoints
  getBeverages: () => fetchApi<Beverage[]>('beverages/'),
  
  // PizzaPrice endpoints
  getPizzaPrices: () => fetchApi<PizzaPrice[]>('pizza-prices/'),
  createPizzaPrice: (data: PizzaPriceInput) => fetchApi<PizzaPrice>('pizza-prices/', 'POST', data),
  updatePizzaPrice: (id: number, data: PizzaPriceInput) => fetchApi<PizzaPrice>(`pizza-prices/${id}/`, 'PUT', data),
  deletePizzaPrice: (id: number) => fetchApi<void>(`pizza-prices/${id}/`, 'DELETE'),
  
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
