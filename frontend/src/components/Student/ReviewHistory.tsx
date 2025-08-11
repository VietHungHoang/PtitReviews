import React from 'react';
import { Calendar, Star } from 'lucide-react';
import { reviewsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

interface ReviewHistoryProps {
  userId: string;
}

export default function ReviewHistory({ userId }: ReviewHistoryProps) {
  const { data: reviewsData, loading, error } = useApi(
    () => reviewsApi.getUserReviews(userId),
    [userId]
  );
  
  const reviews = reviewsData?.reviews || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đánh giá</h1>
          <p className="text-gray-600">Xem lại tất cả các đánh giá bạn đã gửi</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700">Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          </div>
        )}

        <div className="space-y-6">
          {!loading && reviews.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-600">Bạn chưa gửi đánh giá nào. Hãy bắt đầu đánh giá để chia sẻ ý kiến của bạn!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đánh giá: {review.categories.map(cat => cat.name).join(', ')}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{review.categories.length > 0 ? Math.round(review.categories.reduce((sum, cat) => sum + cat.rate, 0) / review.categories.length) : 0}/5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {review.categories.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {category.name} ({category.rate}/5 sao):
                      </h4>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
                        {category.comment || 'Không có nhận xét cho danh mục này'}
                      </p>
                    </div>
                  ))}
                  
                  {review.generalFeedback && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Cảm nhận chung:</h4>
                      <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{review.generalFeedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}