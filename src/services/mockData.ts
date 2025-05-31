
import { Product, TrendData, Campaign } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds Pro',
    description: 'Premium noise-cancelling wireless earbuds with 30-hour battery life',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
    price: 149.99,
    trendingScore: 95,
    isTrending: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Halloween LED String Lights',
    description: 'Spooky orange and purple LED lights perfect for Halloween decorating',
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1509557965043-6ebaf5fa3fb8?w=300',
    price: 24.99,
    trendingScore: 88,
    isTrending: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Resistance Band Set',
    description: 'Complete home workout resistance band set with door anchor',
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    price: 39.99,
    trendingScore: 76,
    isTrending: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Minimalist Phone Case',
    description: 'Ultra-thin clear phone case with premium protection',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300',
    price: 19.99,
    trendingScore: 42,
    isTrending: false,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '5',
    name: 'Organic Skincare Set',
    description: 'Natural skincare routine with cleanser, toner, and moisturizer',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300',
    price: 89.99,
    trendingScore: 34,
    isTrending: false,
    createdAt: new Date('2024-01-20')
  }
];

export const mockTrendData: TrendData[] = [
  {
    productId: '1',
    keyword: 'wireless earbuds',
    score: 95,
    percentage: 340,
    timeData: [
      { date: '2024-01-01', value: 45 },
      { date: '2024-01-15', value: 62 },
      { date: '2024-02-01', value: 78 },
      { date: '2024-02-15', value: 95 },
      { date: '2024-03-01', value: 89 }
    ],
    relatedKeywords: ['bluetooth headphones', 'noise cancelling', 'apple airpods', 'wireless audio'],
    reason: 'New iPhone release and holiday shopping season driving demand for premium audio accessories'
  },
  {
    productId: '2',
    keyword: 'halloween decorations',
    score: 88,
    percentage: 280,
    timeData: [
      { date: '2024-08-01', value: 15 },
      { date: '2024-09-01', value: 35 },
      { date: '2024-09-15', value: 65 },
      { date: '2024-10-01', value: 88 },
      { date: '2024-10-15', value: 92 }
    ],
    relatedKeywords: ['spooky lights', 'halloween party', 'outdoor decorations', 'led string lights'],
    reason: 'October seasonal trend with increased searches for Halloween decorating ideas'
  },
  {
    productId: '3',
    keyword: 'home fitness equipment',
    score: 76,
    percentage: 180,
    timeData: [
      { date: '2023-12-01', value: 30 },
      { date: '2023-12-15', value: 45 },
      { date: '2024-01-01', value: 76 },
      { date: '2024-01-15', value: 68 },
      { date: '2024-02-01', value: 52 }
    ],
    relatedKeywords: ['resistance training', 'home workout', 'fitness bands', 'new year fitness'],
    reason: 'New Year fitness resolutions and continued home workout trend post-pandemic'
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    productId: '1',
    name: 'Wireless Earbuds Launch Campaign',
    platforms: ['youtube', 'facebook', 'instagram'],
    content: {
      facebook: {
        post: '🎵 Experience crystal-clear sound with our new Wireless Bluetooth Earbuds Pro! Perfect for your daily commute or workout sessions. #WirelessAudio #TechLife',
        imageDescription: 'Professional product shot of earbuds on a modern desk with soft lighting',
        adCopy: [
          'Upgrade your audio experience today!',
          'Free shipping on orders over $100',
          'Join thousands of satisfied customers'
        ]
      },
      instagram: {
        post: 'Sound that moves with you 🎧✨ New Wireless Earbuds Pro now available! #AudioLife #TechGear #Wireless',
        imageDescription: 'Lifestyle shot of person wearing earbuds during workout',
        adCopy: [
          'Your soundtrack awaits',
          'Premium sound, premium life',
          'Wireless freedom starts here'
        ]
      },
      youtube: {
        script: 'Are you tired of tangled wires? Introducing the Wireless Bluetooth Earbuds Pro...',
        thumbnailDescription: 'Split screen showing tangled wires vs. clean wireless earbuds',
        adCopy: [
          'Watch our full review',
          'See the difference yourself',
          'Subscribe for more tech reviews'
        ]
      }
    },
    status: 'published',
    scheduledDate: new Date('2024-03-01'),
    createdAt: new Date('2024-02-28')
  }
];
