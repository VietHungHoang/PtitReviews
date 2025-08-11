import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, NotificationProps } from './types';
import { authApi } from './services/api';
import Header from './components/Layout/Header';
import LoginPage from './components/Auth/LoginPage';
import CategorySelection from './components/Categories/CategorySelection';
import { ReviewForm } from './components/Review/ReviewForm';
import Dashboard from './components/Analytics/Dashboard';
import ReviewHistory from './components/Student/ReviewHistory';
import ReviewManagement from './components/Admin/ReviewManagement';
import Notification from './components/Common/Notification';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<NotificationProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing auth token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // You could add a /auth/me endpoint to verify token and get user info
          // For now, we'll just assume token is valid
          const mockUser = {
            id: '1',
            name: 'Current User',
            email: 'user@ptit.edu.vn',
            role: 'student' as const
          };
          setUser(mockUser);
        } catch (error) {
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Redirect based on role
    if (userData.role.toLowerCase() === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSubmitReview = (reviewData: any) => {
    setNotification({
      type: 'success',
      title: 'Đánh giá đã được gửi!',
      message: 'Cảm ơn bạn đã gửi đánh giá. Hệ thống sẽ tự động xử lý và phê duyệt đánh giá của bạn.',
      onClose: () => setNotification(null)
    });
    navigate('/');
  };

  const handleDeleteReview = (reviewId: string) => {
    setNotification({
      type: 'success',
      title: 'Đã xóa đánh giá',
      message: 'Đánh giá đã được xóa khỏi hệ thống.',
      onClose: () => setNotification(null)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && user.role.toLowerCase() !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  // Public Route Component (redirect if logged in)
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (user) {
      return <Navigate to={user.role.toLowerCase() === 'admin' ? '/admin/dashboard' : '/'} replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Header 
          user={user} 
          currentPath={location.pathname}
          onLogout={handleLogout} 
        />
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage onLogin={handleLogin} />
            </PublicRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {user?.role.toLowerCase() === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <CategorySelection />
              )}
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/review" 
          element={
            <ProtectedRoute>
              <ReviewForm 
                onSubmit={handleSubmitReview}
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <ReviewHistory userId={user?.id || ''} />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/reviews" 
          element={
            <ProtectedRoute adminOnly>
              <ReviewManagement onDeleteReview={handleDeleteReview} />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <Navigate to={user ? (user.role.toLowerCase() === 'admin' ? '/admin/dashboard' : '/') : '/login'} replace />
          } 
        />
      </Routes>
      
      {notification && (
        <Notification {...notification} />
      )}
    </div>
  );
}

export default App;