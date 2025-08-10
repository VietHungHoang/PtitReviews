package com.vhh.ptit_reviews.repository;

import com.vhh.ptit_reviews.domain.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
}
