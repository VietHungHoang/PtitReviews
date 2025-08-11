package com.vhh.ptit_reviews.domain.response;

import java.time.LocalDateTime;

public record RecentReviewResponse(
    Long id,
    String userName,
    String categoryName,
    Double rating,
    String preview,
    LocalDateTime createdAt
) {
}
