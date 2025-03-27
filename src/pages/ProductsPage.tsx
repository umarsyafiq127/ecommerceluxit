
import React, { useState, useEffect } from "react";
import { getProducts, getProductCategories } from "../services/ProductService";
import { Product, ProductFilterOptions } from "../types/Product";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPriceInStore, setMaxPriceInStore] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortOption, setSortOption] = useState<string>("createdAt-desc");

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const fetchedCategories = await getProductCategories();
        setCategories(fetchedCategories);
        
        // Fetch all products
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        
        // Get max price for range slider
        if (fetchedProducts.length > 0) {
          const maxPrice = Math.max(...fetchedProducts.map(p => p.price));
          const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
          setMaxPriceInStore(roundedMaxPrice);
          setPriceRange([0, roundedMaxPrice]);
        }
      } catch (err) {
        setError("Gagal memuat produk");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        // Parse sort option
        const [sortBy, sortOrder] = sortOption.split("-") as [
          "price" | "createdAt" | "name",
          "asc" | "desc"
        ];
        
        // Build filter options
        const filterOptions: ProductFilterOptions = {
          search: searchTerm,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
          sortOrder
        };
        
        if (selectedCategory) {
          filterOptions.category = selectedCategory;
        }
        
        if (onlyFeatured) {
          filterOptions.featured = true;
        }
        
        // Fetch filtered products
        const filtered = await getProducts(filterOptions);
        setFilteredProducts(filtered);
      } catch (err) {
        console.error("Error menerapkan filter:", err);
      }
    };

    applyFilters();
  }, [searchTerm, priceRange, selectedCategory, onlyFeatured, sortOption]);

  const resetFilters = () => {
    setSearchTerm("");
    setPriceRange([0, maxPriceInStore]);
    setSelectedCategory("");
    setOnlyFeatured(false);
    setSortOption("createdAt-desc");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-start justify-center">
        <div className="w-16 h-16 border-4 border-ahsan-emas/20 border-t-ahsan-emas rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl font-serif mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-8 text-center">
        <div className="animate-fade-in">
          <h1 className="heading-primary mb-4">Produk Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan koleksi pilihan produk oleh-oleh haji & umroh premium kami, yang dibuat dengan perhatian dan detail.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-auto flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border-ahsan-krem focus:border-ahsan-emas"
            />
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
            <Select 
              value={sortOption} 
              onValueChange={(value) => setSortOption(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Urutkan berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Terbaru</SelectItem>
                <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
                <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
                <SelectItem value="name-asc">Nama: A ke Z</SelectItem>
                <SelectItem value="name-desc">Nama: Z ke A</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={toggleFilters}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal size={16} />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Panel Filter */}
        <div
          className={`mt-4 p-6 bg-white rounded-lg shadow-md animate-fade-in transition-all duration-300 ${
            showFilters ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-medium">Filter</h2>
            <Button variant="ghost" onClick={resetFilters} className="text-sm">
              Reset Semua
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="mb-2 block">Kategori</Label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Rentang Harga (Rp{Math.round(priceRange[0] * 15000)} - Rp{Math.round(priceRange[1] * 15000)})</Label>
              <Slider
                value={[priceRange[0], priceRange[1]]}
                min={0}
                max={maxPriceInStore}
                step={10}
                onValueChange={(newValue) => setPriceRange([newValue[0], newValue[1]])}
                className="mt-6"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={onlyFeatured}
                  onCheckedChange={(checked) => setOnlyFeatured(checked as boolean)}
                />
                <Label htmlFor="featured">Hanya Produk Unggulan</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Aktif */}
        {(searchTerm || selectedCategory || onlyFeatured || priceRange[0] > 0 || priceRange[1] < maxPriceInStore) && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-500">Filter Aktif:</span>
            
            {searchTerm && (
              <div className="inline-flex items-center px-3 py-1 bg-ahsan-krem rounded-full text-sm">
                Pencarian: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-2 text-gray-500 hover:text-ahsan-merah"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {selectedCategory && (
              <div className="inline-flex items-center px-3 py-1 bg-ahsan-krem rounded-full text-sm">
                Kategori: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("")}
                  className="ml-2 text-gray-500 hover:text-ahsan-merah"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {onlyFeatured && (
              <div className="inline-flex items-center px-3 py-1 bg-ahsan-krem rounded-full text-sm">
                Produk Unggulan
                <button
                  onClick={() => setOnlyFeatured(false)}
                  className="ml-2 text-gray-500 hover:text-ahsan-merah"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {(priceRange[0] > 0 || priceRange[1] < maxPriceInStore) && (
              <div className="inline-flex items-center px-3 py-1 bg-ahsan-krem rounded-full text-sm">
                Harga: Rp{Math.round(priceRange[0] * 15000)} - Rp{Math.round(priceRange[1] * 15000)}
                <button
                  onClick={() => setPriceRange([0, maxPriceInStore])}
                  className="ml-2 text-gray-500 hover:text-ahsan-merah"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid Produk */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <h3 className="heading-tertiary mb-4">Tidak ada produk ditemukan</h3>
          <p className="text-gray-600 mb-6">
            Coba sesuaikan kriteria pencarian atau filter Anda
          </p>
          <Button onClick={resetFilters}>Reset Filter</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="stagger-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
