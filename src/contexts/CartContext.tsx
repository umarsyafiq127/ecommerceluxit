
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types/Product";
import { toast } from "@/components/ui/use-toast";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, []);

  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    const items = cartItems.reduce((total, item) => total + item.quantity, 0);
    setTotalItems(items);
    
    const price = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
    setTotalPrice(price);
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      // Check if product already exists in cart
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Keranjang Diperbarui",
          description: `${product.name} ditambahkan ke keranjang`,
        });
        
        return updatedItems;
      } else {
        // Add new product to cart
        toast({
          title: "Ditambahkan ke Keranjang",
          description: `${product.name} ditambahkan ke keranjang`,
        });
        
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const updatedCart = prev.filter(item => item.product.id !== productId);
      
      toast({
        title: "Produk Dihapus",
        description: "Produk telah dihapus dari keranjang",
      });
      
      return updatedCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Keranjang Dikosongkan",
      description: "Semua produk telah dihapus dari keranjang",
    });
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
