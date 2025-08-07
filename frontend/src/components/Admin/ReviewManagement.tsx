import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, Calendar, Star, User } from 'lucide-react';
import { Review } from '../../types';
import { subjects, lecturers } from '../../data/mockData';

interface ReviewManagementProps {
  reviews: Review[];
  onDeleteReview: (reviewId: string) => void;
}

export default function ReviewManagement({ reviews, onDeleteReview }: ReviewManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.freeComment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (reviewId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      onDeleteReview(reviewId);
      setSelectedReview(null);
    }
  };

  const getItemNames = (itemIds: string[]) => {
    const allItems = [...subjects, ...lecturers];
    return itemIds.map(id => {
      const item = allItems.find(item => item.id === id);
      return item ? item.name : id;
    }).join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return 'Đang chờ';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đánh giá</h1>
          <p className="text-gray-600">Xem xét và phê duyệt các đánh giá từ sinh viên</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo nội dung, tên sinh viên, chủ đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Bị từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">{review.userName}</span>
                      {review.studentId && (
                        <span className="text-sm text-gray-500">({review.studentId})</span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {getStatusText(review.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{review.rating}/5</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">Chủ đề: </span>
                    <span className="text-sm text-purple-600">{review.categories.join(', ')}</span>
                  </div>
                  
                  {review.selectedItems && review.selectedItems.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Đánh giá về: </span>
                      <span className="text-sm text-blue-600">{getItemNames(review.selectedItems)}</span>
                    </div>
                  )}
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
                  <h4 className="font-medium text-gray-900 mb-1">Nhận xét:</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3 line-clamp-3">{review.freeComment}</p>
                </div>
                
                {review.generalFeedback && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Cảm nhận chung:</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3 line-clamp-2">{review.generalFeedback}</p>
                  </div>
                )}

                {review.status === 'rejected' && review.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h4 className="font-medium text-red-800 mb-1">Lý do từ chối:</h4>
                    <p className="text-red-700 text-sm">{review.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

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
                    {selectedReview.studentId && (
                      <span className="text-gray-500">({selectedReview.studentId})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span>{selectedReview.rating}/5</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReview.status)}`}>
                    {getStatusText(selectedReview.status)}
                  </span>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Chủ đề: </span>
                  <span className="text-purple-600">{selectedReview.categories.join(', ')}</span>
                </div>
                
                {selectedReview.selectedItems && selectedReview.selectedItems.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Đánh giá về: </span>
                    <span className="text-blue-600">{getItemNames(selectedReview.selectedItems)}</span>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Nhận xét:</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedReview.freeComment}</p>
                </div>

                {selectedReview.generalFeedback && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Cảm nhận chung:</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedReview.generalFeedback}</p>
                  </div>
                )}
                
                {selectedReview.status === 'rejected' && selectedReview.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Lý do từ chối:</h4>
                    <p className="text-red-700">{selectedReview.rejectionReason}</p>
                  </div>
                )}
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