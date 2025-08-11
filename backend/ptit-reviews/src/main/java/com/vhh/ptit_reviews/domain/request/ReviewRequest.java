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
public class ReviewRequest {
    private String commonReview;
    private List<CategoryRequest> categories;
}
