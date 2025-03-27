
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreateInput {
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  stock: number;
  featured?: boolean;
}

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
