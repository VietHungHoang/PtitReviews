import random
from datetime import datetime

USERS = [4, 5, 6, 7, 9, 11]
CATEGORIES = [1, 2, 3, 4, 5, 6]

# Mapping of question_id -> possible answer_id ranges (from data.sql)
ANSWER_RANGES = {
    1: [1, 2],
    2: [3, 4, 5],
    3: [6, 7, 8],
    4: [9, 10, 11],
    5: [12, 13, 14],
    6: [15, 16],
    7: [17, 18, 19],
    8: [20, 21],
    9: [22, 23],
    10: [24, 25],
    11: [26, 27],
    12: [28, 29],
}

# For a category_id (1..6) the two question ids are:
def category_questions(category_id):
    return [(category_id - 1) * 2 + 1, (category_id - 1) * 2 + 2]

# GenZ-style snippets for positive and negative parts
PRAISE_SNIPPETS = [
    "giảng dễ hiểu", "thầy/cô nhiệt tình", "nhiều ví dụ thực tế", "học vui, dễ tiếp thu", "cơ sở OK",
    "tốc độ chấm bài ổn", "tài liệu rõ ràng", "support nhiệt", "đáng đồng tiền bát gạo"
]
CRITIC_SNIPPETS = [
    "chấm bài hơi lâu", "bài giảng chưa mượt", "máy móc cũ", "thiếu tương tác", "tài liệu thiếu cập nhật",
    "hệ thống đăng ký đôi khi lỗi", "thời gian lab ít", "giảng quá nhanh", "phòng ồn"
]

COMMON_REVIEW_TEMPLATES = [
    "Tổng quan: {} nhưng {}.",
    "Nói chung {}, còn {}.",
    "{}/10 cho trải nghiệm: {} nhưng {}.",
    "Ưu: {}. Nhược: {}. Dưới đây là chi tiết."
]

random.seed(42)

def gen_review_text(category_id, rate):
    # pick a praise and a critic; ensure both present
    praise = random.choice(PRAISE_SNIPPETS)
    critic = random.choice(CRITIC_SNIPPETS)
    template = random.choice(COMMON_REVIEW_TEMPLATES)
    if '{}' in template and template.count('{}') == 2:
        return template.format(praise, critic)
    else:
        return f"{praise}. {critic}."


def escape(s: str):
    return s.replace("'", "''")


def generate_sql(output_path='sample_reviews_data.sql'):
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    review_id = 1
    rc_id = 1
    rci_id = 1
    rq_id = 1

    lines = []
    lines.append('-- GENERATED REVIEWS FOR SPECIFIC USERS')
    lines.append(f'-- Generated at {now}')
    lines.append('\n')

    for user in USERS:
        # create one review per user
        common_review = escape(random.choice([
            "Trải nghiệm chung khá OK, có điểm cần cải thiện.",
            "Nói chung ổn, nhưng có vài thứ hơi chán.",
            "Yo, trường xịn nhưng vẫn có bug nhỏ.",
            "Môi trường học tập tốt, support hơi chậm.",
            "Mình thích campus, nhưng hệ thống cần nâng cấp."
        ]))

        lines.append(f"-- Review {review_id} for user {user}")
        lines.append("INSERT INTO reviews (id, user_id, common_review, created_at, updated_at)")
        lines.append(f"VALUES ({review_id}, {user}, '{common_review}', '{now}', '{now}');")

        # choose random number of categories 1..6
        num_cats = random.randint(1, 6)
        selected = random.sample(CATEGORIES, num_cats)

        current_rc_ids = []

        for cat in selected:
            rate = random.randint(1, 5)
            review_text = escape(gen_review_text(cat, rate))
            has_use_service = random.choice(['true', 'false'])
            lines.append("INSERT INTO review_categories (id, review_id, category_id, rate, review_text, has_use_service)")
            lines.append(f"VALUES ({rc_id}, {review_id}, {cat}, {rate}, '{review_text}', {has_use_service});")
            current_rc_ids.append((rc_id, cat))
            rc_id += 1

        # create review_category_items for categories 1 (lecturer) and 2 (subject)
        for rc, cat in current_rc_ids:
            if cat == 1:
                # attach 1-3 lecturer ids from 1..56
                n = random.randint(1, 3)
                lecturers = random.sample(range(1, 57), n)
                for lid in lecturers:
                    lines.append("INSERT INTO review_category_items (id, review_category_id, lecturer_id, subject_id)")
                    lines.append(f"VALUES ({rci_id}, {rc}, {lid}, NULL);")
                    rci_id += 1
            elif cat == 2:
                n = random.randint(1, 3)
                subjects = random.sample(range(1, 49), n)
                for sid in subjects:
                    lines.append("INSERT INTO review_category_items (id, review_category_id, lecturer_id, subject_id)")
                    lines.append(f"VALUES ({rci_id}, {rc}, NULL, {sid});")
                    rci_id += 1

        # create review_questions (2 per category)
        for rc, cat in current_rc_ids:
            q_ids = category_questions(cat)
            for q in q_ids:
                ans = random.choice(ANSWER_RANGES.get(q, [1]))
                lines.append("INSERT INTO review_questions (id, review_category_id, question_id, answer_id)")
                lines.append(f"VALUES ({rq_id}, {rc}, {q}, {ans});")
                rq_id += 1

        lines.append('\n')
        review_id += 1

    # write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print(f"Wrote {output_path}. Reviews generated for users: {USERS}")


if __name__ == '__main__':
    generate_sql()
