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
  id: number;
  userName: string;
  userCode: string;
  categories: string[];
  averageRating: number;
  commonReview: string;
  createdAt: string;
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
    rating: number;
    preview: string;
    createdAt: string;
  }>;
  ratingDistribution: Record<number, number>; // Phân bố điểm đánh giá (1-5 sao)
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

// Question Answer pair for review history
export interface QuestionAnswer {
  title: string;
  answer: string;
}

// Student review history
export interface CategoryReviewHistory {
  name: string;
  rate: number;
  comment: string;
  subjects?: string[] | null;   // Danh sách môn học (null nếu không phải category môn học)
  lecturers?: string[] | null;  // Danh sách giảng viên (null nếu không phải category giảng viên)
  questionAnswers: QuestionAnswer[];  // Danh sách câu hỏi-câu trả lời
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
