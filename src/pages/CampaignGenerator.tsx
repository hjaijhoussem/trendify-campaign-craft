
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Youtube, Instagram, Facebook, RefreshCw, Check, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { mockProducts } from '@/services/mockData';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CampaignGenerator = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { generationProgress, setGenerationProgress } = useStore();
  const [showPreviews, setShowPreviews] = useState(false);
  const [approvedPlatforms, setApprovedPlatforms] = useState<string[]>([]);

  const productId = searchParams.get('product');
  const product = mockProducts.find(p => p.id === productId);

  const mockContent = {
    facebook: {
      post: "🚀 Experience the future of audio with our Wireless Bluetooth Earbuds Pro! \n\n✨ Premium noise-cancelling technology\n🔋 30-hour battery life\n💧 Sweat & water resistant\n\nPerfect for workouts, commutes, and everything in between. Your ears deserve the best! \n\n#WirelessEarbuds #TechLife #AudioQuality #LifestyleUpgrade",
      imageDescription: "Modern lifestyle shot showing the earbuds on a clean desk with soft natural lighting, alongside a smartphone and coffee cup"
    },
    instagram: {
      post: "Sound that moves with you 🎧✨\n\nNew Wireless Earbuds Pro are here! Perfect for your active lifestyle 💪\n\n• Crystal clear sound 🎵\n• All-day battery 🔋\n• Premium comfort 😌\n\nReady to upgrade your audio game? Link in bio! \n\n#AudioLife #TechGear #Wireless #LifestyleUpgrade #EarbudsProMax",
      imageDescription: "Instagram-style flat lay with earbuds, case, and lifestyle accessories in aesthetic arrangement"
    },
    youtube: {
      script: "Are you tired of tangled wires ruining your day? Meet the Wireless Bluetooth Earbuds Pro - the game-changer your ears have been waiting for!\n\n[Hold up earbuds] These aren't just any earbuds. With premium noise-cancelling technology, you'll experience music like never before. Whether you're at the gym, on your commute, or just relaxing at home, these earbuds deliver crystal-clear audio with deep, rich bass.\n\nThe best part? 30 hours of battery life means you can listen all day and still have power left over. Plus, they're sweat and water resistant, making them perfect for any adventure.\n\nDon't settle for average audio. Upgrade to the Wireless Earbuds Pro today!",
      thumbnailDescription: "Split screen: left side shows tangled wires mess, right side shows clean wireless earbuds with excited person"
    }
  };

  useEffect(() => {
    if (!product) {
      navigate('/products');
      return;
    }

    // Simulate generation progress
    const steps = [
      { step: 1, task: 'Analyzing product trends...' },
      { step: 2, task: 'Generating Facebook content...' },
      { step: 3, task: 'Creating Instagram posts...' },
      { step: 4, task: 'Writing YouTube script...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress({
          step: steps[currentStep].step,
          totalSteps: 4,
          currentTask: steps[currentStep].task,
          isComplete: false
        });
        currentStep++;
      } else {
        setGenerationProgress({
          step: 4,
          totalSteps: 4,
          currentTask: 'Generation complete!',
          isComplete: true
        });
        setShowPreviews(true);
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [product, setGenerationProgress, navigate]);

  const handleRegenerate = (platform: string) => {
    // Reset progress for specific platform
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
    }, 2000);
  };

  const handleApprove = (platform: string) => {
    setApprovedPlatforms(prev => [...prev, platform]);
  };

  const handleApproveAll = () => {
    setApprovedPlatforms(['facebook', 'instagram', 'youtube']);
    navigate('/campaigns');
  };

  if (!product) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Generator</h1>
          <p className="text-gray-600 mt-1">Generating marketing content for {product.name}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>

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
      {showPreviews && (
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
              <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
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
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  {approvedPlatforms.length} of 3 platforms approved
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button 
                  onClick={handleApproveAll}
                  disabled={approvedPlatforms.length === 3}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {approvedPlatforms.length === 3 ? 'All Approved!' : 'Approve All & Continue'}
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
