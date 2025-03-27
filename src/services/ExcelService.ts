
import { Product, ProductCreateInput } from '../types/Product';
import * as XLSX from 'xlsx';

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
};

// Parse Excel file into product data
export const parseExcelToProducts = (file: File): Promise<ProductCreateInput[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform to ProductCreateInput format
        const products: ProductCreateInput[] = jsonData.map((row: any) => {
          return {
            name: row['Product Name'] || '',
            price: typeof row['Price'] === 'number' ? row['Price'] : parseFloat(row['Price']) || 0,
            description: row['Description'] || '',
            category: row['Category'] || '',
            stock: typeof row['Stock Quantity'] === 'number' ? 
              row['Stock Quantity'] : parseInt(row['Stock Quantity']) || 0,
            featured: row['Featured (true/false)'] === 'true' || row['Featured (true/false)'] === true,
            images: row['Images (URLs separated by comma)'] ? 
              row['Images (URLs separated by comma)'].split(',').map((url: string) => url.trim()) : []
          };
        }).filter((product: ProductCreateInput) => product.name && product.price > 0);
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
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
