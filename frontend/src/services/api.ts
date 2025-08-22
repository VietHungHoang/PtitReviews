import { AuthLogin, AuthLoginResponse, Category, CategoryInfo, Lecturer, ReviewCreateResponse, ReviewRequest, ReviewHistoryItem, Subject, UserReviewsResponse } from "../types";

const API_BASE_URL = 'https://8080-viethunghoa-ptitreviews-yb6u5tzsd8g.ws-us121.gitpod.io/api/v1';

// API Response interface
interface ApiResponse<T> {
  status: number;
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

// Refresh token management
const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

const removeRefreshToken = (): void => {
  localStorage.removeItem('refreshToken');
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
      const error: any = new Error(data.message || 'API call failed');
      error.status = response.status;
      error.data = data.data; // backend wraps details in data
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};



// Authentication API
export const authApi = {
  login: async (authLogin: AuthLogin) => {
    const response = await apiCall<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(authLogin),
    });
    
    if (response.status === 200) {
      setAuthToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
    }
    
    return response;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    code: string;
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
    removeRefreshToken();
    return response;
  },
};

// Reviews API
export const reviewsApi = {
  getReviews: async (params?: {
    page?: number;
    limit?: number;
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
      reviews: Array<{
        id: number;
        userName: string;
        userCode: string;
        categories: string[];
        averageRating: number;
        commonReview: string;
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint);
  },

  createReview: async (reviewData: ReviewRequest) => {
    return apiCall<ReviewCreateResponse>("/reviews", {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getReview: async (id: string) => {
    return apiCall<{ review: any }>(`/reviews/${id}`);
  },

  // Admin detailed reviews (similar to student review history)
  getDetailedReviews: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/reviews/detailed${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiCall<{
      reviews: Array<ReviewHistoryItem & {
        userName: string;
        userCode: string;
      }>;
      currentPage: number;
      totalPages: number;
      totalItems: number;
    }>(endpoint);
  },

  deleteReview: async (id: string) => {
    return apiCall<null>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  getUserReviews: async (userId: string) => {
    return apiCall<UserReviewsResponse>(`/reviews/user/${userId}`);
  },
};

// Subjects API
export const subjectsApi = {
  getSubjects: async () => {
    const endpoint = `/subjects`;
    return apiCall<Subject[]>(endpoint);
  }
};

// Lecturers API
export const lecturersApi = {
  getLecturers: async () => {
    const endpoint = `/lecturers`;
    return apiCall<Lecturer[]>(endpoint);
  }
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
        averageRating: number;
      }>;
      recentReviews: Array<{
        id: number;
        userName: string;
        categoryName: string;
        categoryId: number;
        rating: number;
        preview: string;
        createdAt: string;
        lecturerNames: string[];
        subjectNames: string[];
      }>;
      ratingDistribution: Record<number, number>; // Phân bố điểm đánh giá (1-5 sao)
      weeklyComparison: {
        thisWeekReviews: number;
        lastWeekReviews: number;
        thisWeekAvgRating: number;
        lastWeekAvgRating: number;
        reviewsChangePercent: string;
        ratingChange: string;
        reviewsChangeType: 'increase' | 'decrease' | 'no_change';
        ratingChangeType: 'increase' | 'decrease' | 'no_change';
      };
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

// Categories API
export const categoriesApi = {
  getCategories: async () => {
    return apiCall<Category[]>('/categories');
  },

  getCategory: async (id: string) => {
    return apiCall<{ category: any }>(`/categories/${id}`);
  },

  getCategoryInfo: async (categoryIds: number[]) => {
    const query = `ids=${categoryIds.join(',')}`;
    const url = `/categories/info?${query}`;
    return apiCall<CategoryInfo[]>(url);
  }


};