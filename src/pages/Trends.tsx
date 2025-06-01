
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mockProducts, mockTrendData } from '@/services/mockData';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Trends = () => {
  const navigate = useNavigate();
  const { setGenerationProgress } = useStore();

  const trendingProducts = mockProducts.filter(product => product.isTrending);

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
        <p className="text-gray-600 mt-1">Analyze market trends and product performance to optimize your campaigns.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trendingProducts.map((product) => {
          const trendData = mockTrendData.find(t => t.productId === product.id);
          return (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {product.trendingScore}% ↗
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                
                {trendData && (
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Trending: {trendData.keyword}</p>
                      <p className="text-gray-600">+{trendData.percentage}% increase</p>
                    </div>
                    
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData.timeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" hide />
                          <YAxis hide />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-xs text-gray-500">
                      <p className="font-medium">Why it's trending:</p>
                      <p>{trendData.reason}</p>
                    </div>

                    <Button 
                      onClick={() => handleGenerateCampaign(product.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Generate Campaign
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
            Related Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTrendData.map((trend) => (
              <div key={trend.productId} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">{trend.keyword}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trend.relatedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Trends;
