package com.vhh.ptit_reviews.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class SubjectResponse {
    private Long id;
    private String name;
    private String code;
    private int credits;
    private String semester;
}
