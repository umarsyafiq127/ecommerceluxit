
import { Product, ProductCreateInput, ProductFilterOptions } from "../types/Product";
import { v4 as uuidv4 } from 'uuid';

// Mock storage - in a real app, this would be replaced with API calls
let mockProducts: Product[] = [
  {
    id: "1",
    name: "Hand-crafted Prayer Rug",
    price: 129.99,
    description: "A beautifully hand-crafted prayer rug made from the finest materials. Features traditional Islamic geometric patterns with gold accents.",
    images: [
      "https://images.unsplash.com/photo-1584286595398-2483189ce673?auto=format&fit=crop&q=80", 
      "https://images.unsplash.com/photo-1575369428451-eda9ae50a2e6?auto=format&fit=crop&q=80"
    ],
    category: "Prayer Essentials",
    stock: 15,
    featured: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  },
  {
    id: "2",
    name: "Premium Digital Quran",
    price: 249.99,
    description: "Digital Quran with beautiful recitation, translations, and tafsir. High-quality audio and elegant design.",
    images: [
      "https://images.unsplash.com/photo-1609599006353-e629aaabeb38?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1619373512888-6d8aa4bf60fa?auto=format&fit=crop&q=80"
    ],
    category: "Islamic Literature",
    stock: 8,
    featured: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10")
  },
  {
    id: "3",
    name: "Traditional Attar Set",
    price: 79.99,
    description: "Set of 5 premium alcohol-free attars in elegant glass bottles. Includes musk, oud, amber, rose, and jasmine scents.",
    images: [
      "https://images.unsplash.com/photo-1623491355342-a521abb3e86f?auto=format&fit=crop&q=80"
    ],
    category: "Personal Care",
    stock: 20,
    featured: false,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05")
  },
  {
    id: "4",
    name: "Elegant Hijab - Emerald",
    price: 34.99,
    description: "Premium quality hijab made from breathable fabric. Elegant emerald color with subtle pattern.",
    images: [
      "https://images.unsplash.com/photo-1607868894064-2b6e7ed1b324?auto=format&fit=crop&q=80"
    ],
    category: "Clothing",
    stock: 30,
    featured: false,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-03-20")
  },
  {
    id: "5",
    name: "Islamic Calligraphy Art",
    price: 199.99,
    description: "Beautiful hand-made Islamic calligraphy art piece. Perfect for decorating your home or as a gift.",
    images: [
      "https://images.unsplash.com/photo-1618076516180-c15281f0c885?auto=format&fit=crop&q=80"
    ],
    category: "Home Decor",
    stock: 5,
    featured: true,
    createdAt: new Date("2023-04-12"),
    updatedAt: new Date("2023-04-12")
  }
];

// Get all products with filtering options
export const getProducts = async (
  options: ProductFilterOptions = {}
): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
          return (a.createdAt.getTime() - b.createdAt.getTime()) * sortOrder;
        default:
          return 0;
      }
    });
  }
  
  return filteredProducts;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const product = mockProducts.find(p => p.id === id);
  return product || null;
};

// Create a new product
export const createProduct = async (
  productData: ProductCreateInput
): Promise<Product> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const now = new Date();
  const newProduct: Product = {
    id: uuidv4(),
    ...productData,
    featured: productData.featured || false,
    createdAt: now,
    updatedAt: now
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: Partial<ProductCreateInput>
): Promise<Product | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productIndex = mockProducts.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return null;
  }
  
  const updatedProduct = {
    ...mockProducts[productIndex],
    ...productData,
    updatedAt: new Date()
  };
  
  mockProducts[productIndex] = updatedProduct;
  
  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const initialLength = mockProducts.length;
  mockProducts = mockProducts.filter(p => p.id !== id);
  
  return mockProducts.length < initialLength;
};

// Bulk import products from Excel (simulated)
export const bulkImportProducts = async (
  productsData: ProductCreateInput[]
): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const now = new Date();
  const newProducts: Product[] = productsData.map(productData => ({
    id: uuidv4(),
    ...productData,
    featured: productData.featured || false,
    createdAt: now,
    updatedAt: now
  }));
  
  mockProducts = [...mockProducts, ...newProducts];
  
  return newProducts;
};

// Get product categories (for filters)
export const getProductCategories = async (): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const categories = Array.from(new Set(mockProducts.map(p => p.category)));
  return categories;
};
