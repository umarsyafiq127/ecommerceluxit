
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/Product";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      addToCart(product, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="card-product group h-full flex flex-col overflow-hidden animate-scale-up transition-all duration-300 hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="aspect-square relative overflow-hidden bg-ahsan-krem">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-ahsan-krem">
              <span className="text-ahsan-emas/40 text-xl">Tidak Ada Gambar</span>
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-ahsan-emas/90 text-white rounded">
                Unggulan
              </span>
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 right-0 m-3 p-3 bg-white/90 hover:bg-ahsan-merah hover:text-white rounded-full shadow-md transition-colors duration-300 z-10"
            aria-label="Tambah ke keranjang"
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
          
          <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-ahsan-merah transition-colors">
            {product.name}
          </h3>
          
          <p className="text-ahsan-merah font-semibold mt-auto">
            Rp{Math.round(product.price * 15000).toLocaleString('id-ID')}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
