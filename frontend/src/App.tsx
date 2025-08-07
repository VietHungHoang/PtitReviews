import React, { useState } from 'react';
import { User, Review, CategoryInfo, NotificationProps } from './types';
import { authApi } from './services/api';
import Header from './components/Layout/Header';
import LoginPage from './components/Auth/LoginPage';
import CategorySelection from './components/Categories/CategorySelection';
import { ReviewForm } from './components/Review/ReviewForm';
import Dashboard from './components/Analytics/Dashboard';
import ReviewHistory from './components/Student/ReviewHistory';
import ReviewManagement from './components/Admin/ReviewManagement';
import Notification from './components/Common/Notification';
import ApiDocumentation from './components/Admin/ApiDocumentation';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('categories');
  const [selectedCategories, setSelectedCategories] = useState<CategoryInfo[]>([]);
  const [notification, setNotification] = useState<NotificationProps | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage(userData.role === 'admin' ? 'dashboard' : 'categories');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setCurrentPage('login');
    setSelectedCategories([]);
  };

  const handleSelectCategories = (categories: CategoryInfo[]) => {
    setSelectedCategories(categories);
    setCurrentPage('review');
  };

  const handleSubmitReview = (reviewData: any) => {
    setNotification({
      type: 'success',
      title: 'Đánh giá đã được gửi!',
      message: 'Cảm ơn bạn đã gửi đánh giá. Hệ thống sẽ tự động xử lý và phê duyệt đánh giá của bạn.',
      onClose: () => setNotification(null)
    });
    setCurrentPage('categories');
    setSelectedCategories([]);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'review') {
      setSelectedCategories([]);
    }
  };

  const handleBackToCategories = () => {
    setCurrentPage('categories');
    setSelectedCategories([]);
  };

  const handleDeleteReview = (reviewId: string) => {
    setNotification({
      type: 'success',
      title: 'Đã xóa đánh giá',
      message: 'Đánh giá đã được xóa khỏi hệ thống.',
      onClose: () => setNotification(null)
    });
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout} 
      />
      
      {user.role === 'student' && (
        <>
          {currentPage === 'categories' && (
            <CategorySelection onSelectCategories={handleSelectCategories} />
          )}
          
          {currentPage === 'review' && selectedCategories.length > 0 && (
            <ReviewForm 
              selectedCategories={selectedCategories}
              onSubmit={handleSubmitReview}
              onBack={handleBackToCategories}
            />
          )}
          
          {currentPage === 'history' && (
            <ReviewHistory userId={user.id} />
          )}
        </>
      )}
      
      {user.role === 'admin' && (
        <>
          {currentPage === 'dashboard' && (
            <Dashboard />
          )}
          
          {currentPage === 'reviews' && (
            <ReviewManagement 
              onDeleteReview={handleDeleteReview}
            />
          )}
          
          {currentPage === 'api-docs' && (
            <ApiDocumentation />
          )}
        </>
      )}
      
      {notification && (
        <Notification {...notification} />
      )}
    </div>
  );
}

export default App;