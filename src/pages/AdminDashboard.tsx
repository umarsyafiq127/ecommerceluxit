
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProducts, deleteProduct } from "../services/ProductService";
import { Product } from "../types/Product";
import { Edit, Trash2, Plus, FileText, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product | "";
    direction: "asc" | "desc";
  }>({ key: "", direction: "asc" });
  
  // For delete confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteProduct(productToDelete.id);
      
      if (success) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        toast({
          title: "Product Deleted",
          description: `${productToDelete.name} has been deleted successfully`,
        });
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete the product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    
    setSortConfig({ key, direction });
  };

  const filteredProducts = products
    .filter((product) => {
      if (!searchTerm) return true;
      
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const key = sortConfig.key;
      
      if (key === "price" || key === "stock") {
        return sortConfig.direction === "asc"
          ? (a[key] as number) - (b[key] as number)
          : (b[key] as number) - (a[key] as number);
      }
      
      if (key === "createdAt" || key === "updatedAt") {
        return sortConfig.direction === "asc"
          ? new Date(a[key]).getTime() - new Date(b[key]).getTime()
          : new Date(b[key]).getTime() - new Date(a[key]).getTime();
      }
      
      const aValue = String(a[key]).toLowerCase();
      const bValue = String(b[key]).toLowerCase();
      
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-start justify-center">
        <div className="w-16 h-16 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="heading-primary mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 max-w-2xl">
          Manage your product inventory, upload new products, and track your store's performance.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <Link to="/admin/import">
            <Button variant="outline" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Import Products</span>
            </Button>
          </Link>
          
          <Link to="/admin/products/new">
            <Button className="bg-islamic-green hover:bg-islamic-green/90 flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center space-x-1 font-medium"
                  >
                    <span>Product Name</span>
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("category")}
                    className="flex items-center space-x-1 font-medium"
                  >
                    <span>Category</span>
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("price")}
                    className="flex items-center space-x-1 font-medium"
                  >
                    <span>Price</span>
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("stock")}
                    className="flex items-center space-x-1 font-medium"
                  >
                    <span>Stock</span>
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("updatedAt")}
                    className="flex items-center space-x-1 font-medium"
                  >
                    <span>Last Updated</span>
                    <ArrowUpDown size={14} />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500 mb-2">No products found</p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mx-auto"
                      >
                        Clear Search
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="group">
                    <TableCell className="font-mono text-xs text-gray-500">
                      {product.id.substring(0, 6)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded bg-islamic-cream overflow-hidden flex-shrink-0">
                          {product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-islamic-gold/40 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/admin/products/${product.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-islamic-teal opacity-70 group-hover:opacity-100"
                          >
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 opacity-70 group-hover:opacity-100"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{productToDelete?.name}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
