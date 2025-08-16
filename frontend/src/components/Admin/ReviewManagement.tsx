import React, { useState, useEffect } from 'react';
import { Search, Trash2, Calendar, Star, User, ChevronDown } from 'lucide-react';
import { ReviewHistoryItem } from '../../types';
import { reviewsApi } from '../../services/api';
import { useApi, useApiMutation } from '../../hooks/useApi';

interface ReviewManagementProps {
  onDeleteReview: (reviewId: number) => void;
}

type AdminReviewItem = ReviewHistoryItem & {
  userName: string;
  userCode: string;
};

export default function ReviewManagement({ onDeleteReview }: ReviewManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  
  const { data: reviewsData, loading, error, refetch } = useApi(
    () => reviewsApi.getDetailedReviews({
      search: searchTerm || undefined,
      page: currentPage,
      limit: itemsPerPage
    }),
    [searchTerm, currentPage]
  );
  
  const { mutate: deleteReview } = useApiMutation();
  
  const reviews = reviewsData?.reviews || [];
  const totalPages = reviewsData?.totalPages || 0;
  const totalItems = reviewsData?.totalItems || 0;

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const toggleExpand = (reviewId: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleDelete = async (reviewId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      try {
        await deleteReview(reviewsApi.deleteReview, reviewId.toString());
        onDeleteReview(reviewId);
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
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            
            return (
              <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
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
                        <span>{review.categories.length > 0 ? Math.round(review.categories.reduce((sum, cat) => sum + cat.rate, 0) / review.categories.length) : 0}/5</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Danh mục: </span>
                      <span className="text-sm text-purple-600">{review.categories.map(cat => cat.name).join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa đánh giá"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Cảm nhận chung - luôn hiển thị */}
                {review.generalFeedback && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">Cảm nhận chung:</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{review.generalFeedback}</p>
                  </div>
                )}

                {/* Nút toggle cố định vị trí */}
                <div>
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 hover:bg-purple-50 rounded-lg px-3 py-2 -mx-3"
                  >
                    <ChevronDown 
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : 'rotate-0'
                      }`} 
                    />
                    <span>
                      {isExpanded ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                    </span>
                  </button>
                </div>

                {/* Chi tiết đánh giá - hiển thị bên dưới button với animation đơn giản */}
                <div 
                  className={`transition-all duration-500 ease-out overflow-hidden ${
                    isExpanded 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-4">Đánh giá chi tiết:</h4>
                    <div className="space-y-3 mb-4">
                      {review.categories.map((category, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{category.name}</h5>
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= category.rate
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-sm font-medium text-gray-700">({category.rate}/5)</span>
                            </div>
                          </div>
                          
                          {/* Hiển thị môn học nếu có */}
                          {category.subjects && category.subjects.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.subjects.map((subject, subIdx) => (
                                  <span
                                    key={subIdx}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Hiển thị giảng viên nếu có */}
                          {category.lecturers && category.lecturers.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.lecturers.map((lecturer, lecIdx) => (
                                  <span
                                    key={lecIdx}
                                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {lecturer}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <p className="text-gray-700 bg-white rounded-lg p-3 border">
                            {category.comment || 'Không có nhận xét cho danh mục này'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {reviews.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <p>Không có đánh giá nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
            
            <span className="text-sm text-gray-700 ml-4">
              Trang {currentPage + 1} / {totalPages} ({totalItems} đánh giá)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}