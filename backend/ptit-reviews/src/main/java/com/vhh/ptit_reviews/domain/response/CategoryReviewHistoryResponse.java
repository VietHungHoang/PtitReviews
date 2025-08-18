package com.vhh.ptit_reviews.domain.response;

import java.util.List;

public record CategoryReviewHistoryResponse(
    String name, 
    int rate, 
    String comment,
    List<String> subjects,    // Danh sách môn học (null nếu không phải category môn học)
    List<String> lecturers,   // Danh sách giảng viên (null nếu không phải category giảng viên)
    List<QuestionAnswerResponse> questionAnswers  // Danh sách câu hỏi-câu trả lời
){}
