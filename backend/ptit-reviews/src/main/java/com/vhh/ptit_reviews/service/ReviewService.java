package com.vhh.ptit_reviews.service;

import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest reviewRequest, Long userId);
}
