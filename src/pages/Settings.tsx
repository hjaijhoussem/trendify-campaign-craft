
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings as SettingsIcon, User, Youtube, Instagram, Facebook, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [connected, setConnected] = useState({
    youtube: false,
    instagram: true,
    facebook: true
  });

  const handleConnect = (platform: string) => {
    setConnected(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your business profile and platform connections.</p>
      </div>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Business Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" placeholder="Your Business Name" defaultValue="TechGear Store" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://yourwebsite.com" defaultValue="https://techgearstore.com" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Input id="description" placeholder="Brief description of your business" defaultValue="Premium tech accessories and gadgets" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandColor">Primary Brand Color</Label>
              <div className="flex space-x-2">
                <Input id="brandColor" type="color" defaultValue="#3b82f6" className="w-16 h-10" />
                <Input placeholder="#3b82f6" defaultValue="#3b82f6" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Brand Tone</Label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Professional</option>
                <option>Casual & Friendly</option>
                <option>Energetic & Bold</option>
                <option>Luxury & Elegant</option>
              </select>
            </div>
          </div>

          <Button>Save Profile</Button>
        </CardContent>
      </Card>

      {/* Platform Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5" />
            Platform Connections
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* YouTube */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Youtube className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-medium">YouTube</h3>
                <p className="text-sm text-gray-600">Connect to generate video scripts and thumbnails</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {connected.youtube ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not Connected</Badge>
              )}
              <Button 
                variant={connected.youtube ? "outline" : "default"}
                onClick={() => handleConnect('youtube')}
              >
                {connected.youtube ? 'Disconnect' : 'Connect'}
                {!connected.youtube && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Instagram */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Instagram className="h-8 w-8 text-pink-600" />
              <div>
                <h3 className="font-medium">Instagram</h3>
                <p className="text-sm text-gray-600">Generate posts, stories, and ad content</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {connected.instagram ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not Connected</Badge>
              )}
              <Button 
                variant={connected.instagram ? "outline" : "default"}
                onClick={() => handleConnect('instagram')}
              >
                {connected.instagram ? 'Disconnect' : 'Connect'}
                {!connected.instagram && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Facebook className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium">Facebook</h3>
                <p className="text-sm text-gray-600">Create posts and ad campaigns for Facebook</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {connected.facebook ? (
                <Badge className="bg-green-100 text-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline">Not Connected</Badge>
              )}
              <Button 
                variant={connected.facebook ? "outline" : "default"}
                onClick={() => handleConnect('facebook')}
              >
                {connected.facebook ? 'Disconnect' : 'Connect'}
                {!connected.facebook && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>AI Generation Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoGenerate">Auto-generate for trending products</Label>
              <p className="text-sm text-gray-600">Automatically create campaigns when products start trending</p>
            </div>
            <Switch id="autoGenerate" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multiVariants">Generate multiple content variants</Label>
              <p className="text-sm text-gray-600">Create 3-5 different versions of each campaign</p>
            </div>
            <Switch id="multiVariants" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="includeHashtags">Include trending hashtags</Label>
              <p className="text-sm text-gray-600">Automatically add relevant trending hashtags</p>
            </div>
            <Switch id="includeHashtags" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom AI Instructions</Label>
            <textarea 
              id="customPrompt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any specific instructions for AI content generation..."
              defaultValue="Always include a call-to-action and mention our free shipping policy."
            />
          </div>

          <Button>Save Preferences</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
