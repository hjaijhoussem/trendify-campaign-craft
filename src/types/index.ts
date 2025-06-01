export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  trendingScore?: number;
  isTrending?: boolean;
  createdAt: Date;
}

export interface TrendData {
  productId: string;
  keyword: string;
  score: number;
  percentage: number;
  timeData: Array<{
    date: string;
    value: number;
  }>;
  relatedKeywords: string[];
  reason: string;
}

export interface Campaign {
  id: string;
  productId: string;
  name: string;
  platforms: Platform[];
  content: CampaignContent;
  status: 'draft' | 'scheduled' | 'published' | 'completed';
  scheduledDate?: Date;
  createdAt: Date;
}

export type Platform = 'youtube' | 'facebook' | 'instagram';

export interface CampaignContent {
  facebook?: {
    post: string;
    imageDescription: string;
    adCopy: string[];
  };
  instagram?: {
    post: string;
    imageDescription: string;
    adCopy: string[];
  };
  youtube?: {
    script: string;
    thumbnailDescription: string;
    adCopy: string[];
  };
}

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  currentTask: string;
  isComplete: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'trend' | 'campaign';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  data?: any;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  trendAlerts: boolean;
  campaignUpdates: boolean;
  productUpdates: boolean;
  systemUpdates: boolean;
}
