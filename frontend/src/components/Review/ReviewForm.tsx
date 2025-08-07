import React, { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { CategoryInfo } from '../../types';
import ItemSelection from './ItemSelection';

interface ReviewFormProps {
  selectedCategories: CategoryInfo[];
  onSubmit: (review: any) => void;
  onBack: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ selectedCategories, onSubmit, onBack }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [hasUsedService, setHasUsedService] = useState<Record<string, boolean>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const handleRatingChange = (categoryId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [categoryId]: rating }));
  };

  const handleCommentChange = (categoryId: string, comment: string) => {
    setComments(prev => ({ ...prev, [categoryId]: comment }));
  };

  const handleServiceUsageChange = (categoryId: string, hasUsed: boolean) => {
    setHasUsedService(prev => ({ ...prev, [categoryId]: hasUsed }));
  };

  const handleItemsChange = (categoryId: string, items: string[]) => {
    setSelectedItems(prev => ({ ...prev, [categoryId]: items }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const missingRatings = selectedCategories.filter(cat => !ratings[cat.id]);
    const missingComments = selectedCategories.filter(cat => !comments[cat.id] || comments[cat.id].trim().length < 10);
    const missingServiceUsage = selectedCategories.filter(cat => hasUsedService[cat.id] === undefined);
    
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

    const review = {
      categories: selectedCategories.map(cat => cat.id),
      selectedItems: Object.values(selectedItems).flat(),
      rating: Math.round(Object.values(ratings).reduce((sum, rating) => sum + rating, 0) / Object.values(ratings).length),
      freeComment: Object.values(comments).join('\n\n'),
      generalFeedback,
      hasUsedService: Object.values(hasUsedService).some(used => used),
      additionalAnswers: {}
    };

    onSubmit(review);
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
      onBack();
    }, 2000);
  };

  const renderStars = (categoryId: string, currentRating: number) => {
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
              onClick={onBack}
              className="text-purple-600 hover:text-purple-800 font-medium mb-4 transition-colors duration-200"
            >
              ← Quay lại chọn chủ đề
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Đánh giá chi tiết</h1>
            <p className="text-gray-600">
              Chia sẻ trải nghiệm của bạn về {selectedCategories.map(cat => cat.title).join(', ')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {selectedCategories.map((category) => (
              <div key={category.id} className="bg-white/50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                </div>

                {/* Service Usage Check */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Bạn đã sử dụng/trải nghiệm {category.title.toLowerCase()} chưa?
                  </p>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`usage-${category.id}`}
                        checked={hasUsedService[category.id] === true}
                        onChange={() => handleServiceUsageChange(category.id, true)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Có</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`usage-${category.id}`}
                        checked={hasUsedService[category.id] === false}
                        onChange={() => handleServiceUsageChange(category.id, false)}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Chưa</span>
                    </label>
                  </div>
                </div>

                {hasUsedService[category.id] === true && (
                  <>
                    {/* Item Selection for subjects/lecturers */}
                    <ItemSelection
                      categoryId={category.id}
                      categoryTitle={category.title}
                      selectedItems={selectedItems[category.id] || []}
                      onItemsChange={(items) => handleItemsChange(category.id, items)}
                    />

                    {/* Rating */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Đánh giá tổng thể (1-5 sao)
                      </label>
                      {renderStars(category.id, ratings[category.id] || 0)}
                      {ratings[category.id] && (
                        <p className="text-sm text-gray-600 mt-2">
                          Bạn đã chọn {ratings[category.id]} sao
                        </p>
                      )}
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Nhận xét chi tiết (tối thiểu 10 ký tự)
                      </label>
                      <textarea
                        value={comments[category.id] || ''}
                        onChange={(e) => handleCommentChange(category.id, e.target.value)}
                        placeholder={`Chia sẻ trải nghiệm của bạn về ${category.title.toLowerCase()}...`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {comments[category.id]?.length || 0} ký tự
                      </p>
                    </div>
                  </>
                )}

                {hasUsedService[category.id] === false && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Bạn chưa trải nghiệm {category.title.toLowerCase()}, 
                      nhưng vẫn có thể đánh giá dựa trên thông tin bạn biết. Tuy nhiên, chúng tôi khuyến khích 
                      bạn trải nghiệm trực tiếp để có đánh giá chính xác nhất.
                    </p>
                    
                    {/* Still allow rating and comment even if not used */}
                    <div className="mt-4">
                      <ItemSelection
                        categoryId={category.id}
                        categoryTitle={category.title}
                        selectedItems={selectedItems[category.id] || []}
                        onItemsChange={(items) => handleItemsChange(category.id, items)}
                      />

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Đánh giá dựa trên thông tin bạn biết (1-5 sao)
                        </label>
                        {renderStars(category.id, ratings[category.id] || 0)}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Nhận xét (dựa trên thông tin bạn có)
                        </label>
                        <textarea
                          value={comments[category.id] || ''}
                          onChange={(e) => handleCommentChange(category.id, e.target.value)}
                          placeholder={`Chia sẻ những gì bạn biết về ${category.title.toLowerCase()}...`}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                onClick={onBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
                <span>Gửi đánh giá</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};