import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Youtube, Instagram, Facebook, RefreshCw, Check, Zap, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import React from 'react';

const CampaignGenerator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products, generationProgress, setGenerationProgress, getProductById, isLoading } = useStore();
  const [showPreviews, setShowPreviews] = useState(false);
  const [approvedPlatforms, setApprovedPlatforms] = useState<string[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  const productId = searchParams.get('product');

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setProductError('No product ID provided');
        setIsLoadingProduct(false);
        return;
      }

      try {
        setIsLoadingProduct(true);
        setProductError(null);
        
        // First check if product exists in store
        const existingProduct = products.find(p => p.id === productId);
        if (existingProduct) {
          setProduct(existingProduct);
          setIsLoadingProduct(false);
          return;
        }

        // If not in store, fetch from API
        const fetchedProduct = await getProductById(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setProductError('Product not found');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        setProductError('Failed to load product');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    loadProduct();
  }, [productId, products, getProductById]);

  // Generate mock content based on actual product data
  const generateMockContent = (product: any) => {
    if (!product) return null;

    // Clean product name and category for hashtags
    const cleanProductName = product.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '');
    const cleanCategory = product.category.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '');
    
    // Truncate description for Instagram
    const shortDescription = product.description.length > 50 
      ? product.description.substring(0, 50) + '...'
      : product.description;

    return {
      facebook: {
        post: `🚀 Discover the amazing ${product.name}! \n\n✨ ${product.description}\n💰 Starting at $${product.price}\n\nPerfect for ${product.category.toLowerCase()} enthusiasts! Your life deserves this upgrade! \n\n#${cleanCategory} #${cleanProductName} #QualityProducts #LifestyleUpgrade`,
        imageDescription: `Professional product shot of ${product.name} with modern lifestyle setting and natural lighting`
      },
      instagram: {
        post: `${product.name} is here! ✨\n\nElevate your ${product.category.toLowerCase()} game 💪\n\n• Premium quality 🌟\n• Affordable price 💰\n• ${shortDescription} 😌\n\nReady to upgrade? Link in bio! \n\n#${cleanCategory} #${cleanProductName} #QualityLife #Upgrade`,
        imageDescription: `Instagram-style flat lay featuring ${product.name} with lifestyle accessories in aesthetic arrangement`
      },
      youtube: {
        script: `Looking for the perfect ${product.category.toLowerCase()}? Meet the ${product.name} - the game-changer you've been waiting for!\n\n[Hold up product] This isn't just any ${product.category.toLowerCase()}. ${product.description}\n\nAt just $${product.price}, you get incredible value without compromising on quality. Whether you're a beginner or expert, this ${product.name} delivers exactly what you need.\n\nDon't settle for average. Upgrade to ${product.name} today and experience the difference!`,
        thumbnailDescription: `Split screen: before and after using ${product.name}, showing transformation and excitement`
      }
    };
  };

  // Generate content only when product is available and regenerate on product change
  const mockContent = useMemo(() => {
    return product ? generateMockContent(product) : null;
  }, [product]);

  useEffect(() => {
    if (!product || !mockContent) {
      console.log('Missing product or content:', { product: !!product, mockContent: !!mockContent });
      return;
    }

    console.log('Starting generation for product:', product.name);

    // Reset states when product changes
    setShowPreviews(false);
    setApprovedPlatforms([]);

    // Simulate generation progress
    const steps = [
      { step: 1, task: 'Analyzing product trends...' },
      { step: 2, task: 'Generating Facebook content...' },
      { step: 3, task: 'Creating Instagram posts...' },
      { step: 4, task: 'Writing YouTube script...' }
    ];

    let currentStep = 0;
    
    // Start progress immediately
    setGenerationProgress({
      step: 1,
      totalSteps: 4,
      currentTask: steps[0].task,
      isComplete: false
    });

    const interval = setInterval(() => {
      currentStep++;
      
      if (currentStep < steps.length) {
        console.log(`Progress: Step ${currentStep + 1} - ${steps[currentStep].task}`);
        setGenerationProgress({
          step: currentStep + 1,
          totalSteps: 4,
          currentTask: steps[currentStep].task,
          isComplete: false
        });
      } else {
        console.log('Generation complete! Showing previews...');
        setGenerationProgress({
          step: 4,
          totalSteps: 4,
          currentTask: 'Generation complete!',
          isComplete: true
        });
        
        // Show previews after a short delay
        setTimeout(() => {
          console.log('Setting showPreviews to true');
          setShowPreviews(true);
        }, 500);
        
        clearInterval(interval);
      }
    }, 2000); // Increased to 2 seconds per step for better visibility

    return () => {
      console.log('Cleaning up generation effect');
      clearInterval(interval);
    };
  }, [product, mockContent, setGenerationProgress]); // Added mockContent back

  const handleRegenerate = (platform: string) => {
    // Reset progress for specific platform
    setShowPreviews(false);
    setGenerationProgress({
      step: 2,
      totalSteps: 4,
      currentTask: `Regenerating ${platform} content...`,
      isComplete: false
    });

    setTimeout(() => {
      setGenerationProgress({
        step: 4,
        totalSteps: 4,
        currentTask: 'Regeneration complete!',
        isComplete: true
      });
      
      // Show previews again
      setTimeout(() => {
        setShowPreviews(true);
      }, 500);
    }, 3000);
  };

  const handleApprove = (platform: string) => {
    setApprovedPlatforms(prev => [...prev, platform]);
  };

  const handleApproveAll = () => {
    setApprovedPlatforms(['facebook', 'instagram', 'youtube']);
    navigate('/campaigns');
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Generator</h1>
            <p className="text-gray-600 mt-1">Loading product information...</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Product</h3>
            <p className="text-gray-600">
              Fetching product information for campaign generation...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Generator</h1>
            <p className="text-gray-600 mt-1">Unable to load product</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-6">
              {productError || 'The product you selected could not be found.'}
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
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Generator</h1>
          <p className="text-gray-600 mt-1">Generating marketing content for {product.name}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Product Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
              }}
            />
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">{product.category} • ${product.price}</p>
              {product.isTrend && (
                <Badge className="bg-green-100 text-green-800 mt-1">
                  <Zap className="mr-1 h-3 w-3" />
                  Trending {product.trendingPercentage}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      {generationProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-blue-600" />
              Generation Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>{generationProgress.currentTask}</span>
                <span>{generationProgress.step}/{generationProgress.totalSteps}</span>
              </div>
              <Progress value={(generationProgress.step / generationProgress.totalSteps) * 100} />
              {generationProgress.isComplete && (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Ready for review
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Previews */}
      {showPreviews && mockContent && (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Facebook Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                  Facebook
                </div>
                {approvedPlatforms.includes('facebook') && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm whitespace-pre-line">{mockContent.facebook.post}</p>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Image:</strong> {mockContent.facebook.imageDescription}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRegenerate('Facebook')}
                  className="flex-1"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regenerate
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleApprove('facebook')}
                  disabled={approvedPlatforms.includes('facebook')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instagram Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Instagram className="mr-2 h-5 w-5 text-pink-600" />
                  Instagram
                </div>
                {approvedPlatforms.includes('instagram') && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm whitespace-pre-line">{mockContent.instagram.post}</p>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Image:</strong> {mockContent.instagram.imageDescription}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRegenerate('Instagram')}
                  className="flex-1"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regenerate
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleApprove('instagram')}
                  disabled={approvedPlatforms.includes('instagram')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* YouTube Preview */}
          <Card className="hover:shadow-lg transition-shadow lg:col-span-2 xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Youtube className="mr-2 h-5 w-5 text-red-600" />
                  YouTube
                </div>
                {approvedPlatforms.includes('youtube') && (
                  <Badge className="bg-green-100 text-green-800">
                    <Check className="mr-1 h-3 w-3" />
                    Approved
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm whitespace-pre-line">{mockContent.youtube.script}</p>
              </div>
              <div className="text-xs text-gray-600">
                <strong>Thumbnail:</strong> {mockContent.youtube.thumbnailDescription}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleRegenerate('YouTube')}
                  className="flex-1"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Regenerate
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleApprove('youtube')}
                  disabled={approvedPlatforms.includes('youtube')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      {showPreviews && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Approved: {approvedPlatforms.length}/3 platforms
                </p>
              </div>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/products')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApproveAll}
                  disabled={approvedPlatforms.length === 3}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  {approvedPlatforms.length === 3 ? 'All Approved' : 'Approve All & Continue'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignGenerator;
