
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useNavigate } from 'react-router-dom';

interface TrendingProductsProps {
  products: Product[];
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  const navigate = useNavigate();

  const handleGenerateCampaign = (product: Product) => {
    navigate(`/campaigns?product=${product.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
          Trending Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No trending products found</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {product.trendingScore}% trending
                    </Badge>
                    <span className="text-sm text-gray-500">{product.category}</span>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleGenerateCampaign(product)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="mr-1 h-3 w-3" />
                Generate
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
