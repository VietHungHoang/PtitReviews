package com.vhh.ptit_reviews.domain.response;

import com.vhh.ptit_reviews.domain.model.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserLoginResponse {
    private Long id;
    private String name;
    private String code;
    private UserRole role;
}
