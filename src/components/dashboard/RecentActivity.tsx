
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Megaphone } from 'lucide-react';
import { Campaign } from '@/types';
import { useStore } from '@/store/useStore';

interface RecentActivityProps {
  campaigns: Campaign[];
}

export function RecentActivity({ campaigns }: RecentActivityProps) {
  const { products } = useStore();

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent campaigns</p>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Megaphone className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">{getProductName(campaign.productId)}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {campaign.platforms.length} platform{campaign.platforms.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
