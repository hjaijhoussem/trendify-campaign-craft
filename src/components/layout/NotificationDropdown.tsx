import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Trash2, 
  Check, 
  CheckCheck, 
  Settings, 
  TrendingUp, 
  Megaphone, 
  Info, 
  AlertTriangle, 
  X,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'trend':
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    case 'campaign':
      return <Megaphone className="h-4 w-4 text-purple-600" />;
    case 'success':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    case 'error':
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return <Info className="h-4 w-4 text-gray-600" />;
  }
};

const getNotificationBgColor = (type: string, isRead: boolean) => {
  if (isRead) return 'bg-gray-50';
  
  switch (type) {
    case 'trend':
      return 'bg-blue-50 border-l-4 border-blue-500';
    case 'campaign':
      return 'bg-purple-50 border-l-4 border-purple-500';
    case 'success':
      return 'bg-green-50 border-l-4 border-green-500';
    case 'warning':
      return 'bg-orange-50 border-l-4 border-orange-500';
    case 'error':
      return 'bg-red-50 border-l-4 border-red-500';
    default:
      return 'bg-gray-50 border-l-4 border-gray-500';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (url: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onNavigate }: NotificationItemProps) => {
  return (
    <div className={cn(
      "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
      getNotificationBgColor(notification.type, notification.isRead)
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium text-gray-900",
                !notification.isRead && "font-semibold"
              )}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(notification.createdAt)}</span>
                </div>
                
                {notification.actionUrl && notification.actionLabel && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate(notification.actionUrl!)}
                    className="text-xs"
                  >
                    {notification.actionLabel}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-1 ml-2">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 w-6 p-0"
                  title="Mark as read"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function NotificationDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    simulateNewNotifications
  } = useNotificationStore();

  const handleNavigate = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const recentNotifications = notifications.slice(0, 10);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={5}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Demo button to simulate new notifications */}
              <Button
                variant="ghost"
                size="sm"
                onClick={simulateNewNotifications}
                className="text-xs"
                title="Simulate new notification (demo)"
              >
                + Demo
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {unreadCount > 0 && (
                    <DropdownMenuItem onClick={handleMarkAllAsRead}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Mark all as read
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={handleClearAll}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear all
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Notification settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {recentNotifications.length > 0 ? (
            <div>
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
              <p className="text-gray-400 text-xs mt-1">
                You'll see updates about trends, campaigns, and more here
              </p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 10 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigate('/notifications')}
              className="text-sm"
            >
              View all notifications ({notifications.length})
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 