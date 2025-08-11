package com.vhh.ptit_reviews.repository;

import com.vhh.ptit_reviews.domain.model.ReviewCategoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewCategoryItemRepository extends JpaRepository<ReviewCategoryItem, Long> {
}
