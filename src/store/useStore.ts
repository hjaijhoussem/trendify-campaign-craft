
import { create } from 'zustand';
import { Product, Campaign, TrendData, GenerationProgress } from '@/types';

interface AppState {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Trends
  trendData: TrendData[];
  setTrendData: (data: TrendData[]) => void;
  
  // Generation
  generationProgress: GenerationProgress | null;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  
  // UI State
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
}

export const useStore = create<AppState>((set) => ({
  // Products
  products: [],
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  deleteProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
  
  // Campaigns
  campaigns: [],
  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, campaign]
  })),
  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(c => c.id !== id)
  })),
  
  // Trends
  trendData: [],
  setTrendData: (data) => set({ trendData: data }),
  
  // Generation
  generationProgress: null,
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  
  // UI State
  selectedPlatforms: [],
  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
}));
