import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { mockTrendData, mockCampaigns } from '@/services/mockData';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TrendingProducts } from '@/components/dashboard/TrendingProducts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { products, isLoading, fetchProducts } = useStore();

  useEffect(() => {
    // Fetch products from API on mount
    fetchProducts();
  }, [fetchProducts]);

  // Ensure products is an array (fallback to empty array if undefined)
  const safeProducts = products || [];
  
  const trendingProducts = safeProducts.filter(p => p.isTrend);
  
  // Mock campaigns data for now (since campaigns aren't in the new store yet)
  const mockActiveCampaigns = mockCampaigns.filter(c => c.status === 'published' || c.status === 'scheduled');
  const mockScheduledCampaigns = mockCampaigns.filter(c => c.status === 'scheduled');

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
        totalProducts={safeProducts.length}
        trendingProducts={trendingProducts.length}
        activeCampaigns={mockActiveCampaigns.length}
        scheduledCampaigns={mockScheduledCampaigns.length}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingProducts products={trendingProducts} isLoading={isLoading} />
        <RecentActivity campaigns={mockCampaigns.slice(0, 5)} />
      </div>
    </div>
  );
};

export default Dashboard;
