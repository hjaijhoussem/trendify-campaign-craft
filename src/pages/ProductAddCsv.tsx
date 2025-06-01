import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useNotifications } from '@/hooks/useNotifications';

interface CsvRow {
  name: string;
  description: string;
  category: string;
  price: string;
  image?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const ProductAddCsv = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifyBulkProductsImported } = useNotifications();
  
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const requiredColumns = ['name', 'description', 'category', 'price'];
  const optionalColumns = ['image'];
  const allColumns = [...requiredColumns, ...optionalColumns];

  const validateCsvData = (data: CsvRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      // Check required fields
      requiredColumns.forEach(column => {
        if (!row[column as keyof CsvRow] || row[column as keyof CsvRow].trim() === '') {
          errors.push({
            row: index + 1,
            field: column,
            message: `${column} is required`
          });
        }
      });
      
      // Validate price
      if (row.price && isNaN(parseFloat(row.price))) {
        errors.push({
          row: index + 1,
          field: 'price',
          message: 'Price must be a valid number'
        });
      }
      
      // Validate price is positive
      if (row.price && parseFloat(row.price) < 0) {
        errors.push({
          row: index + 1,
          field: 'price',
          message: 'Price must be positive'
        });
      }
    });
    
    return errors;
  };

  const parseCsv = (text: string): CsvRow[] => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data: CsvRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        if (allColumns.includes(header)) {
          row[header] = values[index] || '';
        }
      });
      
      data.push(row);
    }
    
    return data;
  };

  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (!uploadedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCsv(text);
      setCsvData(data);
      
      if (data.length > 0) {
        const errors = validateCsvData(data);
        setValidationErrors(errors);
        setPreviewMode(true);
        
        if (errors.length === 0) {
          toast({
            title: "File Validated",
            description: `${data.length} products ready for import.`,
          });
        } else {
          toast({
            title: "Validation Issues",
            description: `Found ${errors.length} issues that need to be fixed.`,
            variant: "destructive"
          });
        }
      }
    };
    
    reader.readAsText(uploadedFile);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Cannot Import",
        description: "Please fix validation errors before importing.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Here you would typically call your API to import the products
      console.log('Importing products:', csvData);
      
      // Show toast notification
      toast({
        title: "Success!",
        description: `${csvData.length} products imported successfully.`,
      });

      // Add notification to the notification system
      notifyBulkProductsImported(csvData.length);
      
      navigate('/products');
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const headers = allColumns.join(',');
    const sampleData = [
      'Sample Product,This is a sample product description,Electronics,99.99,https://example.com/image.jpg',
      'Another Product,Another sample description,Clothing & Apparel,29.99,'
    ];
    
    const csvContent = [headers, ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products/add')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload CSV File</h1>
          <p className="text-gray-600 mt-1">Import multiple products at once using a CSV file.</p>
        </div>
      </div>

      {!previewMode ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                CSV File Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    Drop your CSV file here, or click to browse
                  </p>
                  <p className="text-gray-600">
                    Supports CSV files up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById('csv-upload')?.click()}
                >
                  Browse Files
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Need a template?</h3>
                  <p className="text-sm text-gray-600">Download our CSV template with sample data.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Format Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Required Columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    {requiredColumns.map(column => (
                      <span key={column} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optional Columns:</h4>
                  <div className="flex flex-wrap gap-2">
                    {optionalColumns.map(column => (
                      <span key={column} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• First row should contain column headers</p>
                  <p>• Use commas to separate values</p>
                  <p>• Price should be a number (e.g., 19.99)</p>
                  <p>• Image should be a valid URL (optional)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  {validationErrors.length === 0 ? (
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
                  )}
                  Preview: {file?.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {csvData.length} products found
                  {validationErrors.length > 0 && (
                    <span className="text-red-600"> • {validationErrors.length} validation errors</span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreviewMode(false);
                    setFile(null);
                    setCsvData([]);
                    setValidationErrors([]);
                  }}
                >
                  Upload Different File
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={validationErrors.length > 0 || isUploading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isUploading ? 'Importing...' : 'Import Products'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {validationErrors.length > 0 && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Validation Errors Found:</strong>
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {validationErrors.slice(0, 5).map((error, index) => (
                        <li key={index}>
                          Row {error.row}, {error.field}: {error.message}
                        </li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li>... and {validationErrors.length - 5} more errors</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {isUploading && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Importing products...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead className="w-16">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.slice(0, 10).map((row, index) => {
                      const rowErrors = validationErrors.filter(e => e.row === index + 1);
                      const hasErrors = rowErrors.length > 0;
                      
                      return (
                        <TableRow key={index} className={hasErrors ? 'bg-red-50' : ''}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className={rowErrors.some(e => e.field === 'name') ? 'text-red-600' : ''}>
                            {row.name || '-'}
                          </TableCell>
                          <TableCell className={`max-w-xs truncate ${rowErrors.some(e => e.field === 'description') ? 'text-red-600' : ''}`}>
                            {row.description || '-'}
                          </TableCell>
                          <TableCell className={rowErrors.some(e => e.field === 'category') ? 'text-red-600' : ''}>
                            {row.category || '-'}
                          </TableCell>
                          <TableCell className={rowErrors.some(e => e.field === 'price') ? 'text-red-600' : ''}>
                            {row.price ? `$${row.price}` : '-'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {row.image || '-'}
                          </TableCell>
                          <TableCell>
                            {hasErrors ? (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {csvData.length > 10 && (
                  <div className="p-4 text-center text-sm text-gray-500 border-t">
                    Showing first 10 of {csvData.length} products
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductAddCsv; 