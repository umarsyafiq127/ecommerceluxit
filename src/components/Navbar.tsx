
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  Home,
  Tag,
  ShoppingCart,
  Menu,
  X,
  Info,
  Phone,
  LogIn,
  LogOut,
  User,
  ShoppingBag,
  History
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "../hooks/use-mobile";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl text-islamic-navy">
            BerkahStores
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link to="/recent-orders">
            <Button variant="ghost" size="sm" className="flex items-center">
              <History className="mr-1 h-4 w-4" />
              Recent Orders
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Info className="mr-1 h-4 w-4" />
              About
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Phone className="mr-1 h-4 w-4" />
              Contact
            </Button>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          {/* Cart Button */}
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 rounded-full"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-islamic-gold text-white"
                  variant="outline"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu (Desktop) */}
          <div className="hidden md:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        onClick={() => navigate("/admin")}
                        className="cursor-pointer"
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-islamic-green hover:bg-islamic-green/90"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 md:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobile && menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link to="/" onClick={closeMenu}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/products" onClick={closeMenu}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-full justify-start"
              >
                <Tag className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link to="/recent-orders" onClick={closeMenu}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-full justify-start"
              >
                <History className="mr-2 h-4 w-4" />
                Recent Orders
              </Button>
            </Link>
            <Link to="/about" onClick={closeMenu}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-full justify-start"
              >
                <Info className="mr-2 h-4 w-4" />
                About
              </Button>
            </Link>
            <Link to="/contact" onClick={closeMenu}>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center w-full justify-start"
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center w-full justify-start"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center w-full justify-start text-red-500"
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center w-full justify-start bg-islamic-green hover:bg-islamic-green/90"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
