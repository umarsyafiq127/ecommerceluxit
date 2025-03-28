
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProductById, updateProduct } from "../services/ProductService";
import { Product } from "../types/Product";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const AdminProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      return;
    }

    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await getProductById(id);
        
        if (!productData) {
          toast({
            title: "Product Not Found",
            description: "The requested product could not be found",
            variant: "destructive",
          });
          navigate("/admin");
          return;
        }
        
        setProduct(productData);
        
        // Set form values
        setName(productData.name);
        setPrice(productData.price.toString());
        setDescription(productData.description);
        setCategory(productData.category);
        setStock(productData.stock.toString());
        setFeatured(productData.featured);
        setImageUrls(productData.images.length > 0 ? productData.images : [""]);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isAuthenticated, isAdmin, navigate]);

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    setImageUrls(updatedUrls);
  };

  const addImageUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImageUrlField = (index: number) => {
    if (imageUrls.length <= 1) return;
    
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !product) return;
    
    try {
      setSaving(true);
      
      // Validate form
      if (!name.trim()) {
        toast({
          title: "Validation Error",
          description: "Product name is required",
          variant: "destructive",
        });
        return;
      }
      
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        toast({
          title: "Validation Error",
          description: "Price must be a positive number",
          variant: "destructive",
        });
        return;
      }
      
      const numericStock = parseInt(stock);
      if (isNaN(numericStock) || numericStock < 0) {
        toast({
          title: "Validation Error",
          description: "Stock must be a non-negative number",
          variant: "destructive",
        });
        return;
      }
      
      // Filter out empty image URLs
      const filteredImageUrls = imageUrls.filter(url => url.trim() !== "");
      
      // Update product
      const updatedProduct = await updateProduct(id, {
        name: name.trim(),
        price: numericPrice,
        description: description.trim(),
        category: category.trim(),
        stock: numericStock,
        featured,
        images: filteredImageUrls
      });
      
      if (updatedProduct) {
        toast({
          title: "Product Updated",
          description: "The product has been updated successfully",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update the product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-start justify-center">
        <div className="w-16 h-16 border-4 border-islamic-gold/20 border-t-islamic-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center text-islamic-teal mb-4 hover:text-islamic-green transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>
        
        <h1 className="heading-primary mb-4">Edit Product</h1>
        <p className="text-gray-600 max-w-2xl">
          Update the product information and save changes.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      step="1"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter product category"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageUrlField(index)}
                      className="text-red-500"
                      disabled={imageUrls.length <= 1}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageUrlField}
                  className="w-full mt-2"
                >
                  Add Another Image URL
                </Button>
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    url && (
                      <div key={`preview-${index}`} className="aspect-square rounded-md border overflow-hidden bg-gray-100">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            // Set a placeholder if image fails to load
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border mb-4">
                  <div className="aspect-square w-full bg-gray-100">
                    {imageUrls[0] ? (
                      <img
                        src={imageUrls[0]}
                        alt={name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          // Set a placeholder if image fails to load
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-lg">{name || "Product Name"}</h3>
                    <p className="text-islamic-gold font-medium mt-1">
                      ${parseFloat(price || "0").toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                      {description || "Product description"}
                    </p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {category || "Category"}
                      </span>
                      <span className="text-sm text-gray-600">
                        Stock: {stock || "0"}
                      </span>
                    </div>
                    
                    {featured && (
                      <div className="mt-2">
                        <span className="inline-block bg-islamic-gold/10 text-islamic-gold text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-islamic-green hover:bg-islamic-green/90 w-full flex items-center justify-center space-x-2"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEditPage;
