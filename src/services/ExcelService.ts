
import { Product, ProductCreateInput } from '../types/Product';
import * as XLSX from 'xlsx';
import { toast } from "@/hooks/use-toast";

// Template for Excel export/import
const EXCEL_HEADERS = [
  { key: 'name', label: 'Product Name' },
  { key: 'price', label: 'Price' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock Quantity' },
  { key: 'featured', label: 'Featured (true/false)' },
  { key: 'images', label: 'Images (URLs separated by comma)' }
];

// Export products to Excel file
export const exportProductsToExcel = (products: Product[]): void => {
  const worksheetData = products.map(product => ({
    'Product Name': product.name,
    'Price': product.price,
    'Description': product.description,
    'Category': product.category,
    'Stock Quantity': product.stock,
    'Featured (true/false)': product.featured ? 'true' : 'false',
    'Images (URLs separated by comma)': product.images.join(',')
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
  
  // Generate file and trigger download
  XLSX.writeFile(workbook, "products_export.xlsx");
};

// Export empty template for data entry
export const exportEmptyTemplate = (): void => {
  const templateData = [
    {
      'Product Name': 'Example Product',
      'Price': 99.99,
      'Description': 'Product description goes here',
      'Category': 'Category Name',
      'Stock Quantity': 10,
      'Featured (true/false)': 'false',
      'Images (URLs separated by comma)': 'https://example.com/image1.jpg,https://example.com/image2.jpg'
    },
    // Empty row for users to fill
    {
      'Product Name': '',
      'Price': '',
      'Description': '',
      'Category': '',
      'Stock Quantity': '',
      'Featured (true/false)': '',
      'Images (URLs separated by comma)': ''
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Product Template");
  
  // Generate file and trigger download
  XLSX.writeFile(workbook, "product_import_template.xlsx");
  
  toast({
    title: "Template Downloaded",
    description: "Product import template has been downloaded successfully"
  });
};

// Parse Excel file into product data
export const parseExcelToProducts = (file: File): Promise<ProductCreateInput[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          toast({
            title: "Error",
            description: "Failed to read uploaded file",
            variant: "destructive",
          });
          throw new Error("Failed to read file");
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          toast({
            title: "Error",
            description: "The Excel file appears to be empty",
            variant: "destructive",
          });
          throw new Error("Empty Excel file");
        }
        
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Raw Excel data:", jsonData);
        
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          toast({
            title: "Error",
            description: "No data found in the Excel file",
            variant: "destructive",
          });
          throw new Error("No data in Excel file");
        }
        
        // Transform to ProductCreateInput format
        const products: ProductCreateInput[] = jsonData.map((row: any) => {
          // Log each row for debugging
          console.log("Processing row:", row);
          
          // Handle both possible column naming patterns
          const productName = row['Product Name'] || row['name'] || '';
          const price = typeof row['Price'] === 'number' ? row['Price'] : 
                       typeof row['price'] === 'number' ? row['price'] : 
                       parseFloat(row['Price'] || row['price'] || '0') || 0;
          
          const description = row['Description'] || row['description'] || '';
          const category = row['Category'] || row['category'] || '';
          
          const stock = typeof row['Stock Quantity'] === 'number' ? row['Stock Quantity'] : 
                       typeof row['stock'] === 'number' ? row['stock'] : 
                       parseInt(row['Stock Quantity'] || row['stock'] || '0') || 0;
          
          const featuredStr = row['Featured (true/false)'] || row['featured'] || 'false';
          const featured = featuredStr === 'true' || featuredStr === true;
          
          const imagesStr = row['Images (URLs separated by comma)'] || row['images'] || '';
          const images = typeof imagesStr === 'string' ? imagesStr.split(',').map((url: string) => url.trim()) : [];
          
          return {
            name: productName,
            price: price,
            description: description,
            category: category,
            stock: stock,
            featured: featured,
            images: images
          };
        }).filter((product: ProductCreateInput) => product.name && product.price > 0);
        
        console.log("Parsed products:", products);
        resolve(products);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      toast({
        title: "Error",
        description: "Error reading the file. Please try again.",
        variant: "destructive",
      });
      reject(new Error("Error reading file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Export product data validation
export const validateProductsData = (products: ProductCreateInput[]): { 
  valid: boolean; 
  errors: { row: number; message: string }[] 
} => {
  const errors: { row: number; message: string }[] = [];
  
  products.forEach((product, index) => {
    // Validate required fields
    if (!product.name) {
      errors.push({ row: index + 1, message: 'Product name is required' });
    }
    
    if (!product.price || product.price <= 0) {
      errors.push({ row: index + 1, message: 'Price must be greater than 0' });
    }
    
    if (!product.category) {
      errors.push({ row: index + 1, message: 'Category is required' });
    }
    
    if (!product.stock || product.stock < 0) {
      errors.push({ row: index + 1, message: 'Stock must be a non-negative number' });
    }
    
    // Validate image URLs
    if (product.images.length > 0) {
      product.images.forEach((url, urlIndex) => {
        if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) {
          errors.push({ 
            row: index + 1, 
            message: `Invalid image URL at position ${urlIndex + 1}` 
          });
        }
      });
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
