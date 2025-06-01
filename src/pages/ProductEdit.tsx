import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload as UploadIcon, Trash2, Package, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/store/useStore';
import { useNotifications } from '@/hooks/useNotifications';

const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { getProductById, updateProduct, deleteProduct, isLoading, error, clearError } = useStore();
  const { notifyProductUpdated } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    keywords: '',
    imageUrl: ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productNotFound, setProductNotFound] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

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

  // Load product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setProductNotFound(true);
        setIsLoadingProduct(false);
        return;
      }

      try {
        setIsLoadingProduct(true);
        clearError();
        
        const product = await getProductById(id);
        
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price.toString(),
            keywords: product.keywords || '',
            imageUrl: product.imageUrl
          });
        } else {
          setProductNotFound(true);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        setProductNotFound(true);
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, getProductById, clearError]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // In a real app, you'd upload to a service and get a URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Product ID is missing.",
        variant: "destructive"
      });
      return;
    }

    // Validate and format keywords
    let processedKeywords = '';
    if (formData.keywords.trim()) {
      // Remove spaces and ensure comma separation
      processedKeywords = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0)
        .join(',');
      
      if (processedKeywords !== formData.keywords.replace(/\s+/g, '')) {
        toast({
          title: "Keywords Formatted",
          description: "Keywords have been formatted to remove spaces and ensure proper comma separation.",
        });
      }
    }

    setIsUpdating(true);
    
    try {
      const updatedProductData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        imageUrl: formData.imageUrl,
        keywords: processedKeywords || undefined
      };
      
      // Update product via API
      await updateProduct(id, updatedProductData);
      
      console.log('Updated product:', updatedProductData);
      
      // Show toast notification
      toast({
        title: "Success!",
        description: "Product has been updated successfully.",
      });

      // Add notification to the notification system
      notifyProductUpdated(formData.name);
      
      navigate('/products');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Product ID is missing.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      // Delete product via API
      await deleteProduct(id);
      
      toast({
        title: "Product Deleted",
        description: "The product has been removed from your catalog.",
      });
      
      navigate('/products');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Loading product information...</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Product</h3>
            <p className="text-gray-600">
              Fetching product information...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Product not found state
  if (productNotFound) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
            <p className="text-gray-600 mt-1">The product you're looking for doesn't exist.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">
              The product you're trying to edit doesn't exist or may have been deleted.
            </p>
            <Button onClick={() => navigate('/products')}>
              Return to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update the product information in your catalog.</p>
        </div>
      </div>

      {/* Show error banner if there's an error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product in detail..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => handleInputChange('keywords', e.target.value)}
                placeholder="iphone,apple,smartphone,mobile"
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
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Product Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('imageUrl')?.click()}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload New Image
                  </Button>
                  {imageFile && (
                    <span className="text-sm text-gray-600">
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={formData.imageUrl}
                    alt="Product preview"
                    className="max-w-xs max-h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </>
                )}
              </Button>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/products')}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-orange-50 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-2">Important Notes</h3>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Updating a product will preserve its trending data and campaign history</li>
          <li>• Image changes may take a few minutes to reflect across the platform</li>
          <li>• Price changes will not affect existing campaigns but will apply to new ones</li>
          <li>• Deleting a product cannot be undone and will remove all associated data</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductEdit; 