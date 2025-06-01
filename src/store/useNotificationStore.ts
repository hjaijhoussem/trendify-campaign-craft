import { create } from 'zustand';
import { Notification, NotificationSettings } from '@/types';

interface NotificationStore {
  notifications: Notification[];
  settings: NotificationSettings;
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  
  // Simulation functions for demo
  simulateNewNotifications: () => void;
}

const generateMockNotifications = (): Notification[] => [
  {
    id: '1',
    title: 'New Trending Product Detected',
    message: 'Samsung Galaxy S24 Ultra is trending up 45% this week',
    type: 'trend',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    actionUrl: '/trends',
    actionLabel: 'View Trends',
    data: { productId: 'samsung-s24', trendScore: 45 }
  },
  {
    id: '2',
    title: 'Campaign Performance Alert',
    message: 'Your "Summer Sale" campaign has reached 10,000 impressions',
    type: 'campaign',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: '/campaigns',
    actionLabel: 'View Campaign',
    data: { campaignId: 'summer-sale-2024' }
  },
  {
    id: '3',
    title: 'Product Import Completed',
    message: '25 products have been successfully imported from CSV',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    actionUrl: '/products',
    actionLabel: 'View Products'
  },
  {
    id: '4',
    title: 'System Maintenance Scheduled',
    message: 'Planned maintenance on Sunday 3 AM - 5 AM EST',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
  {
    id: '5',
    title: 'Low Trending Score Warning',
    message: 'Wireless Headphones trending score dropped to 12%',
    type: 'warning',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    actionUrl: '/trends',
    actionLabel: 'Check Trends'
  }
];

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: generateMockNotifications(),
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    trendAlerts: true,
    campaignUpdates: true,
    productUpdates: true,
    systemUpdates: false
  },
  unreadCount: 0,

  addNotification: (notificationData) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true
      })),
      unreadCount: 0
    }));
  },

  deleteNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.isRead;
      
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  simulateNewNotifications: () => {
    const mockNotifications = [
      {
        title: 'New Product Added',
        message: 'iPhone 15 Pro has been added to your catalog',
        type: 'success' as const,
        isRead: false,
        actionUrl: '/products',
        actionLabel: 'View Product'
      },
      {
        title: 'Trend Alert',
        message: 'MacBook Air is gaining popularity (+23%)',
        type: 'trend' as const,
        isRead: false,
        actionUrl: '/trends',
        actionLabel: 'View Trends'
      },
      {
        title: 'Campaign Scheduled',
        message: 'Black Friday campaign will start in 2 hours',
        type: 'campaign' as const,
        isRead: false,
        actionUrl: '/campaigns',
        actionLabel: 'View Campaign'
      }
    ];

    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    get().addNotification(randomNotification);
  }
}));

// Calculate unread count on store initialization
useNotificationStore.setState((state) => ({
  unreadCount: state.notifications.filter(n => !n.isRead).length
})); 