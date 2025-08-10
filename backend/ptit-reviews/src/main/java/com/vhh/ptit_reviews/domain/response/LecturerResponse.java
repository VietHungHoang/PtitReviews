package com.vhh.ptit_reviews.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class LecturerResponse {
    private Long id;
    private String name;
    private String department;
    private String specialization;
}
