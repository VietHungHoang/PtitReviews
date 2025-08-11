package com.vhh.ptit_reviews.domain.response;

import java.util.List;

public record AdminReviewsResponse(
    List<AdminReviewResponse> reviews,
    PaginationResponse pagination
) {
}
