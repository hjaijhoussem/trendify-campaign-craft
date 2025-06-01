
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Plus, Calendar, Eye, Edit, Trash2, Youtube, Instagram, Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '@/services/mockData';

const Campaigns = () => {
  const navigate = useNavigate();

  // Mock campaign data
  const mockCampaigns = [
    {
      id: '1',
      name: 'Wireless Earbuds Holiday Campaign',
      productId: '1',
      status: 'published' as const,
      platforms: ['youtube', 'instagram', 'facebook'],
      createdAt: '2024-01-15',
      scheduledDate: '2024-01-20'
    },
    {
      id: '2',
      name: 'Smart Watch Fitness Campaign',
      productId: '2',
      status: 'scheduled' as const,
      platforms: ['instagram', 'facebook'],
      createdAt: '2024-01-18',
      scheduledDate: '2024-01-25'
    },
    {
      id: '3',
      name: 'Gaming Headset Draft',
      productId: '3',
      status: 'draft' as const,
      platforms: ['youtube'],
      createdAt: '2024-01-20',
      scheduledDate: undefined
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="h-4 w-4 text-red-600" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const handleCreateCampaign = () => {
    navigate('/products');
  };

  const handleViewCampaign = (campaignId: string) => {
    // For demo, redirect to campaign generator with first product
    navigate(`/campaign-generator?product=${mockProducts[0].id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage your marketing campaigns.</p>
        </div>
        <Button 
          onClick={handleCreateCampaign}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Megaphone className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">12</p>
                <p className="text-gray-600 text-sm">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">3</p>
                <p className="text-gray-600 text-sm">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">8</p>
                <p className="text-gray-600 text-sm">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">1</p>
                <p className="text-gray-600 text-sm">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="mr-2 h-5 w-5" />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCampaigns.map((campaign) => {
              const product = mockProducts.find(p => p.id === campaign.productId);
              return (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Product: {product?.name || 'Unknown Product'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Platforms:</span>
                          {campaign.platforms.map((platform) => (
                            <div key={platform} className="flex items-center">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created: {campaign.createdAt}
                          {campaign.scheduledDate && ` • Scheduled: ${campaign.scheduledDate}`}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCampaign(campaign.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;
