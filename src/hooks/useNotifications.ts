import { useNotificationStore } from '@/store/useNotificationStore';
import { useCallback } from 'react';

export const useNotifications = () => {
  const { addNotification } = useNotificationStore();

  const notifyProductAdded = useCallback((productName: string, method: 'manual' | 'csv' | 'url') => {
    const methodLabels = {
      manual: 'manually',
      csv: 'from CSV',
      url: 'from URL'
    };

    addNotification({
      title: 'Product Added Successfully',
      message: `"${productName}" has been added ${methodLabels[method]}`,
      type: 'success',
      isRead: false,
      actionUrl: '/products',
      actionLabel: 'View Products'
    });
  }, [addNotification]);

  const notifyBulkProductsImported = useCallback((count: number) => {
    addNotification({
      title: 'Bulk Import Completed',
      message: `${count} products have been successfully imported`,
      type: 'success',
      isRead: false,
      actionUrl: '/products',
      actionLabel: 'View Products'
    });
  }, [addNotification]);

  const notifyProductUpdated = useCallback((productName: string) => {
    addNotification({
      title: 'Product Updated',
      message: `"${productName}" has been updated successfully`,
      type: 'success',
      isRead: false,
      actionUrl: '/products',
      actionLabel: 'View Products'
    });
  }, [addNotification]);

  const notifyTrendingProduct = useCallback((productName: string, trendScore: number) => {
    addNotification({
      title: 'Trending Product Alert',
      message: `${productName} is trending up ${trendScore}% this week`,
      type: 'trend',
      isRead: false,
      actionUrl: '/trends',
      actionLabel: 'View Trends',
      data: { productName, trendScore }
    });
  }, [addNotification]);

  const notifyCampaignStatusChange = useCallback((campaignName: string, status: string) => {
    const statusMessages = {
      scheduled: 'has been scheduled',
      published: 'is now live',
      completed: 'has finished running'
    };

    addNotification({
      title: 'Campaign Update',
      message: `"${campaignName}" ${statusMessages[status] || 'status updated'}`,
      type: 'campaign',
      isRead: false,
      actionUrl: '/campaigns',
      actionLabel: 'View Campaign'
    });
  }, [addNotification]);

  const notifyError = useCallback((title: string, message: string) => {
    addNotification({
      title,
      message,
      type: 'error',
      isRead: false
    });
  }, [addNotification]);

  const notifyWarning = useCallback((title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    addNotification({
      title,
      message,
      type: 'warning',
      isRead: false,
      actionUrl,
      actionLabel
    });
  }, [addNotification]);

  const notifyInfo = useCallback((title: string, message: string, actionUrl?: string, actionLabel?: string) => {
    addNotification({
      title,
      message,
      type: 'info',
      isRead: false,
      actionUrl,
      actionLabel
    });
  }, [addNotification]);

  return {
    notifyProductAdded,
    notifyBulkProductsImported,
    notifyProductUpdated,
    notifyTrendingProduct,
    notifyCampaignStatusChange,
    notifyError,
    notifyWarning,
    notifyInfo
  };
}; 