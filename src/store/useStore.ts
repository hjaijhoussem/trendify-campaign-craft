import { create } from 'zustand';
import { productApi, ApiProduct } from '@/services/productApi';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string; // Changed to match API
  isTrend?: boolean; // Changed from isTrending
  trendingPercentage?: number; // Changed from trendingScore
  keywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  currentTask: string;
  isComplete: boolean;
}

interface StoreState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  generationProgress: GenerationProgress | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  clearError: () => void;
}

// Helper function to convert API product to internal product format
const convertApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description,
  category: apiProduct.category,
  price: apiProduct.price,
  imageUrl: apiProduct.imageUrl,
  isTrend: apiProduct.isTrend,
  trendingPercentage: apiProduct.trendingPercentage,
  keywords: apiProduct.keywords || undefined,
  createdAt: apiProduct.createdAt,
  updatedAt: apiProduct.updatedAt,
});

// Helper function to convert internal product to API format
const convertToApiProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => ({
  name: product.name,
  category: product.category,
  description: product.description,
  price: product.price,
  imageUrl: product.imageUrl,
  keywords: product.keywords,
});

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  generationProgress: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await productApi.getAllProducts();
      const products = response.data.map(convertApiProduct);
      set({ products, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false 
      });
    }
  },

  addProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const apiProductData = convertToApiProduct(productData);
      const response = await productApi.createProduct(apiProductData);
      const newProduct = convertApiProduct(response.data);
      
      set(state => ({
        products: [...state.products, newProduct],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add product',
        isLoading: false 
      });
      throw error; // Re-throw to handle in components
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // Get current product
      const currentProduct = get().products.find(p => p.id === id);
      if (!currentProduct) {
        throw new Error('Product not found');
      }

      // Merge updates with current product
      const updatedProductData = { ...currentProduct, ...updates };
      const apiProductData = convertToApiProduct(updatedProductData);
      
      const response = await productApi.updateProduct(id, apiProductData);
      const updatedProduct = convertApiProduct(response.data);
      
      set(state => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update product',
        isLoading: false 
      });
      throw error; // Re-throw to handle in components
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productApi.deleteProduct(id);
      
      set(state => ({
        products: state.products.filter(p => p.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete product',
        isLoading: false 
      });
      throw error; // Re-throw to handle in components
    }
  },

  getProductById: async (id) => {
    // First check if product exists in store
    const existingProduct = get().products.find(p => p.id === id);
    if (existingProduct) {
      return existingProduct;
    }

    // If not in store, fetch from API
    try {
      set({ isLoading: true, error: null });
      const response = await productApi.getProductById(id);
      const product = convertApiProduct(response.data);
      
      // Add to store if not already there
      set(state => ({
        products: state.products.some(p => p.id === id) 
          ? state.products 
          : [...state.products, product],
        isLoading: false
      }));
      
      return product;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false 
      });
      return null;
    }
  },

  setGenerationProgress: (progress) => {
    set({ generationProgress: progress });
  },

  clearError: () => {
    set({ error: null });
  },
}));
