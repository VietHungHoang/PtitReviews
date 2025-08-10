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