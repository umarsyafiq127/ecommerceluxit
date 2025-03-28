
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types/Product";
import { toast } from "@/hooks/use-toast";

interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
      );

      let updatedCart;
      let message;

      if (existingItemIndex !== -1) {
        // If item exists, update quantity
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        message = `Updated quantity for ${product.name}`;
      } else {
        // Add new item
        updatedCart = [...prevCart, { product, quantity }];
        message = `Added ${product.name} to cart`;
      }

      // Show toast notification
      toast({
        title: "Cart Updated",
        description: message,
      });

      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find(item => item.product.id === productId);
      const updatedCart = prevCart.filter((item) => item.product.id !== productId);
      
      if (itemToRemove) {
        toast({
          title: "Item Removed",
          description: `${itemToRemove.product.name} has been removed from your cart`,
        });
      }
      
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      
      const updatedItem = updatedCart.find(item => item.product.id === productId);
      if (updatedItem) {
        toast({
          title: "Quantity Updated",
          description: `${updatedItem.product.name} quantity set to ${quantity}`,
        });
      }
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
