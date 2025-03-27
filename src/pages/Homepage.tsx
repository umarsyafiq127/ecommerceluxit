
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/ProductService";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getProducts({ featured: true, sortBy: "createdAt", sortOrder: "desc" });
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured products:", error);
        toast({
          title: "Error",
          description: "Failed to load featured products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        const scrollPosition = window.scrollY;
        setScrolled(scrollPosition > heroHeight / 2);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    const featuredSection = document.getElementById("featured-products");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden islamic-pattern-bg"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.07
          }}
        />

        <div className="container mx-auto px-4 z-10 pt-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-6 animate-fade-in">
              <div>
                <span className="px-3 py-1 text-xs font-medium bg-islamic-cream text-islamic-navy rounded-full">
                  Premium Islamic Products
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-islamic-navy leading-tight">
                <span className="relative">
                  Discover Spiritual
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-islamic-gold/30"></span>
                </span>{" "}
                <br />
                <span className="text-islamic-green">Excellence & Beauty</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                Explore our curated collection of high-quality Islamic products, each crafted with attention to detail and spiritual significance.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link to="/products">
                  <Button className="bg-islamic-green hover:bg-islamic-green/90 min-w-[160px]">
                    Shop Now
                  </Button>
                </Link>
                <button
                  onClick={scrollDown}
                  className="flex items-center space-x-2 text-islamic-navy hover:text-islamic-green transition-colors"
                >
                  <span>View Featured</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="hidden md:block perspective-container">
              <div className="relative w-full h-[500px] rotate-y-hover transform-gpu">
                <div
                  className="absolute top-0 left-0 w-4/5 h-4/5 rounded-2xl shadow-2xl overflow-hidden animate-float z-20"
                  style={{ animationDelay: "0s" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1584286595398-2483189ce673?auto=format&fit=crop&q=80"
                    alt="Islamic Art"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-2xl shadow-2xl overflow-hidden animate-float z-10"
                  style={{ animationDelay: "0.5s" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1618076516180-c15281f0c885?auto=format&fit=crop&q=80"
                    alt="Islamic Calligraphy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute h-1/2 w-1/3 top-1/3 -right-10 rounded-full bg-islamic-gold/30 filter blur-3xl animate-pulse-gentle z-0"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div
          className={`scroll-indicator animate-fade-in ${
            scrolled ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          onClick={scrollDown}
        />
      </div>

      {/* Featured Products Section */}
      <section id="featured-products" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="islamic-divider">
              <span className="relative px-4 font-arabic text-islamic-gold">﷽</span>
            </div>
            <h2 className="heading-secondary mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Discover our most popular and recommended products, carefully selected for quality and spiritual significance.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-16 h-16 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No featured products available at the moment.</p>
              <Link to="/products">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="stagger-fade-in">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/products">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <span>View All Products</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-islamic-cream/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We're committed to providing high-quality products with excellent service and a focus on spiritual values.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">ﷲ</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Authentic Products</h3>
              <p className="text-gray-600">
                Every product in our collection is carefully selected to ensure authenticity and quality, respecting Islamic traditions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">ﷴ</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Ethical Sourcing</h3>
              <p className="text-gray-600">
                We ethically source our products, ensuring fair compensation and sustainable practices in all our operations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 duration-300">
              <div className="w-16 h-16 bg-islamic-gold/10 flex items-center justify-center rounded-lg mb-6 text-islamic-gold">
                <span className="font-arabic text-2xl">ﷻ</span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">Trusted Service</h3>
              <p className="text-gray-600">
                Our dedication to excellent customer service is rooted in Islamic values of honesty, integrity, and respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-islamic-navy rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-arabesque" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Start Your Spiritual Journey Today
              </h2>
              <p className="text-white/80 mb-8">
                Explore our collection of premium Islamic products and enhance your spiritual practice with beautifully crafted items.
              </p>
              <Link to="/products">
                <Button className="bg-islamic-gold hover:bg-islamic-gold/90 text-islamic-navy">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
