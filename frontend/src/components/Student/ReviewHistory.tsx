import { useState } from 'react';
import { Calendar, Star, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

interface ReviewHistoryProps {
  userId: string;
}

export default function ReviewHistory({ userId }: ReviewHistoryProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  
  const { data: reviewsData, loading, error } = useApi(
    () => reviewsApi.getUserReviews(userId),
    [userId]
  );
  
  // Sắp xếp reviews theo thứ tự mới nhất trước
  const allReviews = (reviewsData?.reviews || []).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Tính toán pagination
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const reviews = allReviews.slice(startIndex, endIndex);

  const toggleExpand = (reviewId: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedReviews(new Set()); // Reset expanded reviews when changing page
  };

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
            reviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              
              return (
                <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Danh mục: {review.categories.map(cat => cat.name).join(', ')}
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

                  {/* Cảm nhận chung - luôn hiển thị */}
                  {review.generalFeedback && (
                    <div className="mb-2">
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
                        {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
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
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Previous button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Trước
            </button>

            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                // Show first page, last page, current page, and pages around current page
                const showPage = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  Math.abs(pageNum - currentPage) <= 1;
                
                if (!showPage) {
                  // Show ellipsis for gaps
                  if (pageNum === 2 && currentPage > 4) {
                    return (
                      <span key="ellipsis-start" className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <span key="ellipsis-end" className="px-3 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Thông tin pagination */}
        {allReviews.length > 0 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, allReviews.length)} trong tổng số {allReviews.length} đánh giá
          </div>
        )}
      </div>
    </div>
  );
}