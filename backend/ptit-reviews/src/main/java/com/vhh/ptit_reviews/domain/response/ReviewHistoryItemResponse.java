package com.vhh.ptit_reviews.domain.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewHistoryItemResponse {
    private Long id;
    private List<CategoryReviewHistoryResponse> categories;
    private String generalFeedback; // commonReview
    private LocalDateTime createdAt;
}
