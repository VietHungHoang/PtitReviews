package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.response.DashboardStatsResponse;
import com.vhh.ptit_reviews.domain.response.RecentReviewResponse;
import com.vhh.ptit_reviews.domain.response.TrendDataResponse;
import com.vhh.ptit_reviews.repository.ReviewRepository;
import com.vhh.ptit_reviews.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final ReviewRepository reviewRepository;

    @Override
    public DashboardStatsResponse getDashboardStats() {
        
        // Tổng số đánh giá
        Long totalReviews = reviewRepository.count();
        
        // Do đã bỏ status, giả định tất cả reviews đều được approved
        Long approvedReviews = totalReviews;
        Long rejectedReviews = 0L;
        Long pendingReviews = 0L;
        
        // Điểm trung bình
        Double averageRating = calculateAverageRating();
        
        // Thống kê theo danh mục
        Map<String, Long> reviewsByCategory = getReviewsByCategory();
        
        // Dữ liệu xu hướng (7 ngày gần đây)
        List<TrendDataResponse> trendData = getTrendData();
        
        // Đánh giá gần đây (5 đánh giá mới nhất)
        List<RecentReviewResponse> recentReviews = getRecentReviews();
        
        return new DashboardStatsResponse(
            totalReviews,
            approvedReviews,
            rejectedReviews,
            pendingReviews,
            averageRating,
            reviewsByCategory,
            trendData,
            recentReviews
        );
    }

    @Override
    public Object getReviewStats(String startDate, String endDate, String groupBy) {
        // Implement later if needed
        return Map.of("message", "Stats by date range not implemented yet");
    }

    private Double calculateAverageRating() {
        List<Object[]> results = reviewRepository.findAverageRatingByCategory();
        if (results.isEmpty()) {
            return 0.0;
        }
        
        double totalSum = 0.0;
        int totalCount = 0;
        
        for (Object[] result : results) {
            // Safe casting for average rating
            Double avgRating;
            Object avgRatingObj = result[1];
            if (avgRatingObj instanceof Integer) {
                avgRating = ((Integer) avgRatingObj).doubleValue();
            } else if (avgRatingObj instanceof Double) {
                avgRating = (Double) avgRatingObj;
            } else {
                avgRating = null;
            }
            
            // Safe casting for count
            Long count;
            Object countObj = result[2];
            if (countObj instanceof Integer) {
                count = ((Integer) countObj).longValue();
            } else if (countObj instanceof Long) {
                count = (Long) countObj;
            } else {
                count = null;
            }
            
            if (avgRating != null && count != null) {
                totalSum += avgRating * count;
                totalCount += count;
            }
        }
        
        return totalCount > 0 ? totalSum / totalCount : 0.0;
    }

    private Map<String, Long> getReviewsByCategory() {
        List<Object[]> results = reviewRepository.countReviewsByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        
        for (Object[] result : results) {
            String categoryName = (String) result[0];
            
            // Safe casting for count - handle both Integer and Long
            Long count;
            Object countObj = result[1];
            if (countObj instanceof Integer) {
                count = ((Integer) countObj).longValue();
            } else if (countObj instanceof Long) {
                count = (Long) countObj;
            } else {
                count = 0L; // default value
            }
            
            categoryMap.put(categoryName, count);
        }
        
        // Sort by count in descending order
        return categoryMap.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(LinkedHashMap::new, 
                        (map, entry) -> map.put(entry.getKey(), entry.getValue()),
                        LinkedHashMap::putAll);
    }

    private List<TrendDataResponse> getTrendData() {
        List<TrendDataResponse> trendData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        // Lấy dữ liệu 7 ngày gần đây
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            String dateStr = date.format(formatter);
            
            LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
            
            // Safe casting for count
            Long countResult = reviewRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            Long count = countResult != null ? countResult : 0L;
            
            // Safe casting for average rating
            Double avgRatingResult = reviewRepository.findAverageRatingBetween(startOfDay, endOfDay);
            Double avgRating = avgRatingResult != null ? avgRatingResult : 0.0;
            
            trendData.add(new TrendDataResponse(dateStr, count, avgRating));
        }
        
        return trendData;
    }

    private List<RecentReviewResponse> getRecentReviews() {
        Pageable pageable = PageRequest.of(0, 4);
        List<Object[]> results = reviewRepository.findRecentReviews(pageable);
        List<RecentReviewResponse> recentReviews = new ArrayList<>();
        
        for (Object[] result : results) {
            Long id = (Long) result[0];
            String userName = (String) result[1];
            String categoryName = (String) result[2];
            
            // Safe casting for rating - handle both Integer and Double
            Double rating;
            Object ratingObj = result[3];
            if (ratingObj instanceof Integer) {
                rating = ((Integer) ratingObj).doubleValue();
            } else if (ratingObj instanceof Double) {
                rating = (Double) ratingObj;
            } else {
                rating = 0.0; // default value
            }
            
            String reviewText = (String) result[4];
            LocalDateTime createdAt = (LocalDateTime) result[5];
            
            // Tạo preview từ reviewText (50 ký tự đầu)
            String preview = reviewText != null && reviewText.length() > 50 
                ? reviewText.substring(0, 50) + "..." 
                : (reviewText != null ? reviewText : "Không có nhận xét");
            
            recentReviews.add(new RecentReviewResponse(
                id, userName, categoryName, rating, preview, createdAt
            ));
        }
        
        return recentReviews;
    }
}
