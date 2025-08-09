// package com.vhh.ptit_reviews.domain.model;

// import jakarta.persistence.*;
// import lombok.*;

// import java.time.LocalDateTime;
// import java.util.List;

// @Entity
// @Table(name = "reviews")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class Review {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "user_id")
//     private User user;

//     @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
//     private List<ReviewCategory> reviewCategories;

//     private int rate;
//     private String freeComment;
//     private LocalDateTime createdAt;

//     @Enumerated(EnumType.STRING)
//     private ReviewStatus status; 

// }
