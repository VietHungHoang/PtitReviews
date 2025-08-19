use ptit_reviews;
-- set client_encoding = "utf8";
SET NAMES utf8mb4;

INSERT INTO categories (id, dtype, name, description, icon, created_at, updated_at) VALUES
(1, 'Category', 'Giảng viên', 'Đánh giá về giảng viên và chất lượng giảng dạy', '👨‍🏫', '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
(2, 'Category', 'Môn học', 'Đánh giá về nội dung và chương trình môn học', '📚', '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
(3, 'Category', 'Cơ sở vật chất', 'Đánh giá về phòng học, thiết bị và cơ sở vật chất', '🏢', '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
(4, 'Category', 'Thư viện', 'Đánh giá về dịch vụ và tài liệu thư viện', '📖', '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
(5, 'Category', 'Hệ thống đăng ký học phần', 'Đánh giá về hệ thống đăng ký học phần online', '💻', '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
(6, 'Category', 'Dịch vụ sinh viên', 'Đánh giá về các dịch vụ hỗ trợ sinh viên', '🎓', '2025-08-06 00:00:00', '2025-08-06 00:00:00');

-- 2. Tạo các danh mục con cho Môn học
INSERT INTO subjects (name, code, credits, semester, subject_category_id, created_at, updated_at) VALUES
('Triết học Mác-Lênin', 'BAS1150', 3, 'HK1', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Giải tích 1', 'BAS1203', 3, 'HK1', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tin học cơ sở 1', 'INT1154', 2, 'HK1', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Đại số', 'BAS1201', 3, 'HK1', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Kinh tế chính trị Mác-Lênin', 'BAS1151', 2, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tiếng Anh (Course 1)', 'BAS1157', 4, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Giải tích 2', 'BAS1204', 3, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Vật lý 1 và thí nghiệm', 'BAS1224', 4, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tin học cơ sở 2', 'INT1155', 2, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Xác suất thống kê', 'BAS1226', 2, 'HK2', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Chủ nghĩa xã hội khoa học', 'BAS1152', 2, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tiếng Anh (Course 2)', 'BAS1158', 4, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Toán rời rạc 1', 'INT1358', 3, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Vật lý 3 và thí nghiệm', 'BAS1227', 4, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Kỹ thuật số', 'ELE1433', 2, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Xử lý tín hiệu số', 'ELE1330', 2, 'HK3', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tư tưởng Hồ Chí Minh', 'BAS1122', 2, 'HK4', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Ngôn ngữ lập trình C++', 'INT1339', 3, 'HK4', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Kiến trúc máy tính', 'INT13145', 3, 'HK4', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Toán rời rạc 2', 'INT1359', 3, 'HK4', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Cấu trúc dữ liệu và giải thuật', 'INT1306', 3, 'HK4', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Lịch sử Đảng Cộng sản Việt Nam', 'BAS1153', 2, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Lập trình hướng đối tượng', 'INT1332', 3, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Hệ điều hành', 'INT1319', 3, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Mạng máy tính', 'INT1336', 3, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Cơ sở dữ liệu', 'INT1313', 3, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Tiếng Anh (Course 3 Plus)', 'BAS1160', 2, 'HK5', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Lý thuyết thông tin', 'ELE1319', 3, 'HK6', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Phương pháp luận nghiên cứu khoa học', 'SKD1108', 2, 'HK6', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('An toàn và bảo mật hệ thống thông tin', 'INT1303', 3, 'HK6', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Nhập môn công nghệ phần mềm', 'INT1340', 3, 'HK6', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Lập trình Web', 'INT1434', 3, 'HK6', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Nhập môn trí tuệ nhân tạo', 'INT1341', 3, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Quản lý dự án phần mềm', 'INT1450', 2, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Cơ sở dữ liệu phân tán', 'INT14148', 3, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Phân tích và thiết kế hệ thống thông tin', 'INT1342', 3, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Lập trình với Python', 'INT13162', 3, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Thực tập cơ sở', 'INT13147', 3, 'HK7', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Nhập môn khoa học dữ liệu', 'INT14150', 3, 'HK8', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('IoT và ứng dụng', 'INT14149', 3, 'HK8', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Xử lý ảnh', 'INT13146', 3, 'HK8', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Các hệ thống phân tán', 'INT1405', 3, 'HK8', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Phát triển hệ thống thông tin quản lý', 'INT1445', 3, 'HK9', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Phát triển hệ thống thương mại điện tử', 'INT1446', 3, 'HK9', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Hệ cơ sở dữ liệu đa phương tiện', 'INT1418', 3, 'HK9', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Kho dữ liệu và khai phá dữ liệu', 'INT1422', 3, 'HK9', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Chuyên đề Hệ thống thông tin', 'INT1409', 1, 'HK9', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('Thực tập và tốt nghiệp hoặc thay thế', '', 12, 'HK10', 2, '2025-08-06 00:00:00', '2025-08-06 00:00:00');

-- 3. Tạo các giảng viên mẫu
INSERT INTO lecturers (name, department, specialization, lecturer_category_id, created_at, updated_at) VALUES
('GS. TS. Từ Minh Phương', N'Công nghệ thông tin', N'Công nghệ thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('GS.TS. Phạm Ngọc Anh', N'Toán học', N'Toán học', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Trần Quang Anh', N'Công nghệ thông tin', N'Công nghệ thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Hoàng Xuân Dậu', N'Công nghệ thông tin', N'An toàn thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Phạm Văn Cường', N'Trí tuệ nhân tạo', N'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Đỗ Xuân Chợ', 'Công nghệ thông tin', 'Công nghệ thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Nguyễn Mạnh Hùng', 'Công nghệ thông tin', 'Công nghệ thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TSKH. Hoàng Đăng Hải', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Lê Nhật Thăng', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Trần Trung Duy', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Nguyễn Chiến Trinh', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Hoàng Trọng Minh', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Lê Hải Châu', 'Điện tử', 'Điện tử', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),

('PGS.TS. Đỗ Trung Tuấn', 'Toán máy tính', 'Tin học và Toán máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Trần Tiến Công', 'Công nghệ thông tin', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đỗ Thanh Hà', 'Trí tuệ nhân tạo', 'Trí tuệ nhân tạo', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Vũ Hoài Nam', 'Công nghệ thông tin', 'Kỹ thuật máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Kiều Linh', 'Công nghệ thông tin', 'Toán ứng dụng', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đào Đức Tú', 'Toán ứng dụng', 'Toán ứng dụng', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Phạm Đức Cường', 'Trí tuệ nhân tạo', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Đình Quân', 'Trí tuệ nhân tạo', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Trọng Trung Anh', 'Công nghệ thông tin', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Võ Ngọc Bích Uyên', 'Trí tuệ nhân tạo', 'Toán ứng dụng/Khoa học dữ liệu', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Duy Phương', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Trần Đình Quế', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Hoàng Hữu Hạnh', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đào Ngọc Phong', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đỗ Thị Bích Ngọc', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đỗ Thị Liên', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Dương Khánh Chương', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Trần Nhật Quang', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Đình Hiến', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Trịnh Thị Vân Anh', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Mạnh Sơn', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Hoàng Anh', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đặng Ngọc Hùng', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Văn Tiến', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Ngô Tiến Đức', 'Công nghệ phần mềm', 'Công nghệ phần mềm', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),

('PGS.TS. Nguyễn Trọng Khánh', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Nguyễn Quang Hoan', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('PGS.TS. Hà Hải Nam', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Dương Trần Đức', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Phan Thị Hà', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Quang Hưng', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Đình Hóa', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Thanh Thủy', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Xuân Anh', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Nguyễn Quỳnh Chi', 'Hệ thống thông tin', 'Hệ thống thông tin', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),

('TS. Nguyễn Tất Thắng', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Văn Thoả', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đào Thị Thuý Quỳnh', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Quý Sỹ', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Đỗ Tiến Dũng', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('TS. Nguyễn Thị Mai Trang', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Đinh Xuân Trường', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00'),
('ThS. Vũ Hoài Thư', 'Khoa học máy tính', 'Khoa học máy tính', 1, '2025-08-06 00:00:00', '2025-08-06 00:00:00');

-- 6. Tạo Questions cho mỗi Category
-- Category 1: Giảng viên
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Tham gia học', 'Bạn đã từng học môn nào của các giảng viên này chưa?', 1, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Đánh giá chất lượng', 'Bạn có hài lòng với chất lượng giảng dạy của các giảng viên này không?', 1, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- Category 2: Môn học
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Hoàn thành môn học', 'Bạn đã từng học các môn học này chưa?', 2, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Tham gia lớp học', 'Bạn có tham gia đầy đủ các buổi học của môn này không?', 2, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- Category 3: Cơ sở vật chất
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Sử dụng cơ sở vật chất', 'Bạn có thường xuyên sử dụng cơ sở vật chất của trường không?', 3, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Gặp khó khăn', 'Bạn có từng gặp khó khăn khi sử dụng cơ sở vật chất của trường chưa?', 3, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- Category 4: Thư viện
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Đến thư viện', 'Bạn có thường xuyên đến thư viện không?', 4, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Mượn sách', 'Bạn đã từng mượn sách từ thư viện chưa?', 4, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- Category 5: Hệ thống đăng ký học phần
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Sử dụng hệ thống', 'Bạn đã từng sử dụng hệ thống đăng ký học phần chưa?', 5, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Gặp sự cố', 'Bạn đã từng gặp sự cố khi đăng ký học phần chưa?', 5, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- Category 6: Dịch vụ sinh viên
INSERT INTO questions (title, content, category_id, created_at, updated_at) VALUES
('Liên hệ hỗ trợ', 'Bạn đã từng liên hệ với bộ phận hỗ trợ sinh viên chưa?', 6, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Khó khăn hành chính', 'Bạn đã từng gặp khó khăn khi liên hệ với bộ phận hỗ trợ hành chính chưa?', 6, '2025-08-06 09:00:00', '2025-08-06 09:00:00');

-- 7. Tạo Answers cho tất cả questions (dạng Có/Không/Chưa rõ)
INSERT INTO answers (content, question_id, is_correct, created_at, updated_at) VALUES
-- Question 1: Bạn có từng học môn nào của giảng viên này không?
('Rồi', 1, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 1, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 2: Bạn có hài lòng với chất lượng giảng dạy của giảng viên này không?
('Có', 2, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Không', 2, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Tạm ổn', 2, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 3: Bạn có hoàn thành môn học này không?
('Rồi', 3, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 3, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Đang học', 3, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 4: Bạn có thấy môn học này khó không?
('Có', 4, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Không', 4, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Vắng một vài buổi', 4, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 5: Bạn có hài lòng với chất lượng trang thiết bị học tập không?
('Thường xuyên', 5, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Thỉnh thoảng', 5, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Hiếm khi', 5, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 6: Bạn có thường xuyên sử dụng cơ sở vật chất này không?
('Rồi', 6, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 6, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 7
('Thường xuyên', 7, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Thỉnh thoảng', 7, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa bao giờ', 7, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 8
('Rồi', 8, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 8, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 9
('Rồi', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 10: Bạn có tham gia hoạt động ngoại khóa này không?
('Rồi', 10, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 10, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 11: Bạn có hài lòng với môi trường học tập tại đây không?
('Rồi', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),

-- Question 12: Bạn có thường xuyên học tập tại khu vực này không?
('Rồi', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00'),
('Chưa', 9, false, '2025-08-06 09:00:00', '2025-08-06 09:00:00');