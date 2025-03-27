
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
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
          className="flex items-center space-x-2 text-islamic-navy"
          onClick={closeMenu}
        >
          <div className="h-10 w-10 rounded-full bg-islamic-gold/20 flex items-center justify-center">
            <span className="font-arabic text-lg font-bold text-islamic-gold">ﻷ</span>
          </div>
          <span className="font-serif text-xl font-semibold">Baraqah</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-islamic-green ${
              isActive("/") ? "text-islamic-green" : "text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium transition-colors hover:text-islamic-green ${
              isActive("/products") ? "text-islamic-green" : "text-foreground"
            }`}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-islamic-green ${
              isActive("/about") ? "text-islamic-green" : "text-foreground"
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-islamic-green ${
              isActive("/contact") ? "text-islamic-green" : "text-foreground"
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="p-2 text-foreground hover:text-islamic-green transition-colors">
            <ShoppingCart size={20} />
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium px-3 py-2 rounded-md bg-islamic-navy text-white hover:bg-islamic-navy/90 transition-colors">
                  Admin Dashboard
                </Link>
              )}
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-sm font-medium"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 text-sm font-medium">
              <User size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
              isActive("/") ? "text-islamic-green" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-sm font-medium p-2 ${
              isActive("/products") ? "text-islamic-green" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium p-2 ${
              isActive("/about") ? "text-islamic-green" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-medium p-2 ${
              isActive("/contact") ? "text-islamic-green" : "text-foreground"
            }`}
            onClick={closeMenu}
          >
            Contact
          </Link>
          
          <div className="pt-2 border-t border-gray-200">
            <Link
              to="/cart"
              className="flex items-center space-x-2 p-2"
              onClick={closeMenu}
            >
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Cart</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium p-2 bg-islamic-navy text-white rounded-md"
                    onClick={closeMenu}
                  >
                    Admin Dashboard
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
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2"
                onClick={closeMenu}
              >
                <User size={18} />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
