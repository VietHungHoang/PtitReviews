package com.vhh.ptit_reviews.service;

import java.util.List;

import com.vhh.ptit_reviews.domain.model.ReviewErrorType;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.domain.response.ReviewHistoryItemResponse;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest reviewRequest, Long userId);
    List<ReviewErrorType> checkReviews(ReviewRequest reviewRequest);
    List<ReviewHistoryItemResponse> getUserReviews(Long userId);
}
