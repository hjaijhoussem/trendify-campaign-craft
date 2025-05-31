
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const Products = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-1">Manage your product catalog and track trending items.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Product Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Product management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
