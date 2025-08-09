package com.vhh.ptit_reviews.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vhh.ptit_reviews.domain.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>  {

} 