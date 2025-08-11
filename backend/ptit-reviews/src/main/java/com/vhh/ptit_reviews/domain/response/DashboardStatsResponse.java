package com.vhh.ptit_reviews.domain.response;

import java.util.Map;

public record DashboardStatsResponse(
    Long totalReviews,
    Long approvedReviews,
    Long rejectedReviews,
    Long pendingReviews,
    Double averageRating,
    Map<String, Long> reviewsByCategory,
    java.util.List<TrendDataResponse> trendData,
    java.util.List<RecentReviewResponse> recentReviews
) {
}
