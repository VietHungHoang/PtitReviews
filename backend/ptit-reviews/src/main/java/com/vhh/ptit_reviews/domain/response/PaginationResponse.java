package com.vhh.ptit_reviews.domain.response;

public record PaginationResponse(
    int page,
    int limit,
    long total,
    int totalPages
) {
}
