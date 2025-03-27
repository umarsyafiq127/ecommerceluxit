
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/Product";
import { ShoppingCart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would connect to a cart service
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <div className="card-product group h-full flex flex-col overflow-hidden animate-scale-up transition-all duration-300 hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-islamic-cream">
          {product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-islamic-cream">
              <span className="text-islamic-gold/40 text-xl">No Image</span>
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-islamic-gold/90 text-white rounded">
                Featured
              </span>
            </div>
          )}
          
          <button
            onClick={addToCart}
            className="absolute bottom-0 right-0 m-3 p-3 bg-white/90 hover:bg-islamic-green hover:text-white rounded-full shadow-md transition-colors duration-300 z-10"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-islamic-green transition-colors">
            {product.name}
          </h3>
          
          <p className="text-islamic-navy font-semibold mt-auto">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
