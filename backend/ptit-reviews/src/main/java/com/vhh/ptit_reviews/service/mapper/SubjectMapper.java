package com.vhh.ptit_reviews.service.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Subject;
import com.vhh.ptit_reviews.domain.response.SubjectResponse;

@Service
public class SubjectMapper {
    public List<SubjectResponse> subjectsToSubjectResponses(List<Subject> subjects) {
        return subjects.stream()
                .map(this::subjectToSubjectResponse)
                .toList();
    }
    
    public SubjectResponse subjectToSubjectResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .name(subject.getName())
                .code(subject.getCode())
                .credits(subject.getCredits())
                .semester(subject.getSemester())
                .build();
    }
}
