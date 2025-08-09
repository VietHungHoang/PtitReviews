// package com.vhh.ptit_reviews.domain.model;

// import jakarta.persistence.*;
// import lombok.*;

// @Entity
// @Table(name = "review_category_subject")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class ReviewCategorySubject {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "review_category_id")
//     private ReviewCategory reviewCategory;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "subject_id")
//     private Subject subject;
// }
