
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Trash2, ChevronLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Fitur checkout akan segera tersedia.",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <ShoppingBag size={64} className="mx-auto text-gray-300" />
          </div>
          <h1 className="heading-secondary mb-4">Keranjang Anda Kosong</h1>
          <p className="mb-8 text-gray-600">
            Silakan tambahkan produk ke keranjang Anda untuk melanjutkan belanja.
          </p>
          <Link to="/products" className="btn-primary">
            Lanjut Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link
        to="/products"
        className="inline-flex items-center text-ahsan-merah mb-8 hover:text-ahsan-merah-tua transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Kembali Belanja</span>
      </Link>

      <h1 className="heading-primary mb-8">Keranjang Belanja</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-medium">
                Produk ({totalItems})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500"
              >
                <Trash2 size={16} className="mr-2" />
                Kosongkan
              </Button>
            </div>

            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="py-6 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-grow">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-medium text-lg hover:text-ahsan-merah transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.product.category}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 text-gray-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              Math.min(item.product.stock, item.quantity + 1)
                            )
                          }
                          className="px-2 py-1 text-gray-600"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-medium text-lg">
                    Rp{Math.round(item.product.price * item.quantity * 15000).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="font-serif text-xl font-medium mb-6">Ringkasan Belanja</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  Rp{Math.round(totalPrice * 15000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pengiriman</span>
                <span className="text-gray-600">Dihitung pada checkout</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-ahsan-merah">
                  Rp{Math.round(totalPrice * 15000).toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-ahsan-merah hover:bg-ahsan-merah-tua transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>Lanjut ke Checkout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
