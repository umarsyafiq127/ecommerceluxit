
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/ProductService";
import { Product } from "../types/Product";
import { ChevronLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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

  const addToCart = () => {
    // In a real app, this would connect to a cart service
    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${quantity} x ${product?.name} ditambahkan ke keranjang Anda`,
    });
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
        {/* Gambar Produk */}
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

          {/* Galeri Thumbnail */}
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

        {/* Detail Produk */}
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

              <Button
                onClick={addToCart}
                className="btn-primary flex items-center justify-center space-x-2 mb-6"
              >
                <ShoppingCart size={18} />
                <span>Tambahkan ke Keranjang</span>
              </Button>
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
