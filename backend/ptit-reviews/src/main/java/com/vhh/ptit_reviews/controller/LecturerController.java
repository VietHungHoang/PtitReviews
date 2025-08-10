package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.LecturerResponse;
import com.vhh.ptit_reviews.service.LecturerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lecturers")
@RequiredArgsConstructor
public class LecturerController {
    private final LecturerService lecturerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LecturerResponse>>> getAllLecturers() {
        List<LecturerResponse> lecturerResponses = lecturerService.getAllLecturers();
        ApiResponse<List<LecturerResponse>> response = ApiResponse.<List<LecturerResponse>>builder()
                .status(200)
                .data(lecturerResponses)
                .message("Lecturers retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LecturerResponse>> getLecturerById(@PathVariable Long id) {
        LecturerResponse lecturerResponse = lecturerService.getLecturerById(id);
        ApiResponse<LecturerResponse> response = ApiResponse.<LecturerResponse>builder()
                .status(200)
                .data(lecturerResponse)
                .message("Lecturer retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LecturerResponse>> createLecturer(@RequestBody Lecturer lecturer) {
        LecturerResponse lecturerResponse = lecturerService.createLecturer(lecturer);
        ApiResponse<LecturerResponse> response = ApiResponse.<LecturerResponse>builder()
                .status(201)
                .data(lecturerResponse)
                .message("Lecturer created successfully")
                .build();
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LecturerResponse>> updateLecturer(@PathVariable Long id, @RequestBody Lecturer lecturer) {
        LecturerResponse lecturerResponse = lecturerService.updateLecturer(id, lecturer);
        ApiResponse<LecturerResponse> response = ApiResponse.<LecturerResponse>builder()
                .status(200)
                .data(lecturerResponse)
                .message("Lecturer updated successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteLecturer(@PathVariable Long id) {
        lecturerService.deleteLecturer(id);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(200)
                .data(null)
                .message("Lecturer deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
