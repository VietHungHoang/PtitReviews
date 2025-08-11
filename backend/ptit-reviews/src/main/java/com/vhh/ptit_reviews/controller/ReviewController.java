package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.domain.model.ReviewErrorType;
import com.vhh.ptit_reviews.domain.model.User;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.AdminReviewsResponse;
import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.domain.response.ReviewHistoryItemResponse;
import com.vhh.ptit_reviews.domain.response.UserReviewsResponse;
import com.vhh.ptit_reviews.service.ReviewService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@RequestBody ReviewRequest reviewRequest) {
        // Lấy user hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

    // Gọi AI check review
    List<ReviewErrorType> errors = reviewService.checkReviews(reviewRequest);

    // Nếu có lỗi -> trả về 200 cùng danh sách lỗi trong data
    if (!errors.isEmpty() && !errors.contains(ReviewErrorType.NONE)) {
        ReviewResponse reviewResponse = ReviewResponse.builder()
            .id(null)
            .commonReview(reviewRequest.getCommonReview())
            .createdAt(null)
            .updatedAt(null)
            .errors(errors)
            .build();

        ApiResponse<ReviewResponse> errorResponse = ApiResponse.<ReviewResponse>builder()
            .status(200)
            .data(reviewResponse)
            .message("Review không hợp lệ")
            .build();
        return ResponseEntity.ok(errorResponse);
    }

    // Nếu không lỗi -> tạo review và trả về 200
    ReviewResponse reviewResponse = reviewService.createReview(reviewRequest, user.getId());

    ApiResponse<ReviewResponse> response = ApiResponse.<ReviewResponse>builder()
        .status(200)
        .data(reviewResponse)
        .message("Review created successfully")
        .build();

    return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<UserReviewsResponse>> getUserReviews(@PathVariable Long userId) {
        List<ReviewHistoryItemResponse> items = reviewService.getUserReviews(userId);
        UserReviewsResponse payload = UserReviewsResponse.builder().reviews(items).build();
        ApiResponse<UserReviewsResponse> response = ApiResponse.<UserReviewsResponse>builder()
                .status(200)
                .data(payload)
                .message("OK")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AdminReviewsResponse>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        AdminReviewsResponse reviews = reviewService.getAllReviews(page, limit, search);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Reviews retrieved successfully"));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success(null, "Review deleted successfully"));
    }
}
