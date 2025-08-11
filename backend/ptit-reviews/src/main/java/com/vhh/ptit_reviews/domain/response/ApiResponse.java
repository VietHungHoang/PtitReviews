package com.vhh.ptit_reviews.domain.response;

import lombok.Builder;

@Builder
public record ApiResponse<T> (int status, T data, String message) {
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .data(data)
                .message(message)
                .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status(400)
                .data(null)
                .message(message)
                .build();
    }
}