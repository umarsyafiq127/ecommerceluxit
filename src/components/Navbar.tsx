
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-ahsan-merah"
          onClick={closeMenu}
        >
          <img 
            src="/lovable-uploads/6facb05b-682d-4172-81da-b35f8425046c.png" 
            alt="Toko Ahsan Logo" 
            className="h-12"
          />
          <span className="font-serif text-xl font-semibold hidden md:block">Toko Ahsan</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-ahsan-merah ${
              isActive("/") ? "text-ahsan-merah" : "text-foreground"
            }`}
          >
            Beranda
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium transition-colors hover:text-ahsan-merah ${
              isActive("/products") ? "text-ahsan-merah" : "text-foreground"
            }`}
          >
            Produk
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-ahsan-merah ${
              isActive("/about") ? "text-ahsan-merah" : "text-foreground"
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-ahsan-merah ${
              isActive("/contact") ? "text-ahsan-merah" : "text-foreground"
            }`}
          >
            Kontak
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="p-2 text-foreground hover:text-ahsan-merah transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-ahsan-merah text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium px-3 py-2 rounded-md bg-ahsan-merah-tua text-white hover:bg-ahsan-merah-tua/90 transition-colors">
                  Dashboard Admin
                </Link>
              )}
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-sm font-medium"
              >
                Keluar
              </Button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 text-sm font-medium">
              <User size={18} />
              <span>Masuk</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <Link to="/cart" className="p-2 text-foreground hover:text-ahsan-merah transition-colors relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-ahsan-merah text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button
            className="p-2 text-foreground focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "max-h-[70vh] border-t overflow-y-auto" : "max-h-0 overflow-hidden border-t-0"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link
            to="/"
            className={`text-sm font-medium p-2 ${
              isActive("/") ? "text-ahsan-merah" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Beranda
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium p-2 ${
              isActive("/products") ? "text-ahsan-merah" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Produk
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium p-2 ${
              isActive("/about") ? "text-ahsan-merah" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Tentang Kami
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium p-2 ${
              isActive("/contact") ? "text-ahsan-merah" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Kontak
          </Link>
          
          <div className="pt-2 border-t border-gray-200">
            <Link
              to="/cart"
              className="flex items-center space-x-2 p-2"
              onClick={closeMenu}
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Keranjang</span>
              {totalItems > 0 && (
                <span className="bg-ahsan-merah text-white text-xs px-2 py-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium p-2 bg-ahsan-merah-tua text-white rounded-md"
                    onClick={closeMenu}
                  >
                    Dashboard Admin
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-sm font-medium justify-start p-2"
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2"
                onClick={closeMenu}
              >
                <User size={18} />
                <span className="text-sm font-medium">Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
