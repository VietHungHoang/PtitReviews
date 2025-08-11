package com.vhh.ptit_reviews.domain.model;
public enum ReviewErrorType {
        NONE,        // Không lỗi
        TOO_SHORT,   // Quá ngắn
        BIASED,      // Thiên lệch
        NON_MEANINGFUL, // Không có nghĩa
        ONLY_SYMBOLS // Chỉ toàn ký tự đặc biệt
    }