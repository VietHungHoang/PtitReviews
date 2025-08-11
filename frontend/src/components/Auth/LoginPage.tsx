import React, { useState } from 'react';
import { Mail, Lock, Facebook, Chrome } from 'lucide-react';
import { authApi } from '../../services/api';
import { useApiMutation } from '../../hooks/useApi';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setStudentId] = useState('');
  const { mutate: loginMutation, isSubmitting, error } = useApiMutation();
  const { mutate: registerMutation } = useApiMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        const response = await loginMutation(authApi.login, { email, password });
        onLogin(response.data.user);
      } else {
        const response = await registerMutation(authApi.register, {
          name,
          email,
          password,
          code,
        });
        onLogin(response.data.user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Mock admin login for demo
    const isAdmin = provider === 'admin-demo';
    const user = {
      id: '1',
      name: isAdmin ? 'Admin PTIT' : 'Nguyễn Văn A',
      email: isAdmin ? 'admin@ptit.edu.vn' : 'nguyenvana@ptit.edu.vn',
      studentId: isAdmin ? undefined : 'B20DCCN001',
      role: isAdmin ? 'admin' : 'student',
    };
    
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">PTIT Reviews</h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã sinh viên
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ví dụ: B20DCCN001"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Email của bạn"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Tạo tài khoản')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('facebook')}
                className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="ml-2 text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="ml-2 text-sm font-medium">Google</span>
              </button>
            </div>
            
            <div className="mt-4">
              <button
                onClick={() => handleSocialLogin('admin-demo')}
                className="w-full flex justify-center items-center px-4 py-3 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span className="text-sm font-medium text-purple-600">Demo Admin Login</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}