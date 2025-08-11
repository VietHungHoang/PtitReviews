export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  avatar?: string;
  role: 'admin' | 'student';
}

export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  studentId?: string;
  categories: ReviewCategory[];
  selectedItems: string[]; // IDs of selected subjects/lecturers
  rating: number;
  freeComment: string;
  generalFeedback: string;
  hasUsedService: boolean;
  additionalAnswers: Record<string, string>;
  createdAt: Date;
}

export type ReviewCategory = 
  | 'subjects'
  | 'lecturers' 
  | 'facilities'
  | 'library'
  | 'registration'
  | 'services';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Answer {
  id: number;
  content: string;
  correct: boolean;
}

export interface Question {
  id: number;
  content: string;
  answers: Answer[];
}

export interface Lecturer {
  id: number;
  name: string;
  department: string;
  specialization: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  semester: string;
}

export interface CategoryInfo {
  categoryId: number;
  categoryName: string;
  questions: Question[];
  lecturers: Lecturer[];
  subjects: Subject[];
}

export interface Analytics {
  totalReviews: number;
  reviewsByCategory: Record<ReviewCategory, number>;
  averageRating: number;
  approvedReviews: number;
  rejectedReviews: number;
  trendData: Array<{
    date: string;
    count: number;
  }>;
}

export interface NotificationProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

export interface ReviewRequest {
  commonReview: string;
  categories: CategoryRequest[];
}

export interface CategoryRequest {
  id: number;
  questions: QuestionRequest[];
  rate: number;
  review: string;
  selectedItems: number[];
}

export interface QuestionRequest {
  id: number;
  answerId: number;
}

// Backend ReviewResponse for createReview API
export interface ReviewCreateResponse {
  id: number | null;
  commonReview: string;
  createdAt: string | null;
  updatedAt: string | null;
  errors: string[];
}

// Student review history
export interface CategoryReviewHistory {
  name: string;
  rate: number;
  comment: string;
}

export interface ReviewHistoryItem {
  id: number;
  categories: CategoryReviewHistory[];
  generalFeedback: string;
  createdAt: string;
}

export interface UserReviewsResponse {
  reviews: ReviewHistoryItem[];
}
