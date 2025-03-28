import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { bulkImportProducts } from "../services/ProductService";
import { ProductCreateInput } from "../types/Product";
import { parseExcelToProducts, validateProductsData, exportEmptyTemplate } from "../services/ExcelService";
import { Upload, FileText, Download, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminImportPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [processedData, setProcessedData] = useState<ProductCreateInput[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; message: string }[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importComplete, setImportComplete] = useState(false);
  
  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleDownloadTemplate = () => {
    try {
      exportEmptyTemplate();
      toast({
        title: "Template Downloaded",
        description: "The template has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading template:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the template",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check file type
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        toast({
          title: "Invalid File",
          description: "Please upload an Excel file (.xlsx or .xls)",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setFile(selectedFile);
      setProcessedData([]);
      setValidationErrors([]);
      setImportComplete(false);
      
      toast({
        title: "File Selected",
        description: `Selected file: ${selectedFile.name}`,
      });
    }
  };

  const handleProcessFile = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to process",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Processing file:", file.name);
      const products = await parseExcelToProducts(file);
      console.log("Parsed products:", products);
      
      const validation = validateProductsData(products);
      
      setProcessedData(products);
      setValidationErrors(validation.errors);
      
      if (validation.errors.length > 0) {
        toast({
          title: "Validation Issues",
          description: `Found ${validation.errors.length} issues in your data.`,
          variant: "destructive",
        });
      } else if (products.length === 0) {
        toast({
          title: "No Products Found",
          description: "No valid products found in the Excel file. Please check the template format.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "File Processed",
          description: `Successfully processed ${products.length} products.`,
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process the Excel file. Please check the format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (processedData.length === 0) {
      toast({
        title: "No Products to Import",
        description: "There are no products to import. Please process a file first.",
        variant: "destructive",
      });
      return;
    }
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Errors",
        description: "Please fix the validation errors before importing.",
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    setImportProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          const next = prev + Math.random() * 15;
          return next > 90 ? 90 : next;
        });
      }, 300);
      
      console.log("Importing products:", processedData);
      
      // Actual import
      const importedProducts = await bulkImportProducts(processedData);
      
      clearInterval(progressInterval);
      setImportProgress(100);
      setImportComplete(true);
      
      toast({
        title: "Import Successful",
        description: `Successfully imported ${importedProducts.length} products.`,
      });
    } catch (error) {
      console.error("Error importing products:", error);
      toast({
        title: "Import Error",
        description: "Failed to import products.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setProcessedData([]);
    setValidationErrors([]);
    setImportProgress(0);
    setImportComplete(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Reset Complete",
      description: "You can now start a new import.",
    });
  };

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
        
        <h1 className="heading-primary mb-4">Bulk Import Products</h1>
        <p className="text-gray-600 max-w-2xl">
          Upload an Excel file to import multiple products at once. Download our
          template for the correct format.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Steps</CardTitle>
              <CardDescription>
                Follow these steps to import your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center">
                    <span className="text-islamic-navy font-medium text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Download Template</h3>
                    <p className="text-sm text-gray-500">
                      Get our Excel template with the correct format
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center">
                    <span className="text-islamic-navy font-medium text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Fill the Template</h3>
                    <p className="text-sm text-gray-500">
                      Add your product data to the template
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center">
                    <span className="text-islamic-navy font-medium text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Upload File</h3>
                    <p className="text-sm text-gray-500">
                      Upload your completed Excel file
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-islamic-cream flex items-center justify-center">
                    <span className="text-islamic-navy font-medium text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Validate & Import</h3>
                    <p className="text-sm text-gray-500">
                      Review the data and start the import
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDownloadTemplate} 
                className="w-full flex items-center justify-center space-x-2"
              >
                <Download size={16} />
                <span>Download Template</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Product Data</CardTitle>
              <CardDescription>
                Upload your Excel file with product information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!file ? (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium">
                      Upload Excel File
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      File must be in .xlsx or .xls format
                    </p>
                    <div className="mt-6">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button
                          type="button"
                          className="bg-islamic-green hover:bg-islamic-green/90 flex items-center space-x-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={16} />
                          <span>Select File</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 p-3 bg-islamic-cream/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-islamic-teal" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={resetImport}
                      className="text-red-500"
                      disabled={isProcessing || isImporting}
                    >
                      Remove
                    </Button>
                  </div>

                  {processedData.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Processed Data</h3>
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-full ${validationErrors.length === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                            {validationErrors.length === 0 ? (
                              <Check size={16} className="text-green-600" />
                            ) : (
                              <AlertCircle size={16} className="text-red-600" />
                            )}
                          </div>
                          <span className={validationErrors.length === 0 ? 'text-green-600' : 'text-red-600'}>
                            {validationErrors.length === 0
                              ? `${processedData.length} products ready to import`
                              : `${validationErrors.length} validation issues found`}
                          </span>
                        </div>
                      </div>

                      <div className="border rounded-lg overflow-hidden mb-4">
                        <div className="max-h-64 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {processedData.map((product, index) => (
                                <TableRow key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{product.name}</TableCell>
                                  <TableCell>{product.category}</TableCell>
                                  <TableCell>${product.price.toFixed(2)}</TableCell>
                                  <TableCell>{product.stock}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      {validationErrors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2 text-red-600">
                            Validation Errors
                          </h3>
                          <div className="border border-red-200 rounded-lg overflow-hidden">
                            <div className="max-h-32 overflow-y-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Row</TableHead>
                                    <TableHead>Error</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {validationErrors.map((error, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{error.row}</TableCell>
                                      <TableCell className="text-red-600">
                                        {error.message}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      )}

                      {isImporting && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Import Progress</h3>
                          <Progress value={importProgress} className="h-2 mb-2" />
                          <p className="text-sm text-gray-500">
                            {importProgress < 100
                              ? `Importing products (${Math.round(importProgress)}%)...`
                              : "Import complete!"}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <Button
                        onClick={handleProcessFile}
                        disabled={isProcessing}
                        className="bg-islamic-teal hover:bg-islamic-teal/90"
                      >
                        {isProcessing ? "Processing..." : "Process File"}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/admin")}>
                Cancel
              </Button>
              
              {processedData.length > 0 && (
                <>
                  {importComplete ? (
                    <Button
                      onClick={() => navigate("/admin")}
                      className="bg-islamic-green hover:bg-islamic-green/90"
                    >
                      Return to Dashboard
                    </Button>
                  ) : (
                    <Button
                      onClick={handleImport}
                      disabled={isImporting || validationErrors.length > 0}
                      className="bg-islamic-green hover:bg-islamic-green/90"
                    >
                      {isImporting ? "Importing..." : "Start Import"}
                    </Button>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminImportPage;
