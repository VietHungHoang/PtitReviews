package com.vhh.ptit_reviews.controller;

import com.vhh.ptit_reviews.domain.model.Subject;
import com.vhh.ptit_reviews.domain.response.ApiResponse;
import com.vhh.ptit_reviews.domain.response.SubjectResponse;
import com.vhh.ptit_reviews.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubjectController {
    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        List<SubjectResponse> subjectResponses = subjectService.getAllSubjects();
        ApiResponse<List<SubjectResponse>> response = ApiResponse.<List<SubjectResponse>>builder()
                .status(200)
                .data(subjectResponses)
                .message("Subjects retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(@PathVariable Long id) {
        SubjectResponse subjectResponse = subjectService.getSubjectById(id);
        ApiResponse<SubjectResponse> response = ApiResponse.<SubjectResponse>builder()
                .status(200)
                .data(subjectResponse)
                .message("Subject retrieved successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(@RequestBody Subject subject) {
        SubjectResponse subjectResponse = subjectService.createSubject(subject);
        ApiResponse<SubjectResponse> response = ApiResponse.<SubjectResponse>builder()
                .status(201)
                .data(subjectResponse)
                .message("Subject created successfully")
                .build();
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        SubjectResponse subjectResponse = subjectService.updateSubject(id, subject);
        ApiResponse<SubjectResponse> response = ApiResponse.<SubjectResponse>builder()
                .status(200)
                .data(subjectResponse)
                .message("Subject updated successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(200)
                .data(null)
                .message("Subject deleted successfully")
                .build();
        return ResponseEntity.ok(response);
    }
}
