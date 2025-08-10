package com.vhh.ptit_reviews.domain.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class CategoryInfoResponse {
    private Long categoryId;
    private List<QuestionResponse> questions;
    private List<LecturerResponse> lecturers;
    private List<SubjectResponse> subjects;
}
