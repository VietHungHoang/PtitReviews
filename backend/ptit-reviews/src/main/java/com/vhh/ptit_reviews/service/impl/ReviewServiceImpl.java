package com.vhh.ptit_reviews.service.impl;

import com.vhh.ptit_reviews.domain.model.*;
import com.vhh.ptit_reviews.domain.request.CategoryRequest;
import com.vhh.ptit_reviews.domain.request.QuestionRequest;
import com.vhh.ptit_reviews.domain.request.ReviewRequest;
import com.vhh.ptit_reviews.domain.response.ReviewResponse;
import com.vhh.ptit_reviews.repository.*;
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
                .status(ReviewStatus.PENDING)
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
}
