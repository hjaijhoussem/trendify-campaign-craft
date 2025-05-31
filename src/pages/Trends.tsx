
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const Trends = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
        <p className="text-gray-600 mt-1">Analyze market trends and product performance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Trend Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Trend analysis interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
