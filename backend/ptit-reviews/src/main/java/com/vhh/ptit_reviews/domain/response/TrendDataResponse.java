package com.vhh.ptit_reviews.domain.response;

public record TrendDataResponse(
    String date,
    Long count,
    Double averageRating
) {
}
