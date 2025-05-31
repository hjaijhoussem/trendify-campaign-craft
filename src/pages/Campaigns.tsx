
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

const Campaigns = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-1">Create and manage your marketing campaigns.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="mr-2 h-5 w-5" />
            Campaign Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Campaign management interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;
