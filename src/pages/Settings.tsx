
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your business profile and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            Business Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Settings interface coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
