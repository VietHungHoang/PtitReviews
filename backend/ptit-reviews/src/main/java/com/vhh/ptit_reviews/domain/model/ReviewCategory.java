// package com.vhh.ptit_reviews.domain.model;

// import jakarta.persistence.*;
// import lombok.*;
// import java.util.List;

// @Entity
// @Table(name = "review_categories")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class ReviewCategory {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "review_id")
//     private Review review;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "category_id")
//     private Category category;

//     @OneToMany(mappedBy = "reviewCategory", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<ReviewCategoryLecturer> reviewCategoryLecturers;

//     @OneToMany(mappedBy = "reviewCategory", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<ReviewCategorySubject> reviewCategorySubjects;

//     private boolean hasUseService;
// }
