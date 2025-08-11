package com.vhh.ptit_reviews.service.mapper;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.User;
import com.vhh.ptit_reviews.domain.response.UserLoginResponse;

@Service
public class UserMapper {
        public UserLoginResponse userToUserLoginResponse(User user) {
        return UserLoginResponse.builder()
            .id(user.getId())
            .name(user.getName())
            .code(user.getCode())
            .role(user.getRole())
            .build();
    } 
}
