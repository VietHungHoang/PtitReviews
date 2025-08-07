import React from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { analyticsApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export default function Dashboard() {
  const { data: dashboardData, loading, error } = useApi(() => analyticsApi.getDashboard(), []);
  
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
      change: '+12%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      name: 'Đã phê duyệt',
      value: dashboardData?.approvedReviews?.toString() || '0',
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'Bị từ chối',
      value: dashboardData?.rejectedReviews?.toString() || '0',
      change: '-12%',
      changeType: 'increase',
      icon: XCircle,
      color: 'red'
    },
    {
      name: 'Điểm TB',
      value: dashboardData?.averageRating?.toFixed(1) || '0.0',
      change: '+0.3',
      changeType: 'increase',
      icon: BarChart3,
      color: 'purple'
    }
  ];

  const categoryStats = dashboardData?.reviewsByCategory ? 
    Object.entries(dashboardData.reviewsByCategory).map(([key, count], index) => {
      const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];
      const names = {
        subjects: 'Môn học',
        lecturers: 'Giảng viên',
        facilities: 'Cơ sở vật chất',
        library: 'Thư viện',
        registration: 'Đăng ký học phần',
        services: 'Dịch vụ sinh viên'
      };
      const total = Object.values(dashboardData.reviewsByCategory).reduce((sum, val) => sum + val, 0);
      return {
        name: names[key as keyof typeof names] || key,
        count: count as number,
        percentage: total > 0 ? Math.round((count as number / total) * 100) : 0,
        color: colors[index % colors.length]
      };
    }) : [];

  const recentReviews = [
    {
      id: 1,
      category: 'Môn học',
      rating: 4,
      preview: 'Môn học rất hay và thực tế, giảng viên nhiệt tình...',
      time: '2 phút trước',
      status: 'approved'
    },
    {
      id: 2,
      category: 'Cơ sở vật chất',
      rating: 3,
      preview: 'Phòng học khá tốt nhưng máy chiếu đôi khi bị lỗi...',
      time: '15 phút trước',
      status: 'pending'
    },
    {
      id: 3,
      category: 'Thư viện',
      rating: 5,
      preview: 'Thư viện rất yên tĩnh, phù hợp để học tập...',
      time: '1 giờ trước',
      status: 'approved'
    }
  ];

  const colorMap = {
    blue: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
          <p className="text-gray-600">Tổng quan về hệ thống đánh giá sinh viên PTIT</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">so với tháng trước</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Đánh giá theo danh mục</h2>
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

          {/* Recent Reviews */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Đánh giá gần đây</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{review.category}</span>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{review.preview}</p>
                  <p className="text-xs text-gray-500">{review.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Xu hướng đánh giá theo thời gian</h2>
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
                
                {/* Data line */}
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  points="40,160 80,140 120,120 160,100 200,90 240,85 280,80 320,75 360,70"
                />
                
                {/* Fill area */}
                <polygon
                  fill="url(#gradient)"
                  points="40,160 80,140 120,120 160,100 200,90 240,85 280,80 320,75 360,70 360,160 40,160"
                />
                
                {/* Data points */}
                {[
                  {x: 40, y: 160}, {x: 80, y: 140}, {x: 120, y: 120}, 
                  {x: 160, y: 100}, {x: 200, y: 90}, {x: 240, y: 85}, 
                  {x: 280, y: 80}, {x: 320, y: 75}, {x: 360, y: 70}
                ].map((point, i) => (
                  <circle key={i} cx={point.x} cy={point.y} r="4" fill="#8B5CF6"/>
                ))}
                
                {/* Labels */}
                <text x="40" y="185" textAnchor="middle" className="text-xs fill-gray-500">T1</text>
                <text x="120" y="185" textAnchor="middle" className="text-xs fill-gray-500">T3</text>
                <text x="200" y="185" textAnchor="middle" className="text-xs fill-gray-500">T5</text>
                <text x="280" y="185" textAnchor="middle" className="text-xs fill-gray-500">T7</text>
                <text x="360" y="185" textAnchor="middle" className="text-xs fill-gray-500">T9</text>
              </svg>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Phân bố điểm đánh giá</h2>
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {/* Bars */}
                {[
                  {x: 60, height: 20, label: '1★', count: 12},
                  {x: 120, height: 35, label: '2★', count: 28},
                  {x: 180, height: 80, label: '3★', count: 156},
                  {x: 240, height: 120, label: '4★', label: '4★', count: 324},
                  {x: 300, height: 140, label: '5★', count: 589}
                ].map((bar, i) => (
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