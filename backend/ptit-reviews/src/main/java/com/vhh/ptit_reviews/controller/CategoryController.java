package com.vhh.ptit_reviews.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.CategoryResponse;
import com.vhh.ptit_reviews.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categoryResponses = categoryService.getAllCategoryResponses();
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>(200, categoryResponses, "Get categories successfully");
        return ResponseEntity.ok(response); 
    }    

    @GetMapping("")
    public ResponseEntity<?> getCategoryInfoByIds(@RequestParam List<Integer> id) {
        
    }

}
