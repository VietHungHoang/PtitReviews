package com.vhh.ptit_reviews.service.mapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.response.LecturerResponse;

@Service
public class LecturerMapper {
    public List<LecturerResponse> lecturersToLecturerResponses(List<Lecturer> lecturers) {
        return lecturers.stream()
                .map(this::lecturerToLecturerResponse)
                .toList();
    }
    
    public LecturerResponse lecturerToLecturerResponse(Lecturer lecturer) {
        return LecturerResponse.builder()
                .id(lecturer.getId())
                .name(lecturer.getName())
                .department(lecturer.getDepartment())
                .specialization(lecturer.getSpecialization())
                .build();
    }
}
