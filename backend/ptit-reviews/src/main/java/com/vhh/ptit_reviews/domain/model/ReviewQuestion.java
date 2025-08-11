package com.vhh.ptit_reviews.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_category_id")
    private ReviewCategory reviewCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id")
    private Answer answer;
}
