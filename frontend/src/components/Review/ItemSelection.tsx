import React, { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Subject, Lecturer } from '../../types';
import { subjectsApi, lecturersApi } from '../../services/api';
import { useApi } from '../../hooks/useApi';

interface ItemSelectionProps {
  categoryId: number;
  categoryName: string;
  selectedItems: number[];
  onItemsChange: (items: number[]) => void;
}

export default function ItemSelection({ categoryId, categoryName, selectedItems, onItemsChange }: ItemSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: subjectsData, loading: subjectsLoading } = useApi(
    () => subjectsApi.getSubjects({ search: searchTerm }),
    [searchTerm]
  );
  
  const { data: lecturersData, loading: lecturersLoading } = useApi(
    () => lecturersApi.getLecturers({ search: searchTerm }),
    [searchTerm]
  );

  const getItems = () => {
    if (categoryId === 1) return subjectsData?.subjects || [];
    if (categoryId === 2) return lecturersData?.lecturers || [];
    return [];
  };
  
  const items = getItems();
  const isLoading = categoryId === 1 ? subjectsLoading : lecturersLoading;

  const handleItemToggle = (itemId: number) => {
    const newSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onItemsChange(newSelectedItems);
  };

  if (categoryId !== 1 && categoryId !== 2) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Chọn {categoryName.toLowerCase()} bạn muốn đánh giá (có thể chọn nhiều):
      </label>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={`Tìm kiếm ${categoryName.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
          {items.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => handleItemToggle(item.id)}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  {'code' in item && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.code} • {item.credits} tín chỉ • {item.semester}
                    </p>
                  )}
                  {'department' in item && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.department} • {item.specialization}
                    </p>
                  )}
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      {selectedItems.length > 0 && (
        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            Đã chọn {selectedItems.length} {categoryName.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}