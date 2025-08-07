import { CategoryInfo } from '../types';

export const categories: CategoryInfo[] = [
  {
    id: 'subjects',
    title: 'Môn học',
    description: 'Đánh giá về chất lượng môn học, nội dung giảng dạy',
    icon: 'BookOpen',
    questions: [
      'Bạn đã học môn này chưa?',
      'Nội dung môn học có phù hợp với thực tế không?',
      'Tài liệu học tập có đầy đủ không?'
    ]
  },
  {
    id: 'lecturers',
    title: 'Giảng viên',
    description: 'Đánh giá về phong cách giảng dạy, tương tác với sinh viên',
    icon: 'Users',
    questions: [
      'Bạn đã được giảng viên này dạy chưa?',
      'Giảng viên có tương tác tốt với sinh viên không?',
      'Phương pháp giảng dạy có hiệu quả không?'
    ]
  },
  {
    id: 'facilities',
    title: 'Cơ sở vật chất',
    description: 'Phòng học, wifi, máy chiếu và các thiết bị hỗ trợ',
    icon: 'Building2',
    questions: [
      'Bạn đã sử dụng cơ sở vật chất này chưa?',
      'Thiết bị có hoạt động tốt không?',
      'Không gian học tập có thoải mái không?'
    ]
  },
  {
    id: 'library',
    title: 'Thư viện',
    description: 'Dịch vụ thư viện, sách báo, không gian học tập',
    icon: 'Library',
    questions: [
      'Bạn có thường xuyên sử dụng thư viện không?',
      'Thư viện có đủ tài liệu cần thiết không?',
      'Không gian học tập có phù hợp không?'
    ]
  },
  {
    id: 'registration',
    title: 'Hệ thống đăng ký học phần',
    description: 'Quy trình đăng ký môn học, thời khóa biểu',
    icon: 'Calendar',
    questions: [
      'Bạn đã sử dụng hệ thống đăng ký chưa?',
      'Hệ thống có ổn định không?',
      'Giao diện có dễ sử dụng không?'
    ]
  },
  {
    id: 'services',
    title: 'Dịch vụ sinh viên',
    description: 'Cán bộ, hỗ trợ hành chính, các dịch vụ khác',
    icon: 'HelpCircle',
    questions: [
      'Bạn đã sử dụng dịch vụ này chưa?',
      'Cán bộ có hỗ trợ nhiệt tình không?',
      'Quy trình xử lý có nhanh chóng không?'
    ]
  }
];