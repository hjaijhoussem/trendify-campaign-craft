
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, Megaphone, Calendar } from 'lucide-react';

interface StatsCardsProps {
  totalProducts: number;
  trendingProducts: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
}

export function StatsCards({ 
  totalProducts, 
  trendingProducts, 
  activeCampaigns, 
  scheduledCampaigns 
}: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Trending Now',
      value: trendingProducts,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns,
      icon: Megaphone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Scheduled',
      value: scheduledCampaigns,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
