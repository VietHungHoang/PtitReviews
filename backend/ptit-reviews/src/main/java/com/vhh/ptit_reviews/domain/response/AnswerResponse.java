package com.vhh.ptit_reviews.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AnswerResponse {
    private Long id;
    private String content;
    private boolean isCorrect;
}
