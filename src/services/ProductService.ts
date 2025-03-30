
import { Product, ProductCreateInput, ProductFilterOptions } from "../types/Product";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";

// Mock storage - in a real app, this would be replaced with API calls
let mockProducts: Product[] = [
  {
    id: "1",
    name: "Sajadah Premium Handmade",
    price: 129.99,
    description: "Sajadah premium buatan tangan dari bahan berkualitas tinggi. Menampilkan pola geometris Islam tradisional dengan aksen emas.",
    images: [
      "https://images.unsplash.com/photo-1584286595398-2483189ce673?auto=format&fit=crop&q=80", 
      "https://images.unsplash.com/photo-1575369428451-eda9ae50a2e6?auto=format&fit=crop&q=80"
    ],
    category: "Perlengkapan Ibadah",
    stock: 15,
    featured: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Air Zam-zam Asli 1L",
    price: 249.99,
    description: "Air zam-zam asli dari Mekkah dalam kemasan khusus yang aman dan higienis. Telah tersertifikasi dan diuji keasliannya.",
    images: [
      "https://images.unsplash.com/photo-1609599006353-e629aaabeb38?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1619373512888-6d8aa4bf60fa?auto=format&fit=crop&q=80"
    ],
    category: "Air Zam-zam",
    stock: 8,
    featured: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10")
  },
  {
    id: "3",
    name: "Paket Parfum Attar Arabian",
    price: 79.99,
    description: "Set 5 parfum attar premium bebas alkohol dalam botol kaca elegan. Termasuk wewangian musk, oud, amber, rose, dan jasmine.",
    images: [
      "https://images.unsplash.com/photo-1623491355342-a521abb3e86f?auto=format&fit=crop&q=80"
    ],
    category: "Parfum & Minyak Wangi",
    stock: 20,
    featured: false,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05")
  },
  {
    id: "4",
    name: "Jilbab Elegant - Hijau Zamrud",
    price: 34.99,
    description: "Jilbab premium berkualitas tinggi terbuat dari bahan yang nyaman dan adem. Warna hijau zamrud elegan dengan motif halus.",
    images: [
      "https://images.unsplash.com/photo-1607868894064-2b6e7ed1b324?auto=format&fit=crop&q=80"
    ],
    category: "Busana Muslim",
    stock: 30,
    featured: false,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-03-20")
  },
  {
    id: "5",
    name: "Kurma Ajwa Premium 1kg",
    price: 199.99,
    description: "Kurma Ajwa asli dari Madinah berkualitas premium. Dikemas dengan hati-hati agar tetap segar dan lezat.",
    images: [
      "https://images.unsplash.com/photo-1618076516180-c15281f0c885?auto=format&fit=crop&q=80"
    ],
    category: "Kurma & Makanan",
    stock: 5,
    featured: true,
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2023-04-12")
  }
];

// Helper function to ensure we have valid dates when working with the products
const ensureDates = (product: Product): Product => {
  return {
    ...product,
    createdAt: product.createdAt instanceof Date ? product.createdAt : new Date(product.createdAt),
    updatedAt: product.updatedAt instanceof Date ? product.updatedAt : new Date(product.updatedAt)
  };
};

