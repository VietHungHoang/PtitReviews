package com.vhh.ptit_reviews.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.vhh.ptit_reviews.domain.model.ReviewErrorType;
import com.vhh.ptit_reviews.service.AIService;

@Service
public class GeminiService implements AIService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String call(String text) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", text)
                ))
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        return response.getBody();
    }

    public List<ReviewErrorType> checkReviews(List<String> reviews) {
        String prompt = """
            Bạn là hệ thống kiểm duyệt đánh giá.
            Bạn hãy đọc các đánh gía tôi gửi dưới đây, kết luận chung cho tất cả các đánh giá bằng cách trả về **một danh sách các loại**
            ngăn cách nhau bởi dấu chấm phẩy gồm duy nhất tên lỗi tương ứng theo các loại:

            NONE - Không lỗi
            TOO_SHORT - Quá ngắn (dưới 10 ký tự)
            BIASED - Thiên lệch hoặc cực đoan
            NON_MEANINGFUL - Không có nghĩa
            ONLY_SYMBOLS - Chỉ toàn ký tự đặc biệt hoặc số

            Chỉ trả về danh sách, ngăn cách nhau bởi dấu chấm phẩy, ví dụ: NON_MEANINGFUL;ONLY_SYMBOLS;BIASED

            Danh sách đánh giá:
            %s
            """.formatted(String.join("\n", reviews));

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        String outputText = extractTextFromGeminiResponse(response.getBody());

        // parse mảng enum từ JSON string
        return Arrays.asList(outputText.split(";"))
                .stream()
                .map(String::trim)
                .map(ReviewErrorType::valueOf)
                .toList();
    }

    private String extractTextFromGeminiResponse(Map<String, Object> body) {
        var contents = (List<Map<String, Object>>) body.get("candidates");
        var content = (Map<String, Object>) contents.get(0).get("content");
        var parts = (List<Map<String, Object>>) content.get("parts");
        return (String) parts.get(0).get("text");
    }
}

