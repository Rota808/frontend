
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pizza, Size, Beverage, PizzaPrice } from '@/services/api';
import { toast } from "@/components/ui/sonner";

// Define the cart item types
export interface CartPizzaItem {
  type: 'pizza';
  pizza: Pizza;
  size: Size;
  quantity: number;
  price: number;
}

export interface CartBeverageItem {
  type: 'beverage';
  beverage: Beverage;
  quantity: number;
  price: number;
}

export type CartItem = CartPizzaItem | CartBeverageItem;

// Cart state
interface CartState {
  items: CartItem[];
  totalPrice: number;
}

// Cart actions
type CartAction =
  | { type: 'ADD_PIZZA'; pizza: Pizza; size: Size; price: number }
  | { type: 'ADD_BEVERAGE'; beverage: Beverage }
  | { type: 'REMOVE_ITEM'; index: number }
  | { type: 'UPDATE_QUANTITY'; index: number; quantity: number }
  | { type: 'CLEAR_CART' };

// Initial cart state
const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
};

// Cart reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_PIZZA': {
      const { pizza, size, price } = action;
      
      // Check if the pizza with the same size already exists in the cart
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.type === 'pizza' && 
          (item as CartPizzaItem).pizza.id === pizza.id && 
          (item as CartPizzaItem).size.id === size.id
      );
      
      if (existingItemIndex !== -1) {
        // If it exists, create a new array with the updated quantity
        const updatedItems = [...state.items];
        const item = updatedItems[existingItemIndex] as CartPizzaItem;
        updatedItems[existingItemIndex] = {
          ...item,
          quantity: item.quantity + 1,
        };
        
        // Calculate the new total price
        const newTotalPrice = state.totalPrice + price;
        
        toast.success(` ${pizza.pizza_name} adicionada ao seu carrinho`);
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: newTotalPrice,
        };
      }
      
      // If it doesn't exist, add a new item
      const newItem: CartPizzaItem = {
        type: 'pizza',
        pizza,
        size,
        quantity: 1,
        price,
      };
      
      toast.success(` ${pizza.pizza_name} adicionada ao seu carrinho.`);
      
      return {
        ...state,
        items: [...state.items, newItem],
        totalPrice: state.totalPrice + price,
      };
    }
    
    case 'ADD_BEVERAGE': {
      const { beverage } = action;
      
      // Check if the beverage already exists in the cart
      const existingItemIndex = state.items.findIndex(
        (item) => 
          item.type === 'beverage' && 
          (item as CartBeverageItem).beverage.id === beverage.id
      );
      
      if (existingItemIndex !== -1) {
        // If it exists, create a new array with the updated quantity
        const updatedItems = [...state.items];
        const item = updatedItems[existingItemIndex] as CartBeverageItem;
        updatedItems[existingItemIndex] = {
          ...item,
          quantity: item.quantity + 1,
        };
        
        // Calculate the new total price
        const newTotalPrice = state.totalPrice + beverage.price;
        
        toast.success(` ${beverage.beverage_name} adicionada ao seu carrinho`);
        
        return {
          ...state,
          items: updatedItems,
          totalPrice: newTotalPrice,
        };
      }
      
      // If it doesn't exist, add a new item
      const newItem: CartBeverageItem = {
        type: 'beverage',
        beverage,
        quantity: 1,
        price: beverage.price,
      };
      
      toast.success(`${beverage.beverage_name} adicionada ao seu carrinho.`);
      
      return {
        ...state,
        items: [...state.items, newItem],
        totalPrice: state.totalPrice + beverage.price,
      };
    }
    
    case 'REMOVE_ITEM': {
      const { index } = action;
      const item = state.items[index];
      
      if (!item) return state;
      
      const itemTotalPrice = item.price * item.quantity;
      const updatedItems = state.items.filter((_, i) => i !== index);
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: state.totalPrice - itemTotalPrice,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { index, quantity } = action;
      const item = state.items[index];
      
      if (!item || quantity < 1) return state;
      
      // Calculate price difference
      const priceDifference = item.price * (quantity - item.quantity);
      
      // Create a new array with the updated item
      const updatedItems = [...state.items];
      updatedItems[index] = {
        ...item,
        quantity,
      };
      
      return {
        ...state,
        items: updatedItems,
        totalPrice: state.totalPrice + priceDifference,
      };
    }
    
    case 'CLEAR_CART': {
      return initialCartState;
    }
    
    default:
      return state;
  }
}

// Create Cart Context
interface CartContextType extends CartState {
  addPizzaToCart: (pizza: Pizza, size: Size, price: number) => void;
  addBeverageToCart: (beverage: Beverage) => void;
  removeItemFromCart: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  const addPizzaToCart = (pizza: Pizza, size: Size, price: number) => {
    dispatch({ type: 'ADD_PIZZA', pizza, size, price });
  };
  
  const addBeverageToCart = (beverage: Beverage) => {
    dispatch({ type: 'ADD_BEVERAGE', beverage });
  };
  
  const removeItemFromCart = (index: number) => {
    dispatch({ type: 'REMOVE_ITEM', index });
  };
  
  const updateItemQuantity = (index: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', index, quantity });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    ...state,
    addPizzaToCart,
    addBeverageToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
