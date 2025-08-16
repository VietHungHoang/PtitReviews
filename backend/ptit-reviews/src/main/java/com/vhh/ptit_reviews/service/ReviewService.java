package com.vhh.ptit_reviews.service;

import java.util.List;

import com.vhh.ptit_reviews.domain.model.ReviewErrorType;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.AdminReviewsResponse;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.domain.response.ReviewHistoryItemResponse;
import com.vhh.ptit_reviews.domain.response.AdminDetailedReviewsResponse;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest reviewRequest, Long userId);
    List<ReviewErrorType> checkReviews(ReviewRequest reviewRequest);
    List<ReviewHistoryItemResponse> getUserReviews(Long userId);
    AdminReviewsResponse getAllReviews(int page, int limit, String search);
    AdminDetailedReviewsResponse getDetailedReviews(int page, int limit, String search);
    void deleteReview(Long reviewId);
}
