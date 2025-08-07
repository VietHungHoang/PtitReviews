import React from 'react';
import { User, LogOut, BarChart3, Home, History, FileText, Server } from 'lucide-react';

interface HeaderProps {
  user: any;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Header({ user, currentPage, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PTIT Reviews</h1>
                <p className="text-xs text-gray-500">Hệ thống đánh giá sinh viên</p>
              </div>
            </div>
            
            {user && (
              <nav className="hidden md:flex space-x-6">
                {user.role === 'student' ? (
                  <>
                    <button
                      onClick={() => onNavigate('categories')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                        currentPage === 'categories'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Trang chủ</span>
                    </button>
                    <button
                      onClick={() => onNavigate('history')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                        currentPage === 'history'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <History className="w-4 h-4" />
                      <span>Lịch sử đánh giá</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                        currentPage === 'dashboard'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => onNavigate('reviews')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                        currentPage === 'reviews'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Quản lý đánh giá</span>
                    </button>
                    <button
                      onClick={() => onNavigate('api-docs')}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                        currentPage === 'api-docs'
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Server className="w-4 h-4" />
                      <span>API Docs</span>
                    </button>
                  </>
                )}
              </nav>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.role === 'admin' ? 'Quản trị viên' : user.studentId}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}