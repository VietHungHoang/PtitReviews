package com.vhh.ptit_reviews.domain.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserReviewsResponse {
    private List<ReviewHistoryItemResponse> reviews;
}
