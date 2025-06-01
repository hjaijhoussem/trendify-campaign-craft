
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Link, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const navigate = useNavigate();

  const handleAddManually = () => {
    navigate('/products/add/manual');
  };

  const handleAddViaCsv = () => {
    navigate('/products/add/csv');
  };

  const handleAddViaUrl = () => {
    navigate('/products/add/url');
  };

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
          <p className="text-gray-600 mt-1">Choose how you'd like to add your product.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddManually}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Add Manually</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Add a single product by filling out a form with product details.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={(e) => {
                e.stopPropagation();
                handleAddManually();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Manually
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddViaCsv}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Add via CSV</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Upload a CSV file to add multiple products at once.
            </p>
            <Button 
              variant="outline"
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                handleAddViaCsv();
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleAddViaUrl}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Link className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-xl">Add via URL</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Import product details by providing a product URL.
            </p>
            <Button 
              variant="outline"
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={(e) => {
                e.stopPropagation();
                handleAddViaUrl();
              }}
            >
              <Link className="mr-2 h-4 w-4" />
              Add via URL
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-w-4xl">
        <h3 className="font-semibold text-gray-900 mb-2">Need help choosing?</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Add Manually:</strong> Best for adding a few products with complete control over all details.</p>
          <p><strong>Add via CSV:</strong> Perfect for bulk imports when you have product data in spreadsheet format.</p>
          <p><strong>Add via URL:</strong> Quick way to import from existing product pages or e-commerce sites.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;
