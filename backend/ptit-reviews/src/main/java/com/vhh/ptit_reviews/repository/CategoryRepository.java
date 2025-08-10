package com.vhh.ptit_reviews.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vhh.ptit_reviews.domain.model.Answer;
import com.vhh.ptit_reviews.domain.model.Category;
import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.model.Question;
import com.vhh.ptit_reviews.domain.model.Subject;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>  {
    @Query("""
    SELECT q
    FROM Question q
    WHERE q.category.id = :categoryId
    """)
    List<Question> findQuestionsByCategoryId(@Param("categoryId") Long categoryId);

    @Query("""
    SELECT a
    FROM Answer a
    Where a.question.id = :questionId
    """)
    List<Answer> findAnswersByQuestionId(@Param("questionId") Long categoryId);

    @Query("SELECT l FROM Lecturer l")
    List<Lecturer> findAllLecturers();

    @Query("SELECT s FROM Subject s")
    List<Subject> findAllSubjects();

} 