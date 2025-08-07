import React, { useState } from 'react';
import { Code, Copy, Check, Server, Database, User, MessageSquare, BookOpen, Users as UsersIcon } from 'lucide-react';

export default function ApiDocumentation() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiEndpoints = [
    {
      category: 'Authentication',
      icon: User,
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Đăng nhập người dùng',
          request: {
            email: 'string',
            password: 'string'
          },
          response: {
            status: 'success',
            data: {
              user: {
                id: 'string',
                name: 'string',
                email: 'string',
                studentId: 'string | null',
                role: 'admin | student',
                avatar: 'string | null'
              },
              token: 'string'
            },
            message: 'Đăng nhập thành công'
          }
        },
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Đăng ký tài khoản mới',
          request: {
            name: 'string',
            email: 'string',
            password: 'string',
            studentId: 'string'
          },
          response: {
            status: 'success',
            data: {
              user: {
                id: 'string',
                name: 'string',
                email: 'string',
                studentId: 'string',
                role: 'student'
              }
            },
            message: 'Đăng ký thành công'
          }
        },
        {
          method: 'POST',
          path: '/api/auth/logout',
          description: 'Đăng xuất người dùng',
          request: {},
          response: {
            status: 'success',
            data: null,
            message: 'Đăng xuất thành công'
          }
        }
      ]
    },
    {
      category: 'Reviews',
      icon: MessageSquare,
      endpoints: [
        {
          method: 'GET',
          path: '/api/reviews',
          description: 'Lấy danh sách đánh giá (có phân trang và filter)',
          request: {
            page: 'number (optional)',
            limit: 'number (optional)',
            status: 'approved | rejected | pending (optional)',
            category: 'subjects | lecturers | facilities | library | registration | services (optional)',
            search: 'string (optional)'
          },
          response: {
            status: 'success',
            data: {
              reviews: [
                {
                  id: 'string',
                  userId: 'string',
                  userName: 'string',
                  studentId: 'string',
                  categories: ['subjects'],
                  selectedItems: ['string'],
                  rating: 'number',
                  freeComment: 'string',
                  generalFeedback: 'string',
                  hasUsedService: 'boolean',
                  createdAt: 'string (ISO date)',
                  status: 'approved | rejected | pending',
                  rejectionReason: 'string | null'
                }
              ],
              pagination: {
                page: 'number',
                limit: 'number',
                total: 'number',
                totalPages: 'number'
              }
            },
            message: 'Lấy danh sách đánh giá thành công'
          }
        },
        {
          method: 'POST',
          path: '/api/reviews',
          description: 'Tạo đánh giá mới',
          request: {
            categories: ['subjects'],
            selectedItems: ['string'],
            rating: 'number (1-5)',
            freeComment: 'string',
            generalFeedback: 'string',
            hasUsedService: 'boolean'
          },
          response: {
            status: 'success',
            data: {
              review: {
                id: 'string',
                userId: 'string',
                categories: ['subjects'],
                selectedItems: ['string'],
                rating: 'number',
                freeComment: 'string',
                generalFeedback: 'string',
                hasUsedService: 'boolean',
                createdAt: 'string (ISO date)',
                status: 'pending'
              }
            },
            message: 'Tạo đánh giá thành công'
          }
        },
        {
          method: 'GET',
          path: '/api/reviews/:id',
          description: 'Lấy chi tiết một đánh giá',
          request: {},
          response: {
            status: 'success',
            data: {
              review: {
                id: 'string',
                userId: 'string',
                userName: 'string',
                studentId: 'string',
                categories: ['subjects'],
                selectedItems: ['string'],
                rating: 'number',
                freeComment: 'string',
                generalFeedback: 'string',
                hasUsedService: 'boolean',
                createdAt: 'string (ISO date)',
                status: 'approved | rejected | pending',
                rejectionReason: 'string | null'
              }
            },
            message: 'Lấy chi tiết đánh giá thành công'
          }
        },
        {
          method: 'DELETE',
          path: '/api/reviews/:id',
          description: 'Xóa đánh giá (chỉ admin)',
          request: {},
          response: {
            status: 'success',
            data: null,
            message: 'Xóa đánh giá thành công'
          }
        },
        {
          method: 'GET',
          path: '/api/reviews/user/:userId',
          description: 'Lấy danh sách đánh giá của một user',
          request: {},
          response: {
            status: 'success',
            data: {
              reviews: [
                {
                  id: 'string',
                  categories: ['subjects'],
                  selectedItems: ['string'],
                  rating: 'number',
                  freeComment: 'string',
                  generalFeedback: 'string',
                  hasUsedService: 'boolean',
                  createdAt: 'string (ISO date)',
                  status: 'approved | rejected | pending',
                  rejectionReason: 'string | null'
                }
              ]
            },
            message: 'Lấy danh sách đánh giá của user thành công'
          }
        }
      ]
    },
    {
      category: 'Subjects',
      icon: BookOpen,
      endpoints: [
        {
          method: 'GET',
          path: '/api/subjects',
          description: 'Lấy danh sách môn học',
          request: {
            search: 'string (optional)',
            semester: 'string (optional)'
          },
          response: {
            status: 'success',
            data: {
              subjects: [
                {
                  id: 'string',
                  name: 'string',
                  code: 'string',
                  credits: 'number',
                  semester: 'string'
                }
              ]
            },
            message: 'Lấy danh sách môn học thành công'
          }
        },
        {
          method: 'GET',
          path: '/api/subjects/:id',
          description: 'Lấy chi tiết môn học',
          request: {},
          response: {
            status: 'success',
            data: {
              subject: {
                id: 'string',
                name: 'string',
                code: 'string',
                credits: 'number',
                semester: 'string',
                description: 'string',
                prerequisites: ['string']
              }
            },
            message: 'Lấy chi tiết môn học thành công'
          }
        }
      ]
    },
    {
      category: 'Lecturers',
      icon: UsersIcon,
      endpoints: [
        {
          method: 'GET',
          path: '/api/lecturers',
          description: 'Lấy danh sách giảng viên',
          request: {
            search: 'string (optional)',
            department: 'string (optional)'
          },
          response: {
            status: 'success',
            data: {
              lecturers: [
                {
                  id: 'string',
                  name: 'string',
                  department: 'string',
                  specialization: 'string',
                  email: 'string'
                }
              ]
            },
            message: 'Lấy danh sách giảng viên thành công'
          }
        },
        {
          method: 'GET',
          path: '/api/lecturers/:id',
          description: 'Lấy chi tiết giảng viên',
          request: {},
          response: {
            status: 'success',
            data: {
              lecturer: {
                id: 'string',
                name: 'string',
                department: 'string',
                specialization: 'string',
                email: 'string',
                bio: 'string',
                subjects: ['string']
              }
            },
            message: 'Lấy chi tiết giảng viên thành công'
          }
        }
      ]
    },
    {
      category: 'Analytics',
      icon: Database,
      endpoints: [
        {
          method: 'GET',
          path: '/api/analytics/dashboard',
          description: 'Lấy dữ liệu dashboard (chỉ admin)',
          request: {},
          response: {
            status: 'success',
            data: {
              totalReviews: 'number',
              approvedReviews: 'number',
              rejectedReviews: 'number',
              pendingReviews: 'number',
              averageRating: 'number',
              reviewsByCategory: {
                subjects: 'number',
                lecturers: 'number',
                facilities: 'number',
                library: 'number',
                registration: 'number',
                services: 'number'
              },
              trendData: [
                {
                  date: 'string (YYYY-MM-DD)',
                  count: 'number'
                }
              ]
            },
            message: 'Lấy dữ liệu dashboard thành công'
          }
        },
        {
          method: 'GET',
          path: '/api/analytics/reviews/stats',
          description: 'Thống kê đánh giá theo thời gian',
          request: {
            startDate: 'string (YYYY-MM-DD, optional)',
            endDate: 'string (YYYY-MM-DD, optional)',
            groupBy: 'day | week | month (optional)'
          },
          response: {
            status: 'success',
            data: {
              stats: [
                {
                  period: 'string',
                  count: 'number',
                  averageRating: 'number'
                }
              ]
            },
            message: 'Lấy thống kê đánh giá thành công'
          }
        }
      ]
    }
  ];

  const errorResponses = [
    {
      code: 400,
      status: 'error',
      message: 'Dữ liệu không hợp lệ',
      example: {
        status: 'error',
        data: null,
        message: 'Email không đúng định dạng'
      }
    },
    {
      code: 401,
      status: 'error',
      message: 'Không có quyền truy cập',
      example: {
        status: 'error',
        data: null,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      }
    },
    {
      code: 403,
      status: 'error',
      message: 'Không đủ quyền thực hiện',
      example: {
        status: 'error',
        data: null,
        message: 'Chỉ admin mới có thể thực hiện hành động này'
      }
    },
    {
      code: 404,
      status: 'error',
      message: 'Không tìm thấy tài nguyên',
      example: {
        status: 'error',
        data: null,
        message: 'Đánh giá không tồn tại'
      }
    },
    {
      code: 500,
      status: 'error',
      message: 'Lỗi server',
      example: {
        status: 'error',
        data: null,
        message: 'Đã xảy ra lỗi không mong muốn'
      }
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600">PTIT Student Review System API</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Base URL</h2>
            <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm">
              https://api.ptit-reviews.com/v1
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Response Format</h2>
            <p className="text-gray-600 mb-4">Tất cả API responses đều có format chuẩn:</p>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
              <pre>{JSON.stringify({
                status: "success | error",
                data: "object | array | null",
                message: "string"
              }, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* API Endpoints */}
        {apiEndpoints.map((category) => {
          const IconComponent = category.icon;
          return (
            <div key={category.category} className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <IconComponent className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
              </div>
              
              <div className="space-y-6">
                {category.endpoints.map((endpoint, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </span>
                          <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(endpoint.path, `${category.category}-${index}`)}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Copy endpoint"
                        >
                          {copiedEndpoint === `${category.category}-${index}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{endpoint.description}</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Request */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            Request
                          </h4>
                          <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(endpoint.request, null, 2)}</pre>
                          </div>
                        </div>
                        
                        {/* Response */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            Response
                          </h4>
                          <div className="bg-gray-900 rounded-lg p-4 text-blue-400 font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Error Responses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Server className="w-6 h-6 text-red-600 mr-3" />
            Error Responses
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {errorResponses.map((error) => (
              <div key={error.code} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-red-600">{error.code}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {error.status}
                  </span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{error.message}</h4>
                
                <div className="bg-gray-900 rounded-lg p-3 text-red-400 font-mono text-xs overflow-x-auto">
                  <pre>{JSON.stringify(error.example, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Authentication
          </h2>
          
          <p className="text-gray-600 mb-4">
            Sử dụng Bearer Token trong header Authorization cho các API cần xác thực:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-4 text-yellow-400 font-mono text-sm">
            <pre>Authorization: Bearer &lt;your-token&gt;</pre>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Lưu ý:</strong> Token có thời hạn 24 giờ. Khi token hết hạn, bạn cần đăng nhập lại để lấy token mới.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}