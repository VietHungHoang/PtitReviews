package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.response.LecturerResponse;
import com.vhh.ptit_reviews.repository.LecturerRepository;
import com.vhh.ptit_reviews.service.LecturerService;
import com.vhh.ptit_reviews.service.mapper.LecturerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LecturerServiceImpl implements LecturerService {
    private final LecturerRepository lecturerRepository;
    private final LecturerMapper lecturerMapper;

    @Override
    public List<LecturerResponse> getAllLecturers() {
        List<Lecturer> lecturers = lecturerRepository.findAll();
        return lecturerMapper.lecturersToLecturerResponses(lecturers);
    }

    @Override
    public LecturerResponse getLecturerById(Long id) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
        return lecturerMapper.lecturerToLecturerResponse(lecturer);
    }

    @Override
    public LecturerResponse createLecturer(Lecturer lecturer) {
        Lecturer savedLecturer = lecturerRepository.save(lecturer);
        return lecturerMapper.lecturerToLecturerResponse(savedLecturer);
    }

    @Override
    public LecturerResponse updateLecturer(Long id, Lecturer lecturer) {
        Lecturer existingLecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
        
        existingLecturer.setName(lecturer.getName());
        existingLecturer.setDepartment(lecturer.getDepartment());
        existingLecturer.setSpecialization(lecturer.getSpecialization());
        existingLecturer.setLecturerCategory(lecturer.getLecturerCategory());
        
        Lecturer updatedLecturer = lecturerRepository.save(existingLecturer);
        return lecturerMapper.lecturerToLecturerResponse(updatedLecturer);
    }

    @Override
    public void deleteLecturer(Long id) {
        Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
        lecturerRepository.delete(lecturer);
    }
}
