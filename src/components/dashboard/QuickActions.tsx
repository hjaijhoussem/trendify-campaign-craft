
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline"
        onClick={() => navigate('/trends')}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        View Trends
      </Button>
      <Button 
        variant="outline"
        onClick={() => navigate('/campaigns')}
      >
        <Megaphone className="mr-2 h-4 w-4" />
        New Campaign
      </Button>
      <Button 
        onClick={() => navigate('/products/add')}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}