// Save products to localStorage for persistence
const saveProductsToStorage = () => {
  try {
    localStorage.setItem('products', JSON.stringify(mockProducts));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

// Load products from localStorage on module load
const loadProductsFromStorage = () => {
  try {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsedProducts = JSON.parse(savedProducts);
      mockProducts = parsedProducts.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
  }
};

// Initialize by loading from localStorage
loadProductsFromStorage();

// Get all products with filtering options
export const getProducts = async (
  options: ProductFilterOptions = {}
): Promise<Product[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredProducts = [...mockProducts];
    
    // Filter by category
    if (options.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === options.category
      );
    }
    
    // Filter by price range
    if (options.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price >= options.minPrice!
      );
    }
    
    if (options.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.price <= options.maxPrice!
      );
    }
    
    // Filter by featured
    if (options.featured !== undefined) {
      filteredProducts = filteredProducts.filter(
        product => product.featured === options.featured
      );
    }
    
    // Search
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sorting
    if (options.sortBy) {
      filteredProducts.sort((a, b) => {
        const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
        
        switch (options.sortBy) {
          case 'price':
            return (a.price - b.price) * sortOrder;
          case 'name':
            return a.name.localeCompare(b.name) * sortOrder;
          case 'createdAt':
            return (ensureDates(a).createdAt.getTime() - ensureDates(b).createdAt.getTime()) * sortOrder;
          default:
            return 0;
        }
      });
    }
    
    return filteredProducts.map(ensureDates);
  } catch (error) {
    console.error("Error getting products:", error);
    toast({
      title: "Error",
      description: "Failed to load products",
      variant: "destructive",
    });
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === id);
    return product ? ensureDates(product) : null;
  } catch (error) {
    console.error("Error getting product by ID:", error);
    toast({
      title: "Error",
      description: "Failed to load product details",
      variant: "destructive",
    });
    return null;
  }
};

// Create a new product
export const createProduct = async (
  productData: ProductCreateInput
): Promise<Product> => {
  try {
    // Validate required fields
    if (!productData.name || productData.price === undefined || !productData.category) {
      throw new Error("Missing required fields");
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date();
    const newProduct: Product = {
      id: uuidv4(),
      ...productData,
      featured: productData.featured || false,
      createdAt: now,
      updatedAt: now
    };
    
    mockProducts.push(newProduct);
    saveProductsToStorage();
    
    toast({
      title: "Product Created",
      description: "The product has been created successfully",
    });
    
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    toast({
      title: "Error",
      description: "Failed to create product",
      variant: "destructive",
    });
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: Partial<ProductCreateInput>
): Promise<Product | null> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      toast({
        title: "Product Not Found",
        description: "The product you're trying to update doesn't exist",
        variant: "destructive",
      });
      return null;
    }
    
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: new Date()
    };
    
    mockProducts[productIndex] = updatedProduct;
    saveProductsToStorage();
    
    toast({
      title: "Product Updated",
      description: "The product has been updated successfully",
    });
    
    return ensureDates(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    toast({
      title: "Error",
      description: "Failed to update product",
      variant: "destructive",
    });
    return null;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const initialLength = mockProducts.length;
    mockProducts = mockProducts.filter(p => p.id !== id);
    
    const success = mockProducts.length < initialLength;
    
    if (success) {
      saveProductsToStorage();
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully",
      });
    } else {
      toast({
        title: "Product Not Found",
        description: "The product you're trying to delete doesn't exist",
        variant: "destructive",
      });
    }
    
    return success;
  } catch (error) {
    console.error("Error deleting product:", error);
    toast({
      title: "Error",
      description: "Failed to delete product",
      variant: "destructive",
    });
    return false;
  }
};

// Bulk import products from Excel (simulated)
export const bulkImportProducts = async (
  productsData: ProductCreateInput[]
): Promise<Product[]> => {
  try {
    // Validate data
    if (!Array.isArray(productsData) || productsData.length === 0) {
      toast({
        title: "Import Error",
        description: "No valid products data found",
        variant: "destructive",
      });
      return [];
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const now = new Date();
    const newProducts: Product[] = productsData.map(productData => ({
      id: uuidv4(),
      ...productData,
      featured: productData.featured || false,
      createdAt: now,
      updatedAt: now
    }));
    
    mockProducts = [...mockProducts, ...newProducts];
    saveProductsToStorage();
    
    toast({
      title: "Products Imported",
      description: `Successfully imported ${newProducts.length} products`,
    });
    
    return newProducts;
  } catch (error) {
    console.error("Error importing products:", error);
    toast({
      title: "Import Error",
      description: "Failed to import products",
      variant: "destructive",
    });
    return [];
  }
};

// Get product categories (for filters)
export const getProductCategories = async (): Promise<string[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categories = Array.from(new Set(mockProducts.map(p => p.category)));
    return categories;
  } catch (error) {
    console.error("Error getting product categories:", error);
    toast({
      title: "Error",
      description: "Failed to load product categories",
      variant: "destructive",
    });
    return [];
  }
};
