export interface User {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  avatar?: string;
  role: 'admin' | 'student';
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
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

export type ReviewCategory = 
  | 'subjects'
  | 'lecturers' 
  | 'facilities'
  | 'library'
  | 'registration'
  | 'services';

export interface CategoryInfo {
  id: number;
  name: string;
  description: string;
  icon: string;
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

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
}

export interface Lecturer {
  id: string;
  name: string;
  department: string;
  specialization: string;
}