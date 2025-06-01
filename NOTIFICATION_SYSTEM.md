# Notification System Documentation

## Overview

The notification system provides real-time notifications for various application events such as product additions, trend alerts, campaign updates, and more. It includes a fully functional notification dropdown, persistent state management, and user preferences.

## Features

### 🔔 Notification Dropdown
- **Real-time Badge**: Shows unread notification count in the header
- **Rich Notifications**: Each notification includes title, message, timestamp, and optional action buttons
- **Type-based Styling**: Different colors and icons for different notification types (success, warning, error, trend, campaign, info)
- **Action Buttons**: Quick access to relevant pages from notifications
- **Mark as Read**: Individual and bulk mark-as-read functionality
- **Delete Notifications**: Remove individual notifications or clear all
- **Demo Mode**: "+ Demo" button to simulate new notifications for testing

### 📱 Notification Types
- **Trend Alerts**: When products gain or lose trending status
- **Campaign Updates**: Status changes, performance milestones
- **Product Updates**: Import completions, additions, changes
- **System Updates**: Maintenance notices, important announcements
- **Success Messages**: Successful operations confirmations
- **Warning/Error Messages**: Important alerts and error notifications

### ⚙️ Settings Integration
- **Notification Preferences**: Toggle different notification types on/off
- **Email/Push Settings**: Configure delivery methods
- **Granular Controls**: Separate toggles for trends, campaigns, products, and system updates
- **Persistent Settings**: Preferences are saved and maintained across sessions

### 🔄 Automatic Notifications
The system automatically generates notifications for:
- ✅ **Product Added Manually**: When users add products via the manual form
- ✅ **Bulk Import Completed**: When CSV imports finish successfully
- ✅ **URL Import Successful**: When products are imported from URLs
- 🔄 **Trend Changes**: When product trending scores change significantly
- 🔄 **Campaign Status**: When campaigns are scheduled, published, or completed

## Components

### Core Components
- `NotificationDropdown.tsx` - Main notification interface in header
- `useNotificationStore.ts` - Zustand store for state management
- `useNotifications.ts` - Custom hook for triggering notifications
- `Settings.tsx` - Enhanced with notification preferences section

### Data Types
```typescript
interface Notification {
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

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  trendAlerts: boolean;
  campaignUpdates: boolean;
  productUpdates: boolean;
  systemUpdates: boolean;
}
```

## Usage Examples

### Triggering Notifications
```typescript
import { useNotifications } from '@/hooks/useNotifications';

const { notifyProductAdded, notifyTrendingProduct, notifyError } = useNotifications();

// Product added successfully
notifyProductAdded("iPhone 15 Pro", "manual");

// Trending product alert
notifyTrendingProduct("Samsung Galaxy S24", 45);

// Error notification
notifyError("Import Failed", "CSV file format is invalid");
```

### Managing Notification State
```typescript
import { useNotificationStore } from '@/store/useNotificationStore';

const { 
  notifications, 
  unreadCount, 
  markAsRead, 
  markAllAsRead,
  updateSettings 
} = useNotificationStore();

// Mark specific notification as read
markAsRead(notificationId);

// Mark all as read
markAllAsRead();

// Update notification preferences
updateSettings({ trendAlerts: false });
```

## UI/UX Features

### Visual Design
- **Color-coded Notifications**: Each type has distinct colors (blue for trends, green for success, etc.)
- **Unread Indicators**: Bold text and colored borders for unread notifications
- **Time Stamps**: Relative time display (e.g., "30m ago", "2h ago")
- **Hover Effects**: Smooth transitions and interactive feedback
- **Scrollable List**: Handles long notification lists gracefully

### Accessibility
- **Keyboard Navigation**: Full keyboard support for dropdown
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Clear visual hierarchy and sufficient color contrast

### Responsive Design
- **Mobile Optimized**: Adapts to smaller screens
- **Touch Friendly**: Appropriate button sizes for touch interfaces
- **Flexible Layout**: Adjusts content based on screen size

## Integration Points

### Product Addition Pages
- `ProductAddManual.tsx` - Triggers notification on successful product creation
- `ProductAddCsv.tsx` - Triggers bulk import notification
- `ProductAddUrl.tsx` - Triggers URL import notification

### Header Component
- `Header.tsx` - Contains the NotificationDropdown component
- Displays notification badge with count
- Provides easy access to notification management

### Settings Page
- `Settings.tsx` - Enhanced with notification preferences
- Toggle controls for all notification types
- Direct integration with notification store

## Future Enhancements

### Planned Features
- 🔄 **Push Notifications**: Browser push notification support
- 🔄 **Email Notifications**: Email delivery for important alerts
- 🔄 **Notification History**: Full-page notification center
- 🔄 **Filtering/Search**: Find specific notifications quickly
- 🔄 **Snooze Functionality**: Temporarily dismiss notifications
- 🔄 **Notification Templates**: Customizable notification formats

### Potential Integrations
- **Real-time Updates**: WebSocket integration for live notifications
- **External Services**: Integration with email services (SendGrid, etc.)
- **Analytics**: Track notification engagement metrics
- **API Webhooks**: Support for external system notifications

## Demo Features

For demonstration purposes, the system includes:
- **Mock Data**: Pre-populated with sample notifications
- **Simulation Button**: "+ Demo" button to generate test notifications
- **Various Types**: Examples of all notification types
- **Interactive Elements**: Fully functional UI for testing

## Technical Implementation

### State Management
- Uses Zustand for lightweight, type-safe state management
- Persistent notification count and settings
- Optimistic updates for better user experience

### Performance
- Efficient re-renders with selective state subscriptions
- Lazy loading of notification content
- Optimized scroll performance for long lists

### Error Handling
- Graceful fallbacks for missing data
- User-friendly error messages
- Automatic retry for failed operations

This notification system provides a solid foundation for keeping users informed about important events and maintaining engagement with the application. 