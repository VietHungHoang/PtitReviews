import React, { useState } from 'react';
import { Search, Eye, Trash2, Calendar, Star, User } from 'lucide-react';
import { Review } from '../../types';
import { reviewsApi } from '../../services/api';
import { useApi, useApiMutation } from '../../hooks/useApi';

interface ReviewManagementProps {
  onDeleteReview: (reviewId: number) => void;
}

export default function ReviewManagement({ onDeleteReview }: ReviewManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  
  const { data: reviewsData, loading, error, refetch } = useApi(
    () => reviewsApi.getReviews({
      search: searchTerm || undefined,
      page: 0,
      limit: 50
    }),
    [searchTerm]
  );
  
  const { mutate: deleteReview } = useApiMutation();
  
  const reviews = reviewsData?.reviews || [];

  const handleDelete = async (reviewId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteReview(reviewsApi.deleteReview, reviewId.toString());
        onDeleteReview(reviewId);
        setSelectedReview(null);
        refetch(); // Refresh the list
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đánh giá</h1>
          <p className="text-gray-600">Xem xét và quản lý các đánh giá từ sinh viên</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo nội dung, tên sinh viên, danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <p className="text-red-700">Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{review.userName}</span>
                      <span className="text-sm text-gray-500">({review.userCode})</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đã duyệt
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{review.averageRating.toFixed(1)}/5</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Danh mục: </span>
                    <span className="text-sm text-purple-600">{review.categories.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa đánh giá"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Nhận xét chung:</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 line-clamp-3">
                    {review.commonReview || 'Không có nhận xét chung'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reviews.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <p>Không có đánh giá nào</p>
          </div>
        )}

        {/* Review Detail Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết đánh giá</h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold">{selectedReview.userName}</span>
                    <span className="text-gray-500">({selectedReview.userCode})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>{selectedReview.averageRating.toFixed(1)}/5</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã duyệt
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Danh mục: </span>
                  <span className="text-purple-600">{selectedReview.categories.join(', ')}</span>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nhận xét chung:</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
                    {selectedReview.commonReview || 'Không có nhận xét chung'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(selectedReview.id)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}