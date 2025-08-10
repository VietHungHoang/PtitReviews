package com.vhh.ptit_reviews.domain.response;

import lombok.Builder;

@Builder
public record ApiResponse<T> (int status, T data, String message) {}