package com.vhh.ptit_reviews.service.mapper;

import com.vhh.ptit_reviews.domain.model.Review;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import org.springframework.stereotype.Service;

@Service
public class ReviewMapper {
    public ReviewResponse reviewToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .commonReview(review.getCommonReview())
                .status(review.getStatus() != null ? review.getStatus().name() : null)
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
