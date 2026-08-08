-- ==============================================================================
-- DATABASE SCHEMA FOR WEBSITE LÊ HẢI PHONG-Seawind
-- Hệ Thống Đào Tạo, Thi Đánh Giá Năng Lực & Trao Đổi Kiểm Toán Nội Bộ
-- ==============================================================================

-- 1. BẢNG NGƯỜI DÙNG (USERS)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) DEFAULT '0913275851',
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('ADMIN', 'LECTURER', 'STUDENT')) DEFAULT 'STUDENT',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG DANH MỤC MENU DYNAMIC (MENUS)
CREATE TABLE IF NOT EXISTS menus (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    parent_id INT REFERENCES menus(id) ON DELETE CASCADE,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    badge VARCHAR(50),
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG KHÓA HỌC (COURSES)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- ACCA, CGMA, CIA, Internal Audit, IFRS, BIG4
    description TEXT,
    instructor_id INT REFERENCES users(id) ON DELETE SET NULL,
    original_price DECIMAL(12, 2),
    discount_price DECIMAL(12, 2),
    discount_percent INT DEFAULT 47,
    level VARCHAR(50) DEFAULT 'Chuyên Sâu',
    duration_hours INT DEFAULT 60,
    banner_url TEXT,
    status VARCHAR(50) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG ĐỀ THI & ĐÁNH GIÁ NĂNG LỰC (EXAMS)
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) DEFAULT 'Kiểm toán Nội bộ & Quản trị Rủi ro',
    duration_minutes INT DEFAULT 45,
    pass_score INT DEFAULT 70,
    total_questions INT DEFAULT 10,
    created_by INT REFERENCES users(id),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG CÂU HỎI THI (EXAM_QUESTIONS)
CREATE TABLE IF NOT EXISTS exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT
);

-- 6. BẢNG BÀI LÀM CỦA HỌC VIÊN (STUDENT_EXAM_RESULTS)
CREATE TABLE IF NOT EXISTS student_exam_results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exam_id INT REFERENCES exams(id) ON DELETE CASCADE,
    score INT NOT NULL,
    is_passed BOOLEAN NOT NULL,
    anti_cheat_tab_switches INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG DIỄN ĐÀN TRAO ĐỔI GIẢNG VIÊN - HỌC VIÊN (FORUM_TOPICS)
CREATE TABLE IF NOT EXISTS forum_topics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) DEFAULT 'Thảo luận Kiểm toán Nội bộ',
    is_resolved BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG CÂU TRẢ LỜI TRONG DIỄN ĐÀN (FORUM_REPLIES)
CREATE TABLE IF NOT EXISTS forum_replies (
    id SERIAL PRIMARY KEY,
    topic_id INT REFERENCES forum_topics(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_lecturer_answer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DỮ LIỆU MẪU (SEED DATA)
-- ==============================================================================

INSERT INTO users (full_name, email, phone, password_hash, role, bio) VALUES
('Lê Hải Phong', 'lehaiphong@seawind.edu.vn', '0913275851', '$2b$10$SampleHashPass1', 'ADMIN', 'Chuyên gia Trưởng Kiểm toán Nội bộ & Quản trị Rủi ro Doanh nghiệp - Founder Seawind Academy'),
('ThS. Nguyễn Văn Đức', 'duc.nguyen@seawind.edu.vn', '0913275851', '$2b$10$SampleHashPass2', 'LECTURER', 'Giảng viên Giám sát Kiểm toán Nội bộ CIA & ACCA Specialist'),
('Học viên Nguyễn Kim Anh', 'kimanh.student@gmail.com', '0913275851', '$2b$10$SampleHashPass3', 'STUDENT', 'Học viên Lớp Kiểm toán Nội bộ K48');

-- Thêm dữ liệu Menu Đa Cấp
INSERT INTO menus (id, title, url, parent_id, sort_order) VALUES
(1, 'Về chúng tôi', '#about', NULL, 1),
(2, 'Về LÊ HẢI PHONG-Seawind', '#about-us', 1, 1),
(3, 'Đội ngũ giảng viên', '#instructors', 1, 2),
(4, 'Giảng viên CGMA', '#instructor-cgma', 3, 1),
(5, 'Giảng viên ACCA', '#instructor-acca', 3, 2),
(6, 'Giảng viên CIA & Kiểm toán Nội bộ', '#instructor-cia', 3, 3),
(7, 'Khóa học', '#courses', NULL, 2),
(8, 'Khóa học ACCA', '#course-acca', 7, 1),
(9, 'Kiểm toán Nội bộ Chuyên sâu (CIA)', '#course-cia', 7, 2),
(10, 'Tin tức - Sự kiện', '#news', NULL, 3),
(11, 'Thi Đánh Giá Năng Lực', '#exam-center', NULL, 4),
(12, 'Trao Đổi Giảng Viên - Học Viên', '#qa-forum', NULL, 5);

SELECT setval('menus_id_seq', (SELECT MAX(id) FROM menus));
