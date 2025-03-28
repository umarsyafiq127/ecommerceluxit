import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/ProductService";
import { Product } from "../types/Product";
import { ChevronLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "../contexts/CartContext";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) {
          setError("ID Produk tidak ditemukan");
          setLoading(false);
          return;
        }

        const fetchedProduct = await getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError("Produk tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal memuat produk");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    
    import("../services/OrderService").then(({ addWhatsAppOrder }) => {
      addWhatsAppOrder(
        "Customer", // In a real app, this would be the logged-in user's name
        [product.name],
        "Customer Location" // In a real app, this would be the user's location
      );
    });
    
    const message = encodeURIComponent(
      `Hello, I would like to order:\n\n` +
      `${quantity}x ${product.name}\n` +
      `Price: $${(product.price * quantity).toFixed(2)}\n\n` +
      `Please provide details for payment and delivery.`
    );
    
    window.open(`https://wa.me/+6281234567890?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-ahsan-emas/20 border-t-ahsan-emas rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-serif mb-4">Error</h1>
          <p className="mb-6">{error || "Produk tidak ditemukan"}</p>
          <Link to="/products" className="btn-primary">
            Kembali ke Produk
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
        <span>Kembali ke Produk</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="perspective-container">
          <div className="rotate-y-hover">
            <div className="aspect-square overflow-hidden rounded-2xl bg-ahsan-krem">
              {product.images.length > 0 ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-ahsan-krem">
                  <span className="text-ahsan-emas/40 text-2xl">Tidak Ada Gambar</span>
                </div>
              )}
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex mt-4 space-x-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === idx
                      ? "border-ahsan-emas"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-2">
            <span className="px-3 py-1 text-xs font-medium bg-ahsan-krem text-ahsan-merah-tua rounded-full">
              {product.category}
            </span>
          </div>
          <h1 className="heading-primary mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-ahsan-merah mb-6">
            Rp{Math.round(product.price * 15000).toLocaleString('id-ID')}
          </p>

          <div className="islamic-divider">
            <span className="relative px-4 font-arabic text-ahsan-emas">﷽</span>
          </div>

          <p className="mb-8 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Ketersediaan:</p>
            {product.stock > 0 ? (
              <span className="text-ahsan-merah">
                Tersedia ({product.stock} unit)
              </span>
            ) : (
              <span className="text-red-500">Stok Habis</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center mb-8">
                <span className="mr-4 text-sm font-medium">Jumlah:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={18} />
                  <span>Tambahkan ke Keranjang</span>
                </Button>
                
                <Button
                  onClick={handleWhatsAppOrder}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  <span>Pesan via WhatsApp</span>
                </Button>
              </div>
            </>
          )}

          <div className="mt-auto pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Kategori: <span className="text-ahsan-merah-tua">{product.category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
