
import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = calculateTotal();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center py-16">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="heading-primary mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button className="bg-islamic-green hover:bg-islamic-green/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="heading-primary mb-2">Your Shopping Cart</h1>
        <p className="text-gray-600">
          Review your items and proceed to checkout when ready.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-b"
            >
              <div className="w-24 h-24 bg-islamic-cream rounded overflow-hidden flex-shrink-0">
                {item.product.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-islamic-cream text-islamic-gold">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-medium text-lg">{item.product.name}</h3>
                <p className="text-islamic-gold font-medium">
                  ${item.product.price.toFixed(2)}
                </p>
                {item.product.category && (
                  <p className="text-sm text-gray-500">
                    Category: {item.product.category}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-500 hover:text-red-700 p-0 h-auto"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>Remove</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold mb-6">
              <span>Total</span>
              <span className="text-islamic-gold">${totalPrice.toFixed(2)}</span>
            </div>
            
            <Link to="/checkout">
              <Button className="w-full bg-islamic-green hover:bg-islamic-green/90 flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
