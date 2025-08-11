package com.vhh.ptit_reviews.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.ReviewErrorType;

@Service
public interface AIService {
    String call(String text);
    List<ReviewErrorType> checkReviews(List<String> reviews);
}
