package com.vhh.ptit_reviews.service.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Question;
import com.vhh.ptit_reviews.domain.response.QuestionResponse;

@Service
public class QuestionMapper {
    public List<QuestionResponse> questionsToQuestionResponses(List<Question> questions) {
        return questions.stream()
                .map(question -> QuestionResponse.builder()
                    .id(question.getId())
                    .content(question.getContent())
                    .build())
                .toList();
    } 
}
