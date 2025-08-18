import random

def get_answer_range(question_id):
    """Trả về dải answer_id cho từng question_id"""
    if question_id == 1:
        return [1, 2]
    elif question_id == 2:
        return [3, 4, 5]
    elif question_id == 3:
        return [6, 7, 8]
    elif question_id == 4:
        return [9, 10, 11]
    elif question_id == 5:
        return [12, 13, 14]
    elif question_id == 6:
        return [15, 16]
    elif question_id == 7:
        return [17, 18, 19]
    elif question_id == 8:
        return [20, 21]
    elif question_id == 9:
        return [22, 23]
    elif question_id == 10:
        return [24, 25]
    elif question_id == 11:
        return [26, 27]
    elif question_id == 12:
        return [28, 29]

def get_category_questions(category_id):
    """Trả về 2 question_id cho mỗi category_id"""
    return [(category_id - 1) * 2 + 1, (category_id - 1) * 2 + 2]

def generate_review_text(category_id, rate):
    """Sinh review text phù hợp với rate"""
    category_names = {
        1: "giảng viên",
        2: "môn học", 
        3: "cơ sở vật chất",
        4: "thư viện",
        5: "hệ thống đăng ký học phần",
        6: "dịch vụ sinh viên"
    }
    
    if rate == 5:
        return f"Rất hài lòng với {category_names[category_id]}."
    elif rate == 4:
        return f"Khá hài lòng với {category_names[category_id]}."
    elif rate == 3:
        return f"{category_names[category_id].title()} tạm ổn."
    elif rate == 2:
        return f"{category_names[category_id].title()} cần cải thiện."
    else:
        return f"Không hài lòng với {category_names[category_id]}."

def generate_common_review():
    """Sinh common review ngẫu nhiên"""
    reviews = [
        "Đánh giá tổng quan tốt.",
        "Nhìn chung khá hài lòng.",
        "Có một số điều cần cải thiện.",
        "Tổng thể rất tốt.",
        "Cần nâng cao chất lượng dịch vụ.",
        "Rất hài lòng với trải nghiệm.",
        "Mong muốn được cải thiện hơn nữa."
    ]
    return random.choice(reviews)

def generate_reviews_sql(start_user_id=2, end_user_id=558, reviews_per_user=3):
    """Sinh SQL cho reviews"""
    sql_statements = []
    
    # Counters cho auto-increment IDs
    review_id = 1
    review_category_id = 1
    review_category_item_id = 1
    review_question_id = 1
    
    sql_statements.append("-- ========================================")
    sql_statements.append("-- GENERATED REVIEWS DATA")
    sql_statements.append("-- ========================================")
    sql_statements.append("")
    
    for user_id in range(start_user_id, end_user_id + 1):
        for review_num in range(reviews_per_user):
            # Tạo review
            common_review = generate_common_review()
            sql_statements.append(f"-- Review {review_id} for User {user_id}")
            sql_statements.append(f"INSERT INTO reviews (id, user_id, common_review, created_at, updated_at)")
            sql_statements.append(f"VALUES ({review_id}, {user_id}, '{common_review}', NOW(), NOW());")
            sql_statements.append("")
            
            # Chọn ngẫu nhiên từ 1-6 categories
            num_categories = random.randint(1, 6)
            selected_categories = random.sample(range(1, 7), num_categories)
            
            current_review_category_ids = []
            
            # Tạo review_categories
            for category_id in selected_categories:
                rate = random.randint(1, 5)
                review_text = generate_review_text(category_id, rate)
                
                sql_statements.append(f"INSERT INTO review_categories (id, review_id, category_id, rate, review_text, has_use_service)")
                sql_statements.append(f"VALUES ({review_category_id}, {review_id}, {category_id}, {rate}, '{review_text}', true);")
                
                current_review_category_ids.append((review_category_id, category_id))
                review_category_id += 1
            
            sql_statements.append("")
            
            # Tạo review_category_items cho category 1 và 2
            for rc_id, cat_id in current_review_category_ids:
                if cat_id == 1:  # Lecturer
                    num_lecturers = random.randint(1, 3)
                    selected_lecturers = random.sample(range(1, 57), num_lecturers)
                    for lecturer_id in selected_lecturers:
                        sql_statements.append(f"INSERT INTO review_category_items (id, review_category_id, lecturer_id, subject_id)")
                        sql_statements.append(f"VALUES ({review_category_item_id}, {rc_id}, {lecturer_id}, NULL);")
                        review_category_item_id += 1
                        
                elif cat_id == 2:  # Subject
                    num_subjects = random.randint(1, 3)
                    selected_subjects = random.sample(range(1, 49), num_subjects)
                    for subject_id in selected_subjects:
                        sql_statements.append(f"INSERT INTO review_category_items (id, review_category_id, lecturer_id, subject_id)")
                        sql_statements.append(f"VALUES ({review_category_item_id}, {rc_id}, NULL, {subject_id});")
                        review_category_item_id += 1
            
            sql_statements.append("")
            
            # Tạo review_questions
            for rc_id, cat_id in current_review_category_ids:
                question_ids = get_category_questions(cat_id)
                for question_id in question_ids:
                    answer_range = get_answer_range(question_id)
                    selected_answer = random.choice(answer_range)
                    
                    sql_statements.append(f"INSERT INTO review_questions (id, review_category_id, question_id, answer_id)")
                    sql_statements.append(f"VALUES ({review_question_id}, {rc_id}, {question_id}, {selected_answer});")
                    review_question_id += 1
            
            sql_statements.append("")
            review_id += 1
    
    return "\n".join(sql_statements)

# Sinh SQL cho 500 users để có 1500 reviews (500 * 3 = 1500)
sql_content = generate_reviews_sql(start_user_id=2, end_user_id=501, reviews_per_user=3)

# Ghi ra file txt
with open('reviews_data.txt', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print("Đã sinh xong file reviews_data.txt với 500 users (1500 reviews)")
print("Tổng số records:")
print("- Reviews: 1500")
print("- Review Categories: ~4500 (trung bình 3 categories/review)")
print("- Review Questions: ~9000 (2 questions/category)")
print("- Review Category Items: ~1500 (chỉ category 1&2)")
