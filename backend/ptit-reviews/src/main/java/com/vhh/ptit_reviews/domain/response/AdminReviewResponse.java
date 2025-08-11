package com.vhh.ptit_reviews.domain.response;

import java.time.LocalDateTime;
import java.util.List;

public record AdminReviewResponse(
    Long id,
    String userName,
    String userCode,
    List<String> categories,
    Double averageRating,
    String commonReview,
    LocalDateTime createdAt
) {
}
