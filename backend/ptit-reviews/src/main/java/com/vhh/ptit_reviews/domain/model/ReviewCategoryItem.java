package com.vhh.ptit_reviews.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_category_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewCategoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_category_id")
    private ReviewCategory reviewCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecturer_id")
    private Lecturer lecturer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;
}
