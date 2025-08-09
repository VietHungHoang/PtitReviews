package com.vhh.ptit_reviews.domain.response;

public record ApiResponse<T> (int status, T data, String message) {}