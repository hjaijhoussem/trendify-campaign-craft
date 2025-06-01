import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Globe, Edit3, Save, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';

interface ExtractedData {
  title: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  metadata: {
    domain: string;
    url: string;
    extractedAt: Date;
  };
}

const ProductAddUrl = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { notifyProductAdded } = useNotifications();
  
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editableData, setEditableData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Electronics',
    'Clothing & Apparel',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Outdoors',
    'Books & Media',
    'Toys & Games',
    'Food & Beverages',
    'Automotive',
    'Other'
  ];

  const supportedDomains = [
    'amazon.com',
    'ebay.com',
    'shopify.com',
    'etsy.com',
    'walmart.com',
    'target.com',
    'alibaba.com',
    'aliexpress.com'
  ];

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const simulateDataExtraction = async (url: string): Promise<ExtractedData> => {
    // Simulate API call to extract data from URL
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const domain = new URL(url).hostname.replace('www.', '');
    
    // Mock extracted data based on domain
    const mockData: ExtractedData = {
      title: domain.includes('amazon') 
        ? 'Samsung Galaxy S24 Ultra Smartphone'
        : domain.includes('shopify')
        ? 'Premium Organic Cotton T-Shirt'
        : domain.includes('etsy')
        ? 'Handmade Wooden Coffee Table'
        : 'Wireless Bluetooth Headphones',
      description: domain.includes('amazon')
        ? 'Latest flagship smartphone with advanced camera system, 5G connectivity, and all-day battery life. Features a stunning 6.8-inch display and premium build quality.'
        : domain.includes('shopify')
        ? 'Sustainable and comfortable organic cotton t-shirt made from 100% GOTS certified organic cotton. Perfect for everyday wear with a relaxed fit.'
        : domain.includes('etsy')
        ? 'Beautiful handcrafted coffee table made from reclaimed oak wood. Each piece is unique and features natural wood grain patterns. Perfect for modern homes.'
        : 'High-quality wireless headphones with noise cancellation, premium sound quality, and up to 30 hours of battery life. Perfect for music lovers and professionals.',
      price: domain.includes('amazon') 
        ? '1199.99'
        : domain.includes('shopify')
        ? '39.99'
        : domain.includes('etsy')
        ? '299.99'
        : '149.99',
      images: [
        domain.includes('amazon')
          ? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
          : domain.includes('shopify')
          ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
          : domain.includes('etsy')
          ? 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
          : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      ],
      category: domain.includes('amazon') 
        ? 'Electronics'
        : domain.includes('shopify')
        ? 'Clothing & Apparel'
        : domain.includes('etsy')
        ? 'Home & Garden'
        : 'Electronics',
      metadata: {
        domain,
        url,
        extractedAt: new Date()
      }
    };

    return mockData;
  };

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to extract product data.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid HTTP or HTTPS URL.",
        variant: "destructive"
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      const data = await simulateDataExtraction(url);
      setExtractedData(data);
      setEditableData({
        name: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        image: data.images[0] || ''
      });
      
      toast({
        title: "Data Extracted",
        description: "Product information has been successfully extracted from the URL.",
      });
    } catch (error) {
      toast({
        title: "Extraction Failed",
        description: "Failed to extract product data from the URL. Please try again or check if the URL is supported.",
        variant: "destructive"
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!editableData.name || !editableData.description || !editableData.category || !editableData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newProduct = {
        id: Date.now().toString(),
        ...editableData,
        price: parseFloat(editableData.price),
        createdAt: new Date(),
        importedFrom: extractedData?.metadata.url
      };
      
      console.log('New product from URL:', newProduct);
      
      // Show toast notification
      toast({
        title: "Success!",
        description: "Product has been imported successfully.",
      });

      // Add notification to the notification system
      notifyProductAdded(editableData.name, 'url');
      
      navigate('/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setExtractedData(null);
    setEditableData({
      name: '',
      description: '',
      category: '',
      price: '',
      image: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
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
          <h1 className="text-3xl font-bold text-gray-900">Import via URL</h1>
          <p className="text-gray-600 mt-1">Extract product information from any supported e-commerce URL.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            URL Import
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Product URL *</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/product-page"
                  className="flex-1"
                />
                <Button
                  onClick={handleExtract}
                  disabled={isExtracting || !url}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Extract Data
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                <strong>Supported platforms:</strong> {supportedDomains.join(', ')} and many more.
                <br />
                Make sure the URL points to a specific product page for best results.
              </AlertDescription>
            </Alert>
          </div>

          {extractedData && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Extracted Product Information</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      size="sm"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      {isEditing ? 'View Mode' : 'Edit Mode'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      size="sm"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <strong>Source:</strong> {extractedData.metadata.domain} • 
                    <strong> Extracted:</strong> {extractedData.metadata.extractedAt.toLocaleString()}
                  </div>
                  
                  {extractedData.images[0] && (
                    <div className="flex justify-center">
                      <img
                        src={extractedData.images[0]}
                        alt="Product"
                        className="max-w-xs max-h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name *</Label>
                        <Input
                          id="edit-name"
                          value={editableData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter product name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select value={editableData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={editableData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Product description"
                        rows={4}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price (USD) *</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={editableData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                          id="edit-image"
                          value={editableData.image}
                          onChange={(e) => handleInputChange('image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Product
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Product Name</Label>
                        <p className="mt-1 text-gray-900">{editableData.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Category</Label>
                        <p className="mt-1 text-gray-900">{editableData.category}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <p className="mt-1 text-gray-900">{editableData.description}</p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Price</Label>
                        <p className="mt-1 text-gray-900">${editableData.price}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Image URL</Label>
                        <p className="mt-1 text-gray-900 truncate">{editableData.image || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Details
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Import Product
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Tips for URL Import</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Use direct product page URLs for best extraction results</li>
          <li>• Verify extracted information before saving to ensure accuracy</li>
          <li>• Some sites may require manual adjustments to category or description</li>
          <li>• Images are automatically detected but you can provide your own URL</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductAddUrl; 