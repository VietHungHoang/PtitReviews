import random
from datetime import datetime, timedelta

def generate_update_review_dates():
    """Sinh SQL để update created_at và updated_at của reviews trong 1 tuần qua"""
    
    # Lấy thời gian hiện tại
    now = datetime.now()
    
    # Tính thời gian 1 tuần trước
    one_week_ago = now - timedelta(days=7)
    
    sql_statements = []
    
    sql_statements.append("-- ========================================")
    sql_statements.append("-- UPDATE REVIEW DATES TO RANDOM TIMES IN LAST WEEK")
    sql_statements.append("-- ========================================")
    sql_statements.append("")
    
    # Giả sử có 1500 reviews (ID từ 1 đến 1500)
    for review_id in range(1, 1501):
        # Sinh thời gian ngẫu nhiên trong khoảng 1 tuần
        random_seconds = random.randint(0, 7 * 24 * 60 * 60)  # 7 ngày * 24 giờ * 60 phút * 60 giây
        random_datetime = one_week_ago + timedelta(seconds=random_seconds)
        
        # Format datetime cho MySQL
        created_at = random_datetime.strftime('%Y-%m-%d %H:%M:%S')
        
        # updated_at có thể giống created_at hoặc sau đó 1 chút
        update_delay = random.randint(0, 3600)  # 0 đến 1 giờ sau created_at
        updated_at = (random_datetime + timedelta(seconds=update_delay)).strftime('%Y-%m-%d %H:%M:%S')
        
        sql_statements.append(f"UPDATE reviews SET created_at = '{created_at}', updated_at = '{updated_at}' WHERE id = {review_id};")
        
        # Thêm comment mỗi 100 dòng để dễ theo dõi
        if review_id % 100 == 0:
            sql_statements.append(f"-- Updated {review_id} reviews")
            sql_statements.append("")
    
    sql_statements.append("")
    sql_statements.append("-- Completed updating all review dates")
    sql_statements.append(f"-- Total reviews updated: 1500")
    sql_statements.append(f"-- Date range: {one_week_ago.strftime('%Y-%m-%d %H:%M:%S')} to {now.strftime('%Y-%m-%d %H:%M:%S')}")
    
    return "\n".join(sql_statements)

def generate_alternative_approach():
    """Sinh SQL approach khác - sử dụng 1 query với RAND()"""
    
    now = datetime.now()
    one_week_ago = now - timedelta(days=7)
    
    sql_statements = []
    
    sql_statements.append("-- ========================================")
    sql_statements.append("-- ALTERNATIVE: UPDATE ALL REVIEWS AT ONCE USING MYSQL RAND()")
    sql_statements.append("-- ========================================")
    sql_statements.append("")
    
    sql_statements.append("-- Update all reviews with random dates in the last week")
    sql_statements.append("UPDATE reviews SET")
    sql_statements.append("  created_at = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 7) DAY) +")
    sql_statements.append("               INTERVAL FLOOR(RAND() * 24) HOUR +") 
    sql_statements.append("               INTERVAL FLOOR(RAND() * 60) MINUTE +")
    sql_statements.append("               INTERVAL FLOOR(RAND() * 60) SECOND,")
    sql_statements.append("  updated_at = created_at + INTERVAL FLOOR(RAND() * 3600) SECOND")
    sql_statements.append("WHERE id BETWEEN 1 AND 1500;")
    sql_statements.append("")
    sql_statements.append("-- This single query will update all 1500 reviews at once")
    
    return "\n".join(sql_statements)

# Sinh cả 2 approaches
print("Generating individual UPDATE statements...")
individual_updates = generate_update_review_dates()

print("Generating single RAND() query...")
single_query = generate_alternative_approach()

# Ghi ra 2 files txt
with open('update_reviews_individual.txt', 'w', encoding='utf-8') as f:
    f.write(individual_updates)

with open('update_reviews_single.txt', 'w', encoding='utf-8') as f:
    f.write(single_query)

print("Đã tạo xong 2 files:")
print("1. update_reviews_individual.txt - 1500 câu UPDATE riêng lẻ")
print("2. update_reviews_single.txt - 1 câu query duy nhất sử dụng RAND()")
print("")
print("Khuyến nghị: Sử dụng file update_reviews_single.txt vì nhanh hơn và hiệu quả hơn")
