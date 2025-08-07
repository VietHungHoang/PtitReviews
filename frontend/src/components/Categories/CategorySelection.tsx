import React from 'react';
import { useState } from 'react';
import { BookOpen, Users, Building2, Library, Calendar, HelpCircle, ChevronRight } from 'lucide-react';
import { categories } from '../../data/categories';
import { CategoryInfo } from '../../types';

interface CategorySelectionProps {
  onSelectCategories: (categories: CategoryInfo[]) => void;
}

const iconMap = {
  BookOpen,
  Users,
  Building2,
  Library,
  Calendar,
  HelpCircle,
};

export default function CategorySelection({ onSelectCategories }: CategorySelectionProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryInfo[]>([]);

  const handleCategoryToggle = (category: CategoryInfo) => {
    setSelectedCategories(prev => {
      const isSelected = prev.some(c => c.id === category.id);
      if (isSelected) {
        return prev.filter(c => c.id !== category.id);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      onSelectCategories(selectedCategories);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn chủ đề đánh giá
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chia sẻ ý kiến của bạn về các khía cạnh của PTIT để góp phần cải thiện chất lượng giáo dục
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];
            const isSelected = selectedCategories.some(c => c.id === category.id);
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryToggle(category)}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:scale-105 ${
                  isSelected 
                    ? 'border-purple-500 bg-purple-50/80' 
                    : 'border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    isSelected 
                      ? 'from-purple-600 to-pink-600' 
                      : 'from-purple-500 to-pink-500'
                  }`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-purple-600 border-purple-600' 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold mb-3 transition-colors ${
                  isSelected 
                    ? 'text-purple-700' 
                    : 'text-gray-900 group-hover:text-purple-700'
                }`}>
                  {category.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
                
                <div className={`mt-6 flex items-center font-medium text-sm transition-colors ${
                  isSelected 
                    ? 'text-purple-700' 
                    : 'text-purple-600 group-hover:text-purple-700'
                }`}>
                  <span>{isSelected ? 'Đã chọn' : 'Chọn để đánh giá'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 inline-block">
              <p className="text-gray-600 mb-4">
                Đã chọn {selectedCategories.length} chủ đề: {selectedCategories.map(c => c.title).join(', ')}
              </p>
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Tiếp tục đánh giá
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Góp ý của bạn rất quan trọng!
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Mục tiêu của chúng tôi là thu thập từ 1500-2000 đánh giá để có được cái nhìn toàn diện 
              về chất lượng giáo dục tại PTIT. Mỗi ý kiến đóng góp của bạn đều có giá trị.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Ẩn danh</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Được kiểm duyệt</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Đóng góp xây dựng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}