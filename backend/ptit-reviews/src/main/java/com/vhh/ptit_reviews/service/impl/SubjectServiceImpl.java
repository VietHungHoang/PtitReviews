package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.model.Subject;
import com.vhh.ptit_reviews.domain.response.SubjectResponse;
import com.vhh.ptit_reviews.repository.SubjectRepository;
import com.vhh.ptit_reviews.service.SubjectService;
import com.vhh.ptit_reviews.service.mapper.SubjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {
    private final SubjectRepository subjectRepository;
    private final SubjectMapper subjectMapper;

    @Override
    public List<SubjectResponse> getAllSubjects() {
        List<Subject> subjects = subjectRepository.findAll();
        return subjectMapper.subjectsToSubjectResponses(subjects);
    }

    @Override
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        return subjectMapper.subjectToSubjectResponse(subject);
    }

    @Override
    public SubjectResponse createSubject(Subject subject) {
        Subject savedSubject = subjectRepository.save(subject);
        return subjectMapper.subjectToSubjectResponse(savedSubject);
    }

    @Override
    public SubjectResponse updateSubject(Long id, Subject subject) {
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        
        existingSubject.setName(subject.getName());
        existingSubject.setCode(subject.getCode());
        existingSubject.setCredits(subject.getCredits());
        existingSubject.setSemester(subject.getSemester());
        
        Subject updatedSubject = subjectRepository.save(existingSubject);
        return subjectMapper.subjectToSubjectResponse(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));
        subjectRepository.delete(subject);
    }
}
