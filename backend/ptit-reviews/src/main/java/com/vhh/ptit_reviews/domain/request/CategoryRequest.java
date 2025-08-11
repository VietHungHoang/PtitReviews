package com.vhh.ptit_reviews.domain.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CategoryRequest {
    private Long id;
    private List<QuestionRequest> questions;
    private int rate;
    private String review;
    private List<Integer> selectedItems;
}
