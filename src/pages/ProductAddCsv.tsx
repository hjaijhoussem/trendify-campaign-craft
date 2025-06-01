import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Download, FileText, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/store/useStore';
import { useNotifications } from '@/hooks/useNotifications';

interface CsvProduct {
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
}

const ProductAddCsv = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct, isLoading, error, clearError } = useStore();
  const { notifyBulkProductsImported } = useNotifications();
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCSV(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid CSV file.",
        variant: "destructive"
      });
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers
      const requiredHeaders = ['name', 'description', 'category', 'price', 'imageUrl'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast({
          title: "Invalid CSV Format",
          description: `Missing required columns: ${missingHeaders.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
      
      const data: CsvProduct[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const product: CsvProduct = {
            name: values[headers.indexOf('name')] || '',
            description: values[headers.indexOf('description')] || '',
            category: values[headers.indexOf('category')] || '',
            price: parseFloat(values[headers.indexOf('price')] || '0'),
            imageUrl: values[headers.indexOf('imageUrl')] || 'https://via.placeholder.com/300x200?text=Product+Image'
          };
          
          if (product.name && product.description && product.category && product.price) {
            data.push(product);
          }
        }
      }
      
      setCsvData(data);
      toast({
        title: "CSV Parsed Successfully",
        description: `Found ${data.length} valid products in the CSV file.`,
      });
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (csvData.length === 0) {
      toast({
        title: "No Data",
        description: "Please upload and parse a CSV file first.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    clearError();
    
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    try {
      for (const productData of csvData) {
        try {
          const price = parseFloat(productData.price.toString());
          if (isNaN(price) || price < 0) {
            throw new Error(`Invalid price: ${productData.price}`);
          }

          await addProduct({
            name: productData.name,
            description: productData.description,
            category: productData.category,
            price: price,
            imageUrl: productData.imageUrl
          });
          
          results.successful++;
        } catch (error) {
          results.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push(`${productData.name}: ${errorMessage}`);
        }
      }

      setUploadResults(results);

      if (results.successful > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${results.successful} products${results.failed > 0 ? `, ${results.failed} failed` : ''}.`,
        });

        // Add notification for successful bulk import
        notifyBulkProductsImported(results.successful);

        // If all products were successful, navigate back
        if (results.failed === 0) {
          setTimeout(() => navigate('/products'), 2000);
        }
      } else {
        toast({
          title: "Import Failed",
          description: "No products were successfully imported.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Import Error",
        description: "An unexpected error occurred during import.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "name,description,category,price,imageUrl\n" +
      "Sample Product,This is a sample product description,Electronics,29.99,https://via.placeholder.com/300x200\n" +
      "Another Product,Another sample description,Clothing & Apparel,19.99,https://via.placeholder.com/300x200";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'product_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products/add')}
          className="flex items-center"
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import Products from CSV</h1>
          <p className="text-gray-600 mt-1">Upload a CSV file to bulk import multiple products at once.</p>
        </div>
      </div>

      {/* Show error banner if there's an error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800 text-sm">
                {error}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Download Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Download our CSV template to ensure your file has the correct format.
            </p>
            <Button 
              onClick={downloadTemplate} 
              variant="outline" 
              className="w-full"
              disabled={isProcessing}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
              </div>
              {csvFile && (
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="mr-2 h-4 w-4" />
                  {csvFile.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview ({csvData.length} products found)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Price</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((product, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="p-2">${product.price}</td>
                        <td className="p-2 truncate max-w-xs">{product.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2">
                    ... and {csvData.length - 10} more products
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleUpload} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Importing Products...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import {csvData.length} Products
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {uploadResults.failed === 0 ? (
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="mr-2 h-5 w-5 text-red-600" />
              )}
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">
                      {uploadResults.successful} Successful
                    </span>
                  </div>
                </div>
                
                {uploadResults.failed > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-semibold text-red-900">
                        {uploadResults.failed} Failed
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {uploadResults.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Errors:</h4>
                  <div className="bg-red-50 p-4 rounded-lg max-h-32 overflow-y-auto">
                    <ul className="text-sm text-red-800 space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCsvData([]);
                    setCsvFile(null);
                    setUploadResults(null);
                  }}
                  disabled={isProcessing}
                >
                  Import More
                </Button>
                <Button 
                  onClick={() => navigate('/products')}
                  disabled={isProcessing}
                >
                  View Products
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Required columns: name, description, category, price, imageUrl</li>
          <li>• Use comma-separated values (CSV format)</li>
          <li>• Prices should be numeric values (e.g., 29.99)</li>
          <li>• ImageUrl should be a valid URL or leave empty for placeholder</li>
          <li>• First row should contain column headers</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductAddCsv; 