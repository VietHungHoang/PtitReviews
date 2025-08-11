package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.model.*;
import com.vhh.ptit_reviews.domain.request.CategoryRequest;
import com.vhh.ptit_reviews.domain.request.QuestionRequest;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.AdminReviewResponse;
import com.vhh.ptit_reviews.domain.response.AdminReviewsResponse;
import com.vhh.ptit_reviews.domain.response.PaginationResponse;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.repository.*;
import com.vhh.ptit_reviews.domain.response.ReviewHistoryItemResponse;
import com.vhh.ptit_reviews.domain.response.CategoryReviewHistoryResponse;
import com.vhh.ptit_reviews.service.AIService;
import com.vhh.ptit_reviews.service.ReviewService;
import com.vhh.ptit_reviews.service.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final LecturerRepository lecturerRepository;
    private final SubjectRepository subjectRepository;
    private final ReviewMapper reviewMapper;
    private final AIService aiService;

    @Override
    @Transactional
    public ReviewResponse createReview(ReviewRequest reviewRequest, Long userId) {
        // Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Tạo Review entity
        Review review = Review.builder()
                .user(user)
                .commonReview(reviewRequest.getCommonReview())
                .build();

        // Lưu review trước để có ID
        review = reviewRepository.save(review);

        // Tạo ReviewCategory entities
        List<ReviewCategory> reviewCategories = new ArrayList<>();
        for (CategoryRequest categoryRequest : reviewRequest.getCategories()) {
            Category category = categoryRepository.findById(categoryRequest.getId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryRequest.getId()));

            ReviewCategory reviewCategory = ReviewCategory.builder()
                    .review(review)
                    .category(category)
                    .rate(categoryRequest.getRate())
                    .reviewText(categoryRequest.getReview())
                    .hasUseService(true)
                    .build();

            // Tạo ReviewQuestion entities cho category này
            List<ReviewQuestion> reviewQuestions = new ArrayList<>();
            if (categoryRequest.getQuestions() != null) {
                for (QuestionRequest questionRequest : categoryRequest.getQuestions()) {
                    Question question = questionRepository.findById(questionRequest.getId())
                            .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionRequest.getId()));
                    
                    Answer answer = answerRepository.findById(questionRequest.getAnswerId())
                            .orElseThrow(() -> new RuntimeException("Answer not found with id: " + questionRequest.getAnswerId()));

                    ReviewQuestion reviewQuestion = ReviewQuestion.builder()
                            .reviewCategory(reviewCategory)
                            .question(question)
                            .answer(answer)
                            .build();

                    reviewQuestions.add(reviewQuestion);
                }
            }
            reviewCategory.setReviewQuestions(reviewQuestions);

            // Tạo ReviewCategoryItem entities cho selectedItems
            List<ReviewCategoryItem> reviewCategoryItems = new ArrayList<>();
            if (categoryRequest.getSelectedItems() != null) {
                for (Integer itemId : categoryRequest.getSelectedItems()) {
                    ReviewCategoryItem item = ReviewCategoryItem.builder()
                            .reviewCategory(reviewCategory)
                            .build();

                    // Xác định xem item này là lecturer hay subject dựa vào category
                    if (category.getName().toLowerCase().contains("lecturer") || category.getName().toLowerCase().contains("giảng viên")) {
                        Lecturer lecturer = lecturerRepository.findById(itemId.longValue())
                                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + itemId));
                        item.setLecturer(lecturer);
                    } else {
                        Subject subject = subjectRepository.findById(itemId.longValue())
                                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + itemId));
                        item.setSubject(subject);
                    }

                    reviewCategoryItems.add(item);
                }
            }
            reviewCategory.setReviewCategoryItems(reviewCategoryItems);
            
            reviewCategories.add(reviewCategory);
        }

        review.setReviewCategories(reviewCategories);
        
        // Lưu lại review với tất cả relationships
        review = reviewRepository.save(review);

        return reviewMapper.reviewToReviewResponse(review);
    }

    public List<String> extractReviews(ReviewRequest reviewRequest) {
        List<String> reviews = new ArrayList<>();

        // 1. Lấy commonReview nếu có
        if (reviewRequest.getCommonReview() != null && !reviewRequest.getCommonReview().isBlank()) {
            reviews.add(reviewRequest.getCommonReview().trim());
        }

        // 2. Lấy review từ từng CategoryRequest
        if (reviewRequest.getCategories() != null) {
            for (CategoryRequest category : reviewRequest.getCategories()) {
                if (category.getReview() != null && !category.getReview().isBlank()) {
                    reviews.add(category.getReview().trim());
                }
            }
        }

        return reviews;
    }

    /**
     * Gọi AI service để check review bất thường
     */
    public List<ReviewErrorType> checkReviews(ReviewRequest reviewRequest) {
        List<String> reviews = extractReviews(reviewRequest);
        return aiService.checkReviews(reviews);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewHistoryItemResponse> getUserReviews(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<Review> reviews = reviewRepository.findAll().stream()
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .toList();

        List<ReviewHistoryItemResponse> responses = new ArrayList<>();
        for (Review review : reviews) {
            List<CategoryReviewHistoryResponse> categories = review.getReviewCategories() != null
                    ? review.getReviewCategories().stream()
                        .map(rc -> new CategoryReviewHistoryResponse(
                                rc.getCategory().getName(),
                                rc.getRate(),
                                rc.getReviewText()
                        ))
                        .toList()
                    : List.of();

            ReviewHistoryItemResponse item = ReviewHistoryItemResponse.builder()
                    .id(review.getId())
                    .categories(categories)
                    .generalFeedback(review.getCommonReview())
                    .createdAt(review.getCreatedAt())
                    .build();

            responses.add(item);
        }

        return responses;
    }

    @Override
    public AdminReviewsResponse getAllReviews(int page, int limit, String search) {
        List<Review> allReviews = reviewRepository.findAll();
        
        // Filter by search if provided
        if (search != null && !search.trim().isEmpty()) {
            String searchLower = search.toLowerCase();
            allReviews = allReviews.stream()
                    .filter(review -> 
                        review.getUser().getName().toLowerCase().contains(searchLower) ||
                        review.getUser().getCode().toLowerCase().contains(searchLower) ||
                        (review.getCommonReview() != null && review.getCommonReview().toLowerCase().contains(searchLower)) ||
                        review.getReviewCategories().stream().anyMatch(rc -> 
                            rc.getCategory().getName().toLowerCase().contains(searchLower) ||
                            (rc.getReviewText() != null && rc.getReviewText().toLowerCase().contains(searchLower))
                        )
                    )
                    .toList();
        }
        
        // Calculate pagination
        long total = allReviews.size();
        int totalPages = (int) Math.ceil((double) total / limit);
        int startIndex = page * limit;
        int endIndex = Math.min(startIndex + limit, allReviews.size());
        
        List<Review> paginatedReviews = allReviews.subList(startIndex, endIndex);
        
        // Map to DTOs
        List<AdminReviewResponse> reviewResponses = paginatedReviews.stream()
                .map(review -> {
                    List<String> categories = review.getReviewCategories() != null
                            ? review.getReviewCategories().stream()
                                .map(rc -> rc.getCategory().getName())
                                .toList()
                            : List.of();
                    
                    Double averageRating = review.getReviewCategories() != null && !review.getReviewCategories().isEmpty()
                            ? review.getReviewCategories().stream()
                                .mapToInt(ReviewCategory::getRate)
                                .average()
                                .orElse(0.0)
                            : 0.0;
                    
                    return new AdminReviewResponse(
                            review.getId(),
                            review.getUser().getName(),
                            review.getUser().getCode(),
                            categories,
                            averageRating,
                            review.getCommonReview(),
                            review.getCreatedAt()
                    );
                })
                .toList();
        
        PaginationResponse pagination = new PaginationResponse(page, limit, total, totalPages);
        return new AdminReviewsResponse(reviewResponses, pagination);
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        reviewRepository.delete(review);
    }
}
