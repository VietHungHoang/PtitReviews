package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.response.DashboardStatsResponse;
import com.vhh.ptit_reviews.domain.response.RecentReviewResponse;
import com.vhh.ptit_reviews.domain.response.TrendDataResponse;
import com.vhh.ptit_reviews.domain.response.WeeklyComparisonResponse;
import com.vhh.ptit_reviews.repository.ReviewRepository;
import com.vhh.ptit_reviews.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
        
        // Phân bố điểm đánh giá
        Map<Integer, Long> ratingDistribution = getRatingDistribution();
        
        // So sánh tuần này với tuần trước
        WeeklyComparisonResponse weeklyComparison = getWeeklyComparison();
        
        return new DashboardStatsResponse(
            totalReviews,
            approvedReviews,
            rejectedReviews,
            pendingReviews,
            averageRating,
            reviewsByCategory,
            trendData,
            recentReviews,
            ratingDistribution,
            weeklyComparison
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
        
        // Lấy dữ liệu 7 ngày gần đây (1 tuần)
        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = LocalDateTime.now().minusDays(i);
            
            // Format ngày theo định dạng ngắn (T2, T3, T4, ...)
            String dayOfWeekLabel = getDayOfWeekLabel(date.getDayOfWeek().getValue());
            
            LocalDateTime startOfDay = date.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = date.toLocalDate().atTime(23, 59, 59);
            
            // Safe casting for count
            Long countResult = reviewRepository.countByCreatedAtBetween(startOfDay, endOfDay);
            Long count = countResult != null ? countResult : 0L;
            
            // Safe casting for average rating
            Double avgRatingResult = reviewRepository.findAverageRatingBetween(startOfDay, endOfDay);
            Double avgRating = avgRatingResult != null ? avgRatingResult : 0.0;
            
            trendData.add(new TrendDataResponse(dayOfWeekLabel, count, avgRating));
        }
        
        return trendData;
    }
    
    private String getDayOfWeekLabel(int dayOfWeek) {
        return switch (dayOfWeek) {
            case 1 -> "T2"; // Monday
            case 2 -> "T3"; // Tuesday
            case 3 -> "T4"; // Wednesday
            case 4 -> "T5"; // Thursday
            case 5 -> "T6"; // Friday
            case 6 -> "T7"; // Saturday
            case 7 -> "CN"; // Sunday
            default -> "T" + dayOfWeek;
        };
    }

    private List<RecentReviewResponse> getRecentReviews() {
        Pageable pageable = PageRequest.of(0, 4);
        List<Object[]> results = reviewRepository.findRecentReviews(pageable);
        
        if (results.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Lấy danh sách review IDs
        List<Long> reviewIds = results.stream()
            .map(result -> (Long) result[0])
            .collect(Collectors.toList());
        
        // Lấy lecturer names (chỉ cho category id = 1)
        List<Object[]> lecturerResults = reviewRepository.findLecturerNamesByReviewIds(reviewIds);
        Map<Long, List<String>> lecturerMap = new HashMap<>();
        for (Object[] lecturerResult : lecturerResults) {
            Long reviewId = (Long) lecturerResult[0];
            String lecturerName = (String) lecturerResult[1];
            lecturerMap.computeIfAbsent(reviewId, k -> new ArrayList<>()).add(lecturerName);
        }
        
        // Lấy subject names (chỉ cho category id = 2)
        List<Object[]> subjectResults = reviewRepository.findSubjectNamesByReviewIds(reviewIds);
        Map<Long, List<String>> subjectMap = new HashMap<>();
        for (Object[] subjectResult : subjectResults) {
            Long reviewId = (Long) subjectResult[0];
            String subjectName = (String) subjectResult[1];
            subjectMap.computeIfAbsent(reviewId, k -> new ArrayList<>()).add(subjectName);
        }
        
        List<RecentReviewResponse> recentReviews = new ArrayList<>();
        
        for (Object[] result : results) {
            Long id = (Long) result[0];
            String userName = (String) result[1];
            String categoryName = (String) result[2];
            Long categoryId = (Long) result[3];
            
            // Safe casting for rating - handle both Integer and Double
            Integer rating;
            Object ratingObj = result[4];
            if (ratingObj instanceof Integer) {
                rating = (Integer) ratingObj;
            } else if (ratingObj instanceof Double) {
                rating = ((Double) ratingObj).intValue();
            } else {
                rating = 0; // default value
            }
            
            String reviewText = (String) result[5];
            LocalDateTime createdAt = (LocalDateTime) result[6];
            
            // Lấy lecturer và subject names từ maps tùy theo categoryId
            List<String> lecturerNames = new ArrayList<>();
            List<String> subjectNames = new ArrayList<>();
            
            if (categoryId == 1L) { // Category giảng viên
                lecturerNames = lecturerMap.getOrDefault(id, new ArrayList<>());
            } else if (categoryId == 2L) { // Category môn học
                subjectNames = subjectMap.getOrDefault(id, new ArrayList<>());
            }
            
            // Tạo preview từ reviewText (50 ký tự đầu)
            String preview = reviewText != null && reviewText.length() > 50 
                ? reviewText.substring(0, 50) + "..." 
                : (reviewText != null ? reviewText : "Không có nhận xét");
            
            recentReviews.add(new RecentReviewResponse(
                id, userName, categoryName, categoryId, rating, preview, createdAt, lecturerNames, subjectNames
            ));
        }
        
        return recentReviews;
    }
    
    private Map<Integer, Long> getRatingDistribution() {
        List<Object[]> results = reviewRepository.findRatingDistribution();
        Map<Integer, Long> distribution = new HashMap<>();
        
        // Khởi tạo tất cả các rating từ 1-5 với giá trị 0
        for (int i = 1; i <= 5; i++) {
            distribution.put(i, 0L);
        }
        
        // Cập nhật với dữ liệu thực tế
        for (Object[] result : results) {
            Integer rating = (Integer) result[0];
            
            // Safe casting for count
            Long count;
            Object countObj = result[1];
            if (countObj instanceof Integer) {
                count = ((Integer) countObj).longValue();
            } else if (countObj instanceof Long) {
                count = (Long) countObj;
            } else {
                count = 0L;
            }
            
            if (rating >= 1 && rating <= 5) {
                distribution.put(rating, count);
            }
        }
        
        return distribution;
    }
    
    private WeeklyComparisonResponse getWeeklyComparison() {
        LocalDateTime now = LocalDateTime.now();
        
        // Tìm đầu tuần này (thứ 2)
        LocalDateTime startOfThisWeek = now.with(DayOfWeek.MONDAY).toLocalDate().atStartOfDay();
        LocalDateTime endOfThisWeek = startOfThisWeek.plusDays(6).toLocalDate().atTime(23, 59, 59);
        
        // Tìm đầu tuần trước (thứ 2 tuần trước)
        LocalDateTime startOfLastWeek = startOfThisWeek.minusWeeks(1);
        LocalDateTime endOfLastWeek = startOfLastWeek.plusDays(6).toLocalDate().atTime(23, 59, 59);
        
        // Đếm số đánh giá tuần này
        Long thisWeekReviews = reviewRepository.countByCreatedAtBetween(startOfThisWeek, endOfThisWeek);
        thisWeekReviews = thisWeekReviews != null ? thisWeekReviews : 0L;
        
        // Đếm số đánh giá tuần trước
        Long lastWeekReviews = reviewRepository.countByCreatedAtBetween(startOfLastWeek, endOfLastWeek);
        lastWeekReviews = lastWeekReviews != null ? lastWeekReviews : 0L;
        
        // Tính điểm trung bình tuần này
        Double thisWeekAvgRating = reviewRepository.findAverageRatingBetween(startOfThisWeek, endOfThisWeek);
        thisWeekAvgRating = thisWeekAvgRating != null ? thisWeekAvgRating : 0.0;
        
        // Tính điểm trung bình tuần trước
        Double lastWeekAvgRating = reviewRepository.findAverageRatingBetween(startOfLastWeek, endOfLastWeek);
        lastWeekAvgRating = lastWeekAvgRating != null ? lastWeekAvgRating : 0.0;
        
        // Tính % thay đổi số đánh giá
        String reviewsChangePercent;
        String reviewsChangeType;
        if (lastWeekReviews == 0) {
            reviewsChangePercent = thisWeekReviews > 0 ? "+100%" : "0%";
            reviewsChangeType = thisWeekReviews > 0 ? "increase" : "no_change";
        } else {
            double percentChange = ((double) (thisWeekReviews - lastWeekReviews) / lastWeekReviews) * 100;
            if (percentChange > 0) {
                reviewsChangePercent = String.format("+%.0f%%", percentChange);
                reviewsChangeType = "increase";
            } else if (percentChange < 0) {
                reviewsChangePercent = String.format("%.0f%%", percentChange);
                reviewsChangeType = "decrease";
            } else {
                reviewsChangePercent = "0%";
                reviewsChangeType = "no_change";
            }
        }
        
        // Tính thay đổi điểm trung bình
        String ratingChange;
        String ratingChangeType;
        double ratingDiff = thisWeekAvgRating - lastWeekAvgRating;
        if (ratingDiff > 0) {
            ratingChange = String.format("+%.1f", ratingDiff);
            ratingChangeType = "increase";
        } else if (ratingDiff < 0) {
            ratingChange = String.format("%.1f", ratingDiff);
            ratingChangeType = "decrease";
        } else {
            ratingChange = "0.0";
            ratingChangeType = "no_change";
        }
        
        return new WeeklyComparisonResponse(
            thisWeekReviews,
            lastWeekReviews,
            thisWeekAvgRating,
            lastWeekAvgRating,
            reviewsChangePercent,
            ratingChange,
            reviewsChangeType,
            ratingChangeType
        );
    }
}
