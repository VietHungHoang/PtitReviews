package com.vhh.ptit_reviews.service;

import com.vhh.ptit_reviews.domain.model.Subject;
import com.vhh.ptit_reviews.domain.response.SubjectResponse;
import java.util.List;

public interface SubjectService {
    List<SubjectResponse> getAllSubjects();
    SubjectResponse getSubjectById(Long id);
    SubjectResponse createSubject(Subject subject);
    SubjectResponse updateSubject(Long id, Subject subject);
    void deleteSubject(Long id);
}
