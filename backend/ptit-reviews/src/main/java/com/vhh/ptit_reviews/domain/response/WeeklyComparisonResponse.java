package com.vhh.ptit_reviews.domain.response;

public record WeeklyComparisonResponse(
    Long thisWeekReviews,           // Số đánh giá tuần này
    Long lastWeekReviews,           // Số đánh giá tuần trước
    Double thisWeekAvgRating,       // Điểm TB tuần này
    Double lastWeekAvgRating,       // Điểm TB tuần trước
    String reviewsChangePercent,    // % thay đổi số đánh giá (ví dụ: "+12%", "-5%")
    String ratingChange,            // Thay đổi điểm TB (ví dụ: "+0.3", "-0.1")
    String reviewsChangeType,       // "increase", "decrease", "no_change"
    String ratingChangeType         // "increase", "decrease", "no_change"
) {
}
