package com.vhh.ptit_reviews.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Category;
import com.vhh.ptit_reviews.domain.response.CategoryResponse;
import com.vhh.ptit_reviews.repository.CategoryRepository;
import com.vhh.ptit_reviews.service.CategoryService;
import com.vhh.ptit_reviews.service.mapper.CategoryMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getAllCategoryResponses() {
        List<Category> categories = categoryRepository.findAll(); 
        List<CategoryResponse> categoryResponses = categoryMapper.categoriesToCategoryRequests(categories);
        return categoryResponses;
    }

    public getCategoryInfoByIds() {
        
    }
}