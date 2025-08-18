import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Answer, Category, CategoryRequest, QuestionRequest, ReviewRequest, ReviewCreateResponse } from '../../types';
import ItemSelection from './ItemSelection';
import { categoriesApi, reviewsApi } from '../../services/api';
import { useApi, useApiMutation } from '../../hooks/useApi';

interface ReviewFormProps {
  onSubmit: (review: any) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Get selected categories from sessionStorage
  const getSelectedCategories = (): Category[] => {
    const stored = sessionStorage.getItem('selectedCategories');
    if (stored) {
      return JSON.parse(stored);
    }
    // If no categories selected, redirect back to home
    navigate('/');
    return [];
  };
  
  const selectedCategories = getSelectedCategories();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Record<number, number[]>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [hasUsedService, setHasUsedService] = useState<Record<string, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, Answer>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const { mutate: createReview, isSubmitting } = useApiMutation<ReviewCreateResponse, ReviewRequest>();
  const [aiErrors, setAiErrors] = useState<string[]>([]);

  const { data: categoriesData } = useApi(() => categoriesApi.getCategoryInfo(selectedCategories.map(c => c.id)));
  const categoryInfos = categoriesData || [];
  for (const cat of categoryInfos) {
    cat.categoryName = selectedCategories.find(c => c.id === cat.categoryId)?.name || '';
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleRatingChange = (categoryId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [categoryId]: rating }));
  };

  const handleCommentChange = (categoryId: number, comment: string) => {
    setComments(prev => ({ ...prev, [categoryId]: comment }));
  };

  const handleServiceUsageChange = (categoryId: number, selection: Answer) => {
    setSelectedAnswers(prev => ({ ...prev, [categoryId]: selection }));
  };

  const handleItemsChange = (categoryId: number, items: number[]) => {
    setSelectedItems(prev => ({ ...prev, [categoryId]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const missingRatings = selectedCategories.filter(cat => !ratings[cat.id]);
    const missingComments = selectedCategories.filter(cat => !comments[cat.id] || comments[cat.id].trim().length < 10);
    const missingServiceUsage = categoryInfos.filter(cat => cat.questions.filter(q => selectedAnswers[q.id] === undefined).length > 0);
    
    if (missingRatings.length > 0 || missingComments.length > 0 || missingServiceUsage.length > 0) {
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (generalFeedback.trim().length < 20) {
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

  try {
    const categoryRequests: CategoryRequest[] = [];
     for(const cat of categoryInfos) {
        const questionRequests: QuestionRequest[] = [];
        for(const que of cat.questions) {
            const quest: QuestionRequest = {
                id: que.id,
                answerId: selectedAnswers[que.id].id
            };
           questionRequests.push(quest); 
        }
        const categoryRequest: CategoryRequest = {
            id: cat.categoryId,
            questions: questionRequests,
            rate: Math.round(Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length),
            review: comments[cat.categoryId],
            selectedItems: selectedItems[cat.categoryId]
        }
        categoryRequests.push(categoryRequest);
     }
    const reviewData: ReviewRequest = {
        commonReview: generalFeedback,
        categories: categoryRequests
    }

      const res = await createReview(reviewsApi.createReview, reviewData);
      const errors = (res.data && (res.data as any).errors ? (res.data as any).errors : []) as string[];

      const errorMap: Record<string, string> = {
        TOO_SHORT: 'Nội dung quá ngắn',
        BIASED: 'Nội dung thiên lệch/cực đoan',
        NON_MEANINGFUL: 'Nội dung không có ý nghĩa',
        ONLY_SYMBOLS: 'Chỉ toàn ký tự đặc biệt hoặc số',
      };

      const humanErrors = errors.filter(e => e !== 'NONE').map(e => errorMap[e] || e);

      if (humanErrors.length > 0) {
        setAiErrors(humanErrors);
        setNotificationType('error');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        return;
      }

      setNotificationType('success');
      setShowNotification(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setShowNotification(false);
        setRatings({});
        setComments({});
        setSelectedItems({});
        setGeneralFeedback('');
        setHasUsedService({});
        sessionStorage.removeItem('selectedCategories');
        navigate('/');
      }, 2000);
    } catch (error: any) {
      const errors = (error?.data && (error.data as any).errors ? (error.data as any).errors : []) as string[];
      const errorMap: Record<string, string> = {
        TOO_SHORT: 'Nội dung quá ngắn',
        BIASED: 'Nội dung thiên lệch/cực đoan',
        NON_MEANINGFUL: 'Nội dung không có ý nghĩa',
        ONLY_SYMBOLS: 'Chỉ toàn ký tự đặc biệt hoặc số',
      };
      const humanErrors = errors.filter(e => e !== 'NONE').map(e => errorMap[e] || e);
      if (humanErrors.length > 0) {
        setAiErrors(humanErrors);
      } else {
        setAiErrors(['Có lỗi xảy ra, vui lòng thử lại.']);
      }
      setNotificationType('error');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  };

  const renderStars = (categoryId: number, currentRating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(categoryId, star)}
            className={`p-1 transition-colors duration-200 ${
              star <= currentRating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      {/* Custom Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
          notificationType === 'success' 
            ? 'bg-green-100/80 border-green-200 text-green-800' 
            : 'bg-red-100/80 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {notificationType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">
              {notificationType === 'success' 
                ? 'Đánh giá đã được gửi thành công!'
                : aiErrors.length > 0
                  ? `Có lỗi: ${aiErrors.join(', ')}`
                  : 'Vui lòng điền đầy đủ thông tin và đảm bảo nhận xét ít nhất 10 ký tự!'
              }
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="text-purple-600 hover:text-purple-800 font-medium mb-4 transition-colors duration-200"
            >
              ← Quay lại chọn chủ đề
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đánh giá chi tiết</h1>
                        <p className="text-gray-600">
              Chia sẻ trải nghiệm của bạn về {selectedCategories.map(cat => cat.name).join(', ')}
            </p>
          </div>

          {/* Hiển thị các category với câu hỏi */}

          <form onSubmit={handleSubmit} className="space-y-8">
            {categoryInfos.map((category) => (
              <div key={category.categoryId} className="bg-white/50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  {/* <div className="text-2xl mr-3">{category.icon}</div> */}
                  <h3 className="text-xl font-semibold text-gray-800">{category.categoryName}</h3>
                </div>

                {/* Item Selection for subjects/lecturers - hiện trước */}
                <ItemSelection
                  categoryId={category.categoryId}
                  categoryName={category.categoryName}
                  selectedItems={selectedItems[category.categoryId] || []}
                  onItemsChange={(items) => handleItemsChange(category.categoryId, items)}
                />

                {/* Questions - hiện sau ItemSelection */}
                {category.questions.map(question => (
                  <div key={question.id} className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">{question.content}</p>
                    <div className="flex flex-col space-y-2">
                      {question.answers.map(answer => (
                        <label key={answer.id} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={answer.id}
                            checked={selectedAnswers[question.id]?.id === answer.id}
                            onChange={() => handleServiceUsageChange(question.id, answer)}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-gray-700 text-sm">{answer.content}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Đánh giá tổng thể (1-5 sao)
                  </label>
                  {renderStars(category.categoryId, ratings[category.categoryId] || 0)}
                  {ratings[category.categoryId] && (
                    <p className="text-sm text-gray-600 mt-2">
                      Bạn đã chọn {ratings[category.categoryId]} sao
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nhận xét chi tiết (tối thiểu 10 ký tự)
                  </label>
                  <textarea
                    value={comments[category.categoryId] || ''}
                    onChange={(e) => handleCommentChange(category.categoryId, e.target.value)}
                    placeholder={`Chia sẻ trải nghiệm của bạn về ${category.categoryName.toLowerCase()}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {comments[category.categoryId]?.length || 0} ký tự
                  </p>
                </div>
              </div>
            ))}

            {/* General Feedback */}
            <div className="bg-white/50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Cảm nhận chung</h3>
              <textarea
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="Chia sẻ cảm nhận tổng thể của bạn về môi trường học tập tại PTIT... (tối thiểu 20 ký tự)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {generalFeedback.length} ký tự
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};