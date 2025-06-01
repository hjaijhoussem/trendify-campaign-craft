
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Plus, Search, Zap, TrendingUp } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/services/mockData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Products = () => {
  const navigate = useNavigate();
  const { products, setGenerationProgress } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Use mock data if no products in store
  const displayProducts = products.length > 0 ? products : mockProducts;

  const filteredProducts = displayProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateCampaign = (productId: string) => {
    setGenerationProgress({
      step: 1,
      totalSteps: 4,
      currentTask: 'Initializing campaign generation...',
      isComplete: false
    });
    navigate(`/campaign-generator?product=${productId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog and generate campaigns for trending items.</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => navigate('/products/add')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Product Catalog ({filteredProducts.length})
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {product.isTrending && (
                        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <p className="text-sm font-medium text-gray-900 mt-1">${product.price}</p>
                      </div>
                      {product.isTrending && (
                        <div className="text-right">
                          <p className="text-xs text-green-600 font-medium">
                            {product.trendingScore}% trending
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleGenerateCampaign(product.id)}
                        className={`flex-1 ${
                          product.isTrending 
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        <Zap className="mr-1 h-3 w-3" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
