
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
          setError("Product ID is missing");
          setLoading(false);
          return;
        }

        const fetchedProduct = await getProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
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
      title: "Added to Cart",
      description: `${quantity} x ${product?.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-serif mb-4">Error</h1>
          <p className="mb-6">{error || "Product not found"}</p>
          <Link to="/products" className="btn-primary">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link
        to="/products"
        className="inline-flex items-center text-islamic-teal mb-8 hover:text-islamic-green transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back to Products</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="perspective-container">
          <div className="rotate-y-hover">
            <div className="aspect-square overflow-hidden rounded-2xl bg-islamic-cream">
              {product.images.length > 0 ? (
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-islamic-cream">
                  <span className="text-islamic-gold/40 text-2xl">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="flex mt-4 space-x-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    activeImage === idx
                      ? "border-islamic-gold"
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

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="px-3 py-1 text-xs font-medium bg-islamic-cream text-islamic-navy rounded-full">
              {product.category}
            </span>
          </div>
          <h1 className="heading-primary mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-islamic-green mb-6">
            ${product.price.toFixed(2)}
          </p>

          <div className="islamic-divider">
            <span className="relative px-4 font-arabic text-islamic-gold">﷽</span>
          </div>

          <p className="mb-8 text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Availability:</p>
            {product.stock > 0 ? (
              <span className="text-islamic-green">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-500">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center mb-8">
                <span className="mr-4 text-sm font-medium">Quantity:</span>
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
                <span>Add to Cart</span>
              </Button>
            </>
          )}

          <div className="mt-auto pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Categories: <span className="text-islamic-navy">{product.category}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
