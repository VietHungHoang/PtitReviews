package com.vhh.ptit_reviews.service.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Category;
import com.vhh.ptit_reviews.domain.response.CategoryResponse;

@Service
public class CategoryMapper {
    public List<CategoryResponse> categoriesToCategoryRequests(List<Category> categories) {
        return categories.stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName(), category.getDescription(), category.getIcon()))
                .toList();
    } 
}
