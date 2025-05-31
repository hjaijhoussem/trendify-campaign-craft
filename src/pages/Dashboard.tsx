
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { mockProducts, mockTrendData, mockCampaigns } from '@/services/mockData';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TrendingProducts } from '@/components/dashboard/TrendingProducts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { products, campaigns, trendData, setTrendData } = useStore();

  useEffect(() => {
    // Initialize mock data if empty
    if (products.length === 0) {
      mockProducts.forEach(product => {
        useStore.getState().addProduct(product);
      });
    }
    if (campaigns.length === 0) {
      mockCampaigns.forEach(campaign => {
        useStore.getState().addCampaign(campaign);
      });
    }
    if (trendData.length === 0) {
      setTrendData(mockTrendData);
    }
  }, [products.length, campaigns.length, trendData.length, setTrendData]);

  const trendingProducts = products.filter(p => p.isTrending);
  const activeCampaigns = campaigns.filter(c => c.status === 'published' || c.status === 'scheduled');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's trending for your business.</p>
        </div>
        <QuickActions />
      </div>

      <StatsCards 
        totalProducts={products.length}
        trendingProducts={trendingProducts.length}
        activeCampaigns={activeCampaigns.length}
        scheduledCampaigns={campaigns.filter(c => c.status === 'scheduled').length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingProducts products={trendingProducts} />
        <RecentActivity campaigns={campaigns.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;
