import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, ArrowRight, Package, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Trends = () => {
  const navigate = useNavigate();
  const { products, isLoading, error, fetchProducts, setGenerationProgress, clearError } = useStore();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Clear any errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Filter products that are trending
  const trendingProducts = products.filter(product => product.isTrend === true);

  const handleGenerateCampaign = (productId: string) => {
    setGenerationProgress({
      step: 1,
      totalSteps: 4,
      currentTask: 'Initializing campaign generation...',
      isComplete: false
    });
    navigate(`/campaign-generator?product=${productId}`);
  };

  // Generate mock time data for trending visualization
  const generateTrendData = (percentage: number) => {
    const days = 7;
    const data = [];
    const baseValue = Math.max(percentage - 20, 10);
    
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: baseValue + (percentage - baseValue) * (i / (days - 1)) + (Math.random() * 5 - 2.5)
      });
    }
    return data;
  };

  // Generate trend reason based on category and percentage
  const getTrendReason = (category: string, percentage: number) => {
    const reasons: Record<string, string[]> = {
      'Electronics': [
        'New product launches and holiday shopping season driving demand',
        'Latest technology trends and consumer electronics popularity',
        'Seasonal demand spike for electronic gadgets'
      ],
      'Clothing & Apparel': [
        'Fashion week influence and seasonal wardrobe updates',
        'Celebrity endorsements and social media trends',
        'New collection launches and style preferences'
      ],
      'Home & Garden': [
        'Home improvement projects and seasonal gardening',
        'Interior design trends and home renovation popularity',
        'Outdoor living and garden setup seasonal demand'
      ],
      'Health & Beauty': [
        'Wellness trends and self-care routine popularity',
        'New beauty product launches and influencer recommendations',
        'Health consciousness and beauty routine changes'
      ]
    };

    const categoryReasons = reasons[category] || [
      'Increased consumer interest and market demand',
      'Social media influence and trending topics',
      'Seasonal preferences and consumer behavior shifts'
    ];

    return categoryReasons[Math.floor(Math.random() * categoryReasons.length)];
  };

  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze market trends and product performance to optimize your campaigns.</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Trends</h3>
            <p className="text-gray-600">
              Analyzing trending products...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze market trends and product performance to optimize your campaigns.</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Trends</h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Button onClick={fetchProducts}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
          <p className="text-gray-600 mt-1">Analyze market trends and product performance to optimize your campaigns.</p>
        </div>
        {isLoading && (
          <div className="flex items-center text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Refreshing...
          </div>
        )}
      </div>

      {/* Show error banner if there's an error but we have cached products */}
      {error && products.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800 text-sm">
                {error} - Showing cached data
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {trendingProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Trending Products</h3>
            <p className="text-gray-600 mb-6">
              There are no trending products at the moment. Products become trending based on market analysis and performance metrics.
            </p>
            <Button onClick={() => navigate('/products')}>
              View All Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingProducts.map((product) => {
              const trendData = generateTrendData(product.trendingPercentage || 0);
              const trendReason = getTrendReason(product.category, product.trendingPercentage || 0);
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {product.trendingPercentage || 0}% ↗
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Category: {product.category}</p>
                        <p className="text-gray-600">+{product.trendingPercentage || 0}% trending</p>
                        {product.keywords && (
                          <p className="text-xs text-gray-500 mt-1">
                            Keywords: {product.keywords}
                          </p>
                        )}
                      </div>
                      
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip 
                              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Trend Score']}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
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
                        <p>{trendReason}</p>
                      </div>

                      <Button 
                        onClick={() => handleGenerateCampaign(product.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Related Keywords Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Trending Categories & Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(trendingProducts.map(p => p.category))).map((category) => {
                  const categoryProducts = trendingProducts.filter(p => p.category === category);
                  const avgTrending = Math.round(
                    categoryProducts.reduce((sum, p) => sum + (p.trendingPercentage || 0), 0) / categoryProducts.length
                  );
                  
                  // Extract keywords from all products in this category
                  const allKeywords = categoryProducts
                    .map(p => p.keywords)
                    .filter(Boolean)
                    .join(',')
                    .split(',')
                    .map(k => k.trim())
                    .filter(k => k.length > 0);
                  
                  const uniqueKeywords = Array.from(new Set(allKeywords)).slice(0, 6);

                  return (
                    <div key={category} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{category}</h4>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {avgTrending}% avg trending
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {uniqueKeywords.length > 0 ? (
                          uniqueKeywords.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            No keywords available
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {categoryProducts.length} trending product{categoryProducts.length !== 1 ? 's' : ''} in this category
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Trends;
