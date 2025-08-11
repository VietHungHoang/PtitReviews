package com.vhh.ptit_reviews.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ReviewResponse {
    private Long id;
    private String commonReview;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
