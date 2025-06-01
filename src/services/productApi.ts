const API_BASE_URL = 'http://localhost:8000/api';
const API_VERSION = '1.0.0';

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  isTrend: boolean;
  keywords: string | null;
  trendingPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  keywords?: string;
}

export interface UpdateProductRequest {
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  isTrend?: boolean;
  keywords?: string;
  trendingPercentage?: number;
}

const getHeaders = () => ({
  'accept': 'application/json',
  'api-version': API_VERSION,
  'Content-Type': 'application/json',
});

export const productApi = {
  // Create a new product
  async createProduct(product: CreateProductRequest): Promise<ApiResponse<ApiProduct>> {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    return response.json();
  },

  // Get all products
  async getAllProducts(): Promise<ApiResponse<ApiProduct[]>> {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-version': API_VERSION,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  },

  // Get a single product by ID
  async getProductById(productId: string): Promise<ApiResponse<ApiProduct>> {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-version': API_VERSION,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  },

  // Update a product
  async updateProduct(productId: string, product: UpdateProductRequest): Promise<ApiResponse<ApiProduct>> {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete a product
  async deleteProduct(productId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
      method: 'DELETE',
      headers: {
        'accept': '*/*',
        'api-version': API_VERSION,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
  },
}; 