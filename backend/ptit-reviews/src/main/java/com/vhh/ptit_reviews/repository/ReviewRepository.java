package com.vhh.ptit_reviews.repository;

import com.vhh.ptit_reviews.domain.model.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    @Query("SELECT c.name, AVG(rc.rate), COUNT(rc) " +
           "FROM Category c " +
           "LEFT JOIN c.reviewCategories rc " +
           "GROUP BY c.name")
    List<Object[]> findAverageRatingByCategory();
    
    @Query("SELECT c.name, COUNT(rc) " +
           "FROM Category c " +
           "LEFT JOIN c.reviewCategories rc " +
           "GROUP BY c.name")
    List<Object[]> countReviewsByCategory();
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.createdAt BETWEEN :startDate AND :endDate")
    Long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(rc.rate) " +
           "FROM ReviewCategory rc " +
           "JOIN rc.review r " +
           "WHERE r.createdAt BETWEEN :startDate AND :endDate")
    Double findAverageRatingBetween(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT rc.review.id, rc.review.user.name, rc.category.name, rc.category.id, rc.rate, rc.reviewText, rc.review.createdAt " +
           "FROM ReviewCategory rc " +
           "ORDER BY rc.review.createdAt DESC")
    List<Object[]> findRecentReviews(Pageable pageable);
    
    @Query("SELECT rci.reviewCategory.review.id, l.name " +
           "FROM ReviewCategoryItem rci " +
           "JOIN rci.lecturer l " +
           "WHERE rci.reviewCategory.review.id IN :reviewIds AND rci.reviewCategory.category.id = 1")
    List<Object[]> findLecturerNamesByReviewIds(@Param("reviewIds") List<Long> reviewIds);
    
    @Query("SELECT rci.reviewCategory.review.id, s.name " +
           "FROM ReviewCategoryItem rci " +
           "JOIN rci.subject s " +
           "WHERE rci.reviewCategory.review.id IN :reviewIds AND rci.reviewCategory.category.id = 2")
    List<Object[]> findSubjectNamesByReviewIds(@Param("reviewIds") List<Long> reviewIds);
    
    @Query("SELECT rc.rate, COUNT(rc) " +
           "FROM ReviewCategory rc " +
           "GROUP BY rc.rate " +
           "ORDER BY rc.rate")
    List<Object[]> findRatingDistribution();
}
