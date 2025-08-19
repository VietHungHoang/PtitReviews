import React, { useState, useEffect } from 'react';
import { Mail, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import { useApiMutation } from '../../hooks/useApi';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setStudentId] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: '',
    studentId: ''
  });
  const [loginError, setLoginError] = useState<string>(''); // Add login error state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);
  const { mutate: loginMutation, isSubmitting, error } = useApiMutation();
  const { mutate: registerMutation } = useApiMutation();

  // Function to generate email from name and student ID
  const generateEmail = (fullName: string, studentId: string) => {
    if (!fullName || !studentId) return '';
    
    // Split name into parts
    const nameParts = fullName.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return '';
    
    // Get first name (last word) and initials from other words
    const firstName = nameParts[nameParts.length - 1]; // Last word is first name
    const otherParts = nameParts.slice(0, -1); // All words except the last one
    const initials = otherParts.map(part => part.charAt(0)).join(''); // First letter of each word
    
    // Convert to lowercase and remove Vietnamese accents
    const removeAccents = (str: string) => {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
    };
    
    const firstNameClean = removeAccents(firstName);
    const initialsClean = removeAccents(initials);
    
    // Format student ID: first 3 chars + last 5 chars (remove the middle part)
    // Example: B21DCCN544 -> B21 + CN544 -> b21cn544
    const studentIdFormatted = (studentId.substring(0, 3) + studentId.substring(studentId.length - 5)).toLowerCase();
    
    return `${firstNameClean}${initialsClean}.${studentIdFormatted}@stu.ptit.edu.vn`;
  };

  // Update email when name or student ID changes during registration
  useEffect(() => {
    if (!isLogin && name && code) {
      const generatedEmail = generateEmail(name, code);
      setEmail(generatedEmail);
    }
  }, [name, code, isLogin]);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberPassword(true);
    }
  }, []);

  // Validation functions
  const validatePassword = (pwd: string) => {
    if (!isLogin && pwd.length > 0 && pwd.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    return '';
  };

  const validateConfirmPassword = (pwd: string, confirmPwd: string) => {
    if (!isLogin && confirmPwd.length > 0 && pwd !== confirmPwd) {
      return 'Mật khẩu nhập lại không khớp';
    }
    return '';
  };

  const validateStudentId = (id: string) => {
    if (!isLogin && id.length > 0) {
      // Pattern: B/N + 2 digits + 4 letters + 3 digits (total 10 chars)
      const pattern = /^[BN]\d{2}[A-Z]{4}\d{3}$/;
      if (!pattern.test(id)) {
        return 'Mã sinh viên không hợp lệ';
      }
    }
    return '';
  };

  // Handle input changes without real-time validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStudentId = e.target.value.toUpperCase();
    setStudentId(newStudentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors and login error
    setValidationErrors({
      password: '',
      confirmPassword: '',
      studentId: ''
    });
    setLoginError('');
    
    // Validate for registration only when submitting
    if (!isLogin) {
      const passwordError = validatePassword(password);
      const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
      const studentIdError = validateStudentId(code);
      
      if (passwordError || confirmPasswordError || studentIdError) {
        setValidationErrors({
          password: passwordError,
          confirmPassword: confirmPasswordError,
          studentId: studentIdError
        });
        return;
      }
    }
    
    try {
      if (isLogin) {
        const response = await loginMutation(authApi.login, { email, password });
        
        // Save auth token to localStorage
        if ((response as any).data.token) {
          localStorage.setItem('authToken', (response as any).data.token);
        }
        
        // Handle remember password
        if (rememberPassword) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        
        onLogin((response as any).data.user);
      } else {
        await registerMutation(authApi.register, {
          name,
          email,
          password,
          code,
        });
        
        // Show floating notification using Notification component
        setNotification({
          type: 'success',
          title: 'Đăng ký thành công!',
          message: 'Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.'
        });
        
        // Switch to login and keep email/password for auto-fill
        setIsLogin(true);
        
        // Reset only some form data (keep email and password)
        setName('');
        setConfirmPassword('');
        setStudentId('');
        setValidationErrors({
          password: '',
          confirmPassword: '',
          studentId: ''
        });
        
        // Clear notification after 4 seconds
        setTimeout(() => {
          setNotification(null);
        }, 4000);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (isLogin) {
        // Handle LOGIN errors
        if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error') || !error?.response) {
          // Network error - show popup notification
          setNotification({
            type: 'error',
            title: 'Lỗi kết nối!',
            message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
          });
          setTimeout(() => setNotification(null), 6000);
        } else if (error?.response?.status === 401 || error?.response?.status === 400) {
          // Authentication failed - show error below form
          setLoginError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        } else if (error?.response?.status >= 500) {
          // Server error - show popup notification
          setNotification({
            type: 'error',
            title: 'Lỗi máy chủ!',
            message: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
          });
          setTimeout(() => setNotification(null), 6000);
        } else {
          // Other errors - show error below form
          setLoginError(error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
      } else {
        // Handle REGISTER errors (existing logic)
        let errorTitle = '';
        let errorMessage = '';
        
        if (error?.response?.status === 409) {
          // Conflict error - email or student ID already exists
          errorTitle = 'Đăng ký thất bại!';
          if (error?.response?.data?.message?.includes('email')) {
            errorMessage = 'Email này đã được sử dụng. Vui lòng thử với email khác.';
          } else if (error?.response?.data?.message?.includes('studentId') || error?.response?.data?.message?.includes('code')) {
            errorMessage = 'Mã sinh viên này đã được đăng ký. Vui lòng kiểm tra lại.';
          } else {
            errorMessage = 'Email hoặc mã sinh viên đã tồn tại trong hệ thống.';
          }
        } else if (error?.response?.status === 400) {
          // Bad request - validation errors from backend
          errorTitle = 'Thông tin không hợp lệ!';
          errorMessage = error?.response?.data?.message || 'Vui lòng kiểm tra lại thông tin đăng ký.';
        } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error') || !error?.response) {
          // Network error - cannot connect to backend
          errorTitle = 'Lỗi kết nối!';
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';
        } else if (error?.response?.status >= 500) {
          // Server error
          errorTitle = 'Lỗi máy chủ!';
          errorMessage = 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
        } else {
          // Generic error
          errorTitle = 'Đăng ký thất bại!';
          errorMessage = error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
        }
        
        // Show error notification for register
        setNotification({
          type: 'error',
          title: errorTitle,
          message: errorMessage
        });
        
        // Clear error notification after 6 seconds
        setTimeout(() => {
          setNotification(null);
        }, 6000);
      }
    }
  };

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    // Reset validation errors when switching
    setValidationErrors({
      password: '',
      confirmPassword: '',
      studentId: ''
    });
    // Reset login error
    setLoginError('');
    // Reset confirm password
    setConfirmPassword('');
    // Clear notification
    setNotification(null);
    // Keep email when switching between modes
    // Email will be preserved for both login and register
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      {/* Custom Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-100/80 border-green-200 text-green-800' 
            : notification.type === 'error'
            ? 'bg-red-100/80 border-red-200 text-red-800'
            : 'bg-blue-100/80 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.title}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-current hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
          {notification.message && (
            <p className="text-sm mt-1 opacity-90">{notification.message}</p>
          )}
        </div>
      )}
      
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 transition-all duration-1000 ease-out">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 transition-all duration-300">PTIT Reviews</h1>
            <p className="text-gray-600 mt-2 transition-all duration-600 ease-out">
              {isLogin ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Registration fields with smooth animation */}
            <div className={`space-y-4 overflow-hidden transition-all duration-1000 ease-out ${
              !isLogin 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập họ và tên"
                  required={!isLogin}
                  disabled={isLogin}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã sinh viên
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={handleStudentIdChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ví dụ: B20DCCN001"
                  required={!isLogin}
                  disabled={isLogin}
                />
                <div className={`transition-all duration-500 ease-out ${
                  validationErrors.studentId ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {validationErrors.studentId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.studentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email field - visible for login, auto-generated for registration */}
            <div className="space-y-4">
              {isLogin ? (
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
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                      placeholder="Email của bạn"
                      required
                    />
                  </div>
                </div>
              ) : (
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
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                      placeholder="Email sẽ được tạo tự động hoặc bạn có thể nhập email khác"
                      required={!isLogin}
                    />
                  </div>
                  {name && code && email === generateEmail(name, code) && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Email được tạo tự động từ tên và mã sinh viên
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={isLogin ? (e) => setPassword(e.target.value) : handlePasswordChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
                <div className={`transition-all duration-500 ease-out ${
                  !isLogin && validationErrors.password ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {!isLogin && validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>
                
                {/* Remember password checkbox for login - đặt ngay dưới ô mật khẩu */}
                <div className={`transition-all duration-1000 ease-out ${
                  isLogin 
                    ? 'max-h-8 opacity-100 mt-3' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <div className="flex items-center">
                    <input
                      id="remember-password"
                      type="checkbox"
                      checked={rememberPassword}
                      onChange={(e) => setRememberPassword(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors duration-200"
                      disabled={!isLogin}
                    />
                    <label htmlFor="remember-password" className="ml-2 block text-sm text-gray-700">
                      Nhớ mật khẩu
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm password field for registration */}
            <div className={`overflow-hidden transition-all duration-1000 ease-out ${
              !isLogin 
                ? 'max-h-32 opacity-100' 
                : 'max-h-0 opacity-0'
            }`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ">
                  Nhập lại mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                    placeholder="Nhập lại mật khẩu"
                    required={!isLogin}
                    disabled={isLogin}
                  />
                </div>
                <div className={`transition-all duration-500 ease-out ${
                  validationErrors.confirmPassword ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Login error - show below form for login */}
            {isLogin && loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top duration-200">
                <p className="text-red-700 text-sm">{loginError}</p>
              </div>
            )}

            {/* General error - keep for register or other cases */}
            {error && !isLogin && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top duration-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className={isLogin ? 'mt-4' : 'mt-6'}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  isLogin ? 'Đăng nhập' : 'Tạo tài khoản'
                )}
              </button>
            </div>
          </form>

          {/* Temporarily commented out social login
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
                className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="ml-2 text-sm font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Chrome className="w-5 h-5 text-red-500" />
                <span className="ml-2 text-sm font-medium">Google</span>
              </button>
            </div>
          </div>
          */}

          <div className="mt-8 text-center">
            <button
              onClick={toggleLoginRegister}
              className="text-purple-600 hover:text-purple-700 font-medium transition-all duration-300 hover:underline transform hover:scale-105"
            >
              {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}