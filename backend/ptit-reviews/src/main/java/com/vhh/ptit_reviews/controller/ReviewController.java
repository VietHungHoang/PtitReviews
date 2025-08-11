package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.domain.model.User;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@RequestBody ReviewRequest reviewRequest) {
        // Lấy user hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        
        ReviewResponse reviewResponse = reviewService.createReview(reviewRequest, user.getId());
        ApiResponse<ReviewResponse> response = ApiResponse.<ReviewResponse>builder()
                .status(201)
                .data(null)
                .message("Review created successfully")
                .build();
        return ResponseEntity.status(201).body(response);
    }
}
