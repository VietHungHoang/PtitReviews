package com.vhh.ptit_reviews.domain.response;

import java.time.LocalDateTime;
import java.util.List;

public record RecentReviewResponse(
    Long id,
    String userName,
    String categoryName,
    Long categoryId,
    Integer rating,
    String preview,
    LocalDateTime createdAt,
    List<String> lecturerNames,
    List<String> subjectNames
) {}
