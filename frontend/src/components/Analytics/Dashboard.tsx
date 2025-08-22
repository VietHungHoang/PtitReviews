import React from 'react';
import { BarChart3, TrendingUp, MessageSquare } from 'lucide-react';
import { analyticsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export default function Dashboard() {
  const { data: dashboardData, loading, error } = useApi(() => analyticsApi.getDashboard(), []);
  
  // Helper function để format danh sách names với truncation
  // Helper function để format danh sách tên với logic mới
  const formatNames = (names: string[], type: 'lecturer' | 'subject'): string => {
    if (!names || names.length === 0) return '';
    
    if (names.length === 1) {
      return names[0];
    } else {
      const remaining = names.length - 1;
      const suffix = type === 'lecturer' ? 'giảng viên khác' : 'môn học khác';
      return `${names[0]} và ${remaining} ${suffix}`;
    }
  };

  // Helper function để tạo category display text
  const getCategoryDisplayText = (review: any): JSX.Element => {
    const categoryName = review.categoryName;
    
    // Chỉ hiển thị lecturer names cho category id = 1 (giảng viên)
    if (review.categoryId === 1 && review.lecturerNames && review.lecturerNames.length > 0) {
      const lecturerText = formatNames(review.lecturerNames, 'lecturer');
      return (
        <span>
          {categoryName}: <span className="text-gray-500 italic">{lecturerText}</span>
        </span>
      );
    }
    
    // Chỉ hiển thị subject names cho category id = 2 (môn học)
    if (review.categoryId === 2 && review.subjectNames && review.subjectNames.length > 0) {
      const subjectText = formatNames(review.subjectNames, 'subject');
      return (
        <span>
          {categoryName}: <span className="text-gray-500 italic">{subjectText}</span>
        </span>
      );
    }
    
    // Nếu không có lecturer/subject names, chỉ hiển thị category name
    return <span>{categoryName}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">Có lỗi xảy ra khi tải dữ liệu: {error}</p>
        </div>
      </div>
    );
  }
  
  const stats = [
    {
      name: 'Tổng đánh giá',
      value: dashboardData?.totalReviews?.toString() || '0',
      change: dashboardData?.weeklyComparison?.reviewsChangePercent || '0%',
      changeType: dashboardData?.weeklyComparison?.reviewsChangeType || 'no_change',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      name: 'Điểm TB',
      value: dashboardData?.averageRating?.toFixed(1) || '0.0',
      change: dashboardData?.weeklyComparison?.ratingChange || '+0.0',
      changeType: dashboardData?.weeklyComparison?.ratingChangeType || 'no_change',
      icon: BarChart3,
      color: 'emerald'
    }
  ];

  const categoryStats = dashboardData?.reviewsByCategory ? 
    Object.entries(dashboardData.reviewsByCategory).map(([key, count], index) => {
      const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo', 'teal', 'rose'];
      const total = Object.values(dashboardData.reviewsByCategory).reduce((sum, val) => sum + val, 0);
      return {
        name: key,
        count: count as number,
        percentage: total > 0 ? Math.round((count as number / total) * 100) : 0,
        color: colors[index % colors.length]
      };
    }) : [];

  const totalCategoryReviews = categoryStats.reduce((sum, category) => sum + category.count, 0);

  const recentReviews = dashboardData?.recentReviews || [];

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    emerald: 'from-emerald-500 to-emerald-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600',
    rose: 'from-rose-500 to-rose-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
          <p className="text-gray-600">Tổng quan về hệ thống đánh giá sinh viên PTIT</p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 lg:items-start">
          {/* Left Column */}
          <div className="flex flex-col h-full space-y-8">
            {/* A11: Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.name} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap]} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">so với tuần trước</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* A21: Category Statistics */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Đánh giá theo danh mục</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tổng {totalCategoryReviews.toLocaleString()} đánh giá
                  </p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {categoryStats.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorMap[category.color as keyof typeof colorMap]}`}></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${colorMap[category.color as keyof typeof colorMap]}`}
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - A12 + A22: Recent Reviews */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 lg:h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Đánh giá gần đây</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{getCategoryDisplayText(review)}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </div>
                          ))}
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Đã duyệt
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{review.preview}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')} bởi {review.userName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có đánh giá nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Xu hướng đánh giá trong tuần</h2>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="40" y1={40 + i * 30} x2="360" y2={40 + i * 30} stroke="#E5E7EB" strokeWidth="1"/>
                ))}
                
                {/* Dữ liệu xu hướng từ backend */}
                {dashboardData?.trendData && dashboardData.trendData.length > 0 && (() => {
                  const trendData = dashboardData.trendData;
                  const maxCount = Math.max(...trendData.map(d => d.count), 1);
                  const points = trendData.map((data, index) => ({
                    x: 40 + (index * 320 / (trendData.length - 1)),
                    y: 160 - (data.count / maxCount) * 120
                  }));
                  
                  const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
                  const polygonPoints = `${pointsStr} 360,160 40,160`;
                  
                  return (
                    <>
                      {/* Data line */}
                      <polyline
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="3"
                        points={pointsStr}
                      />
                      
                      {/* Fill area */}
                      <polygon
                        fill="url(#gradient)"
                        points={polygonPoints}
                      />
                      
                      {/* Data points */}
                      {points.map((point, i) => (
                        <circle key={i} cx={point.x} cy={point.y} r="4" fill="#8B5CF6"/>
                      ))}
                      
                      {/* Hiển thị số lượng chính xác trên từng điểm */}
                      {trendData.map((data, i) => (
                        <text 
                          key={`count-${i}`}
                          x={points[i].x} 
                          y={points[i].y - 10} 
                          textAnchor="middle" 
                          className="text-xs fill-gray-700 font-medium"
                        >
                          {data.count}
                        </text>
                      ))}
                      
                      {/* Labels - hiển thị thứ trong tuần */}
                      {trendData.map((data, i) => (
                        <text 
                          key={i} 
                          x={points[i].x} 
                          y="185" 
                          textAnchor="middle" 
                          className="text-xs fill-gray-500"
                        >
                          {data.date}
                        </text>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Phân bố điểm đánh giá</h2>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Dữ liệu phân bố điểm từ backend */}
                {dashboardData?.ratingDistribution && (() => {
                  const distribution = dashboardData.ratingDistribution;
                  const maxCount = Math.max(...Object.values(distribution), 1);
                  const bars = [1, 2, 3, 4, 5].map((rating, index) => ({
                    x: 60 + index * 60,
                    height: (distribution[rating] / maxCount) * 120,
                    label: `${rating}★`,
                    count: distribution[rating]
                  }));
                  
                  return (
                    <>
                      {bars.map((bar, i) => (
                        <g key={i}>
                          <rect
                            x={bar.x - 15}
                            y={160 - bar.height}
                            width="30"
                            height={bar.height}
                            fill={`url(#barGradient${i})`}
                            rx="4"
                          />
                          <text x={bar.x} y="180" textAnchor="middle" className="text-xs fill-gray-600">
                            {bar.label}
                          </text>
                          <text x={bar.x} y={160 - bar.height - 5} textAnchor="middle" className="text-xs fill-gray-700 font-medium">
                            {bar.count}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
                
                <defs>
                  {[0, 1, 2, 3, 4].map(i => (
                    <linearGradient key={i} id={`barGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EC4899"/>
                      <stop offset="100%" stopColor="#8B5CF6"/>
                    </linearGradient>
                  ))}
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}