import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Upload as UploadIcon, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/store/useStore';
import { useNotifications } from '@/hooks/useNotifications';

const ProductAddManual = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProduct, isLoading, error, clearError } = useStore();
  const { notifyProductAdded } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: 'https://via.placeholder.com/300x200?text=Product+Image'
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);

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

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    // Clear any previous errors
    clearError();
    
    try {
      // Create the product object
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        imageUrl: formData.imageUrl
      };
      
      // Add product via API
      await addProduct(productData);
      
      console.log('Added product:', productData);
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Product has been added to your catalog.",
      });

      // Add notification
      notifyProductAdded(formData.name, 'manual');
      
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/products/add')}
          className="flex items-center"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Product Manually</h1>
          <p className="text-gray-600 mt-1">Enter product details to add a new item to your catalog.</p>
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
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isLoading}
                >
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
                disabled={isLoading}
              />
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
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="flex items-center"
                    disabled={isLoading}
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  {imageFile && (
                    <span className="text-sm text-gray-600">
                      {imageFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image Preview</Label>
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Product preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
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
                    <Save className="mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Results</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-quality images (minimum 300x200 pixels)</li>
          <li>• Write detailed descriptions to help customers understand your product</li>
          <li>• Choose the most relevant category for better discoverability</li>
          <li>• Consider competitive pricing for your market segment</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductAddManual; 