package com.vhh.ptit_reviews.service;

import com.vhh.ptit_reviews.domain.response.DashboardStatsResponse;

public interface AnalyticsService {
    
    DashboardStatsResponse getDashboardStats();
    
    Object getReviewStats(String startDate, String endDate, String groupBy);
}
