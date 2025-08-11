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
    
    @Query("SELECT r.id, u.name, c.name, rc.rate, rc.reviewText, r.createdAt " +
           "FROM ReviewCategory rc " +
           "JOIN rc.review r " +
           "JOIN r.user u " +
           "JOIN rc.category c " +
           "ORDER BY r.createdAt DESC")
    List<Object[]> findRecentReviews(Pageable pageable);
}
