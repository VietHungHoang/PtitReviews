const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Response interface
interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}

// Auth token management
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API call function
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall<{
      user: any;
      token: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.status === 'success') {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    studentId: string;
  }) => {
    return apiCall<{ user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    const response = await apiCall<null>('/auth/logout', {
      method: 'POST',
    });
    
    removeAuthToken();
    return response;
  },
};

// Reviews API
export const reviewsApi = {
  getReviews: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<{
      reviews: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint);
  },

  createReview: async (reviewData: any) => {
    return apiCall<{ review: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getReview: async (id: string) => {
    return apiCall<{ review: any }>(`/reviews/${id}`);
  },

  deleteReview: async (id: string) => {
    return apiCall<null>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  getUserReviews: async (userId: string) => {
    return apiCall<{ reviews: any[] }>(`/reviews/user/${userId}`);
  },
};

// Subjects API
export const subjectsApi = {
  getSubjects: async (params?: {
    search?: string;
    semester?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/subjects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<{ subjects: any[] }>(endpoint);
  },

  getSubject: async (id: string) => {
    return apiCall<{ subject: any }>(`/subjects/${id}`);
  },
};

// Lecturers API
export const lecturersApi = {
  getLecturers: async (params?: {
    search?: string;
    department?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/lecturers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<{ lecturers: any[] }>(endpoint);
  },

  getLecturer: async (id: string) => {
    return apiCall<{ lecturer: any }>(`/lecturers/${id}`);
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async () => {
    return apiCall<{
      totalReviews: number;
      approvedReviews: number;
      rejectedReviews: number;
      pendingReviews: number;
      averageRating: number;
      reviewsByCategory: Record<string, number>;
      trendData: Array<{
        date: string;
        count: number;
      }>;
    }>('/analytics/dashboard');
  },

  getReviewStats: async (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/analytics/reviews/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<{
      stats: Array<{
        period: string;
        count: number;
        averageRating: number;
      }>;
    }>(endpoint);
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };