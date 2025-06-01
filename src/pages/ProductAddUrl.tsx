import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Globe, Edit3, Save, RefreshCw, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/hooks/useNotifications';
import { useStore } from '@/store/useStore';

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

interface ScrapedData {
  name: string;
  description: string;
  category: string;
  price: string;
  keywords: string;
  imageUrl: string;
}

const ProductAddUrl = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct, isLoading, error, clearError } = useStore();
  const { notifyProductAdded } = useNotifications();
  
  const [url, setUrl] = useState('');
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [canEdit, setCanEdit] = useState(false);

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

  const handleScrapeUrl = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid product URL.",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }

    setIsScrapingUrl(true);
    
    try {
      // Simulate scraping delay and mock data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock scraped data based on the URL
      const mockData: ScrapedData = {
        name: extractProductNameFromUrl(url),
        description: 'Product description scraped from the provided URL. This is a high-quality product with excellent features and great value for money.',
        category: 'Electronics', // Default category
        price: (Math.random() * 100 + 10).toFixed(2),
        keywords: 'product,quality,affordable', // Default keywords
        imageUrl: 'https://via.placeholder.com/300x200?text=Scraped+Image'
      };
      
      setScrapedData(mockData);
      setCanEdit(true);
      
      toast({
        title: "Product Information Extracted",
        description: "Review and edit the extracted information before adding to your catalog.",
      });
    } catch (error) {
      toast({
        title: "Scraping Failed",
        description: "Unable to extract product information from the URL. Please try manually adding the product.",
        variant: "destructive"
      });
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const extractProductNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Extract potential product name from URL path
      const segments = pathname.split('/').filter(segment => segment.length > 0);
      const lastSegment = segments[segments.length - 1];
      
      // Convert URL-friendly format to readable name
      if (lastSegment) {
        return lastSegment
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .substring(0, 50);
      }
      
      return 'Imported Product';
    } catch {
      return 'Imported Product';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (scrapedData) {
      setScrapedData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scrapedData) {
      toast({
        title: "No Product Data",
        description: "Please scrape a URL first to get product information.",
        variant: "destructive"
      });
      return;
    }

    if (!scrapedData.name || !scrapedData.description || !scrapedData.category || !scrapedData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(scrapedData.price);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    // Validate and format keywords
    let processedKeywords = '';
    if (scrapedData.keywords.trim()) {
      // Remove spaces and ensure comma separation
      processedKeywords = scrapedData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0)
        .join(',');
      
      if (processedKeywords !== scrapedData.keywords.replace(/\s+/g, '')) {
        toast({
          title: "Keywords Formatted",
          description: "Keywords have been formatted to remove spaces and ensure proper comma separation.",
        });
      }
    }

    // Clear any previous errors
    clearError();
    
    try {
      const productData = {
        name: scrapedData.name,
        description: scrapedData.description,
        category: scrapedData.category,
        price: price,
        imageUrl: scrapedData.imageUrl,
        keywords: processedKeywords || undefined
      };
      
      // Add product via API
      await addProduct(productData);
      
      console.log('Added product from URL:', productData);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Product has been imported and added to your catalog.",
      });

      // Add notification
      notifyProductAdded(scrapedData.name, 'url');
      
      navigate('/products');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add product';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setUrl('');
    setScrapedData(null);
    setCanEdit(false);
    clearError();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products/add')}
          className="flex items-center"
          disabled={isScrapingUrl || isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import from URL</h1>
          <p className="text-gray-600 mt-1">Extract product information from any product page URL.</p>
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

      {!scrapedData ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Product URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Product Page URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/product-page"
                  disabled={isScrapingUrl}
                />
              </div>
              
              <Button 
                onClick={handleScrapeUrl}
                disabled={isScrapingUrl || !url}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isScrapingUrl ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Extracting Product Information...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Extract Product Information
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 text-sm">
                Product information extracted successfully! Review and edit the details below.
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Extracted Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={scrapedData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={scrapedData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-2 border rounded-md"
                      required
                      disabled={!canEdit || isLoading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={scrapedData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product in detail..."
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    required
                    disabled={!canEdit || isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={scrapedData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="iphone,apple,smartphone,mobile"
                    disabled={!canEdit || isLoading}
                  />
                  <p className="text-sm text-gray-500">
                    Enter keywords separated by commas (no spaces). Example: iphone,apple,smartphone
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={scrapedData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={scrapedData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <img
                      src={scrapedData.imageUrl}
                      alt="Product preview"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Start Over
                  </Button>
                  
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/products/add')}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Add Product
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Supported Websites</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Amazon product pages</li>
          <li>• eBay listings</li>
          <li>• Shopify stores</li>
          <li>• WooCommerce sites</li>
          <li>• Most e-commerce platforms</li>
        </ul>
        <p className="text-xs text-blue-700 mt-2">
          Note: Some websites may block automated scraping. Manual entry may be required for certain sites.
        </p>
      </div>
    </div>
  );
};

export default ProductAddUrl; 