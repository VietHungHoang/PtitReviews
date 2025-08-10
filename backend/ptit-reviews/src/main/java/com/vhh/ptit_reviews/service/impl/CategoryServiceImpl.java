
package com.vhh.ptit_reviews.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.vhh.ptit_reviews.domain.model.Answer;
import com.vhh.ptit_reviews.domain.model.Category;
import com.vhh.ptit_reviews.domain.model.Lecturer;
import com.vhh.ptit_reviews.domain.model.Question;
import com.vhh.ptit_reviews.domain.model.Subject;
import com.vhh.ptit_reviews.domain.response.AnswerResponse;
import com.vhh.ptit_reviews.domain.response.CategoryInfoResponse;
import com.vhh.ptit_reviews.domain.response.CategoryResponse;
import com.vhh.ptit_reviews.domain.response.LecturerResponse;
import com.vhh.ptit_reviews.domain.response.QuestionResponse;
import com.vhh.ptit_reviews.domain.response.SubjectResponse;
import com.vhh.ptit_reviews.repository.CategoryRepository;
import com.vhh.ptit_reviews.service.CategoryService;
import com.vhh.ptit_reviews.service.mapper.AnswerMapper;
import com.vhh.ptit_reviews.service.mapper.CategoryMapper;
import com.vhh.ptit_reviews.service.mapper.QuestionMapper;
import com.vhh.ptit_reviews.service.mapper.SubjectMapper;
import com.vhh.ptit_reviews.service.mapper.LecturerMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;
    private final SubjectMapper subjectMapper;
    private final LecturerMapper lecturerMapper;

    public List<CategoryResponse> getAllCategoryResponses() {
        List<Category> categories = categoryRepository.findAll(); 
        List<CategoryResponse> categoryResponses = categoryMapper.categoriesToCategoryRequests(categories);
        return categoryResponses;
    }

    public List<CategoryInfoResponse> getCategoryInfoByIds(List<Long> categoryIds) {
        List<CategoryInfoResponse> categoryInfoResponses = new ArrayList<>();
        for(Long x : categoryIds) {
            List<Question> questions = categoryRepository.findQuestionsByCategoryId(x);
            List<QuestionResponse> questionResponses = questionMapper.questionsToQuestionResponses(questions);
            for(QuestionResponse question : questionResponses) {
                List<Answer> answers = categoryRepository.findAnswersByQuestionId(question.getId());
                List<AnswerResponse> answerResponses = answerMapper.answersToAnswerResponses(answers);
                question.setAnswers(answerResponses);
            }

            CategoryInfoResponse categoryInfoResponse = CategoryInfoResponse.builder()
                .categoryId(x)
                .questions(questionResponses)
                .build();

            if(x == 1) {
                List<Subject> subjects = categoryRepository.findAllSubjects();
                List<SubjectResponse> subjectResponses = subjectMapper.subjectsToSubjectResponses(subjects);
                categoryInfoResponse.setSubjects(subjectResponses);
            } else if(x == 2) {
                List<Lecturer> lecturers = categoryRepository.findAllLecturers();
                List<LecturerResponse> lecturerResponses = lecturerMapper.lecturersToLecturerResponses(lecturers);
                categoryInfoResponse.setLecturers(lecturerResponses);
            }
            categoryInfoResponses.add(categoryInfoResponse);
        }
        return categoryInfoResponses;
    }
}