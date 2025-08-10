package com.vhh.ptit_reviews.service;

import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.response.LecturerResponse;

import java.util.List;

public interface LecturerService {
    List<LecturerResponse> getAllLecturers();
    LecturerResponse getLecturerById(Long id);
    LecturerResponse createLecturer(Lecturer lecturer);
    LecturerResponse updateLecturer(Long id, Lecturer lecturer);
    void deleteLecturer(Long id);
}
