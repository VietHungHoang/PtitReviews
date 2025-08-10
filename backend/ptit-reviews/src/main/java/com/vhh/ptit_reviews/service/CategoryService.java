package com.vhh.ptit_reviews.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.response.CategoryInfoResponse;
import com.vhh.ptit_reviews.domain.response.CategoryResponse;

@Service
public interface CategoryService {
   List<CategoryResponse> getAllCategoryResponses(); 
   List<CategoryInfoResponse> getCategoryInfoByIds(List<Long> categoryIds);
}
