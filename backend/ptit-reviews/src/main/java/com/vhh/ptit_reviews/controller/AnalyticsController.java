package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.DashboardStatsResponse;
import com.vhh.ptit_reviews.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard stats retrieved successfully"));
    }

    @GetMapping("/reviews/stats")
    public ResponseEntity<ApiResponse<Object>> getReviewStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "day") String groupBy) {
        
        Object stats = analyticsService.getReviewStats(startDate, endDate, groupBy);
        return ResponseEntity.ok(ApiResponse.success(stats, "Review stats retrieved successfully"));
    }
}
