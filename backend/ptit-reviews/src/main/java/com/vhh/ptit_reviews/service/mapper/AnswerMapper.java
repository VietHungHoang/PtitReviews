package com.vhh.ptit_reviews.service.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Answer;
import com.vhh.ptit_reviews.domain.response.AnswerResponse;

@Service
public class AnswerMapper {
        public List<AnswerResponse> answersToAnswerResponses(List<Answer> answers) {
        return answers.stream()
                .map(answer -> AnswerResponse.builder()
                    .id(answer.getId())
                    .content(answer.getContent())
                    .isCorrect(answer.isCorrect())
                    .build())
                .toList();
    } 
}
