const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================================================================
// 1. TẦNG BẢO MẬT & MIDDLE-END (CYBER SECURITY & MIDDLEWARE)
// ==============================================================================

// Web Security Headers với Helmet
app.use(helmet({
    contentSecurityPolicy: false, // Cho phép load cdn fontawesome & google fonts
}));

// CORS Configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiter: Chống DDoS và Brute Force Attack
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 200, // Giới hạn 200 requests / IP
    message: { success: false, error: 'Quá nhiều yêu cầu từ IP của bạn, vui lòng thử lại sau 15 phút!' }
});
app.use('/api/', apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các file tĩnh trong thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// ==============================================================================
// 2. MOCK DATABASE (IN-MEMORY FOR FAST LIVE DEMO)
// ==============================================================================

const DB = {
    branding: {
        companyName: "LÊ HẢI PHONG-Seawind",
        slogan: "Nền tảng Đào tạo, Thi Đánh Giá Năng Lực & Kiểm Toán Nội Bộ Hàng Đầu",
        hotline: "0913275851",
        email: "support@lehaiphong-seawind.edu.vn",
        address: "Tòa nhà Seawind Financial Center, Hà Nội & TP. Hồ Chí Minh"
    },
    menus: [
        {
            title: "Về chúng tôi",
            url: "#about",
            children: [
                { title: "Về LÊ HẢI PHONG-Seawind", url: "#about-us" },
                {
                    title: "Đội ngũ giảng viên",
                    url: "#instructors",
                    children: [
                        { title: "Giảng viên CGMA", url: "#instructor-cgma" },
                        { title: "Giảng viên ACCA", url: "#instructor-acca" },
                        { title: "Giảng viên CFA", url: "#instructor-cfa" },
                        { title: "Giảng viên CMA", url: "#instructor-cma" },
                        { title: "Giảng viên IFRS", url: "#instructor-ifrs" },
                        { title: "Giảng viên Kiểm toán Nội bộ CIA", url: "#instructor-cia" },
                        { title: "Tuyển dụng giảng viên", url: "#instructor-recruitment" }
                    ]
                },
                { title: "Đội ngũ học thuật", url: "#academic-team" },
                { title: "Cơ sở vật chất 3D", url: "#facilities" },
                { title: "Tuyển dụng", url: "#careers" }
            ]
        },
        {
            title: "Khóa học",
            url: "#courses",
            children: [
                { title: "Khóa học CGMA", url: "#course-cgma" },
                {
                    title: "Khóa học ACCA",
                    url: "#course-acca",
                    children: [
                        { title: "Giới thiệu về ACCA", url: "#acca-intro" },
                        { title: "Khóa học ACCA Online", url: "#acca-online" },
                        { title: "Khóa học ACCA Face-to-face", url: "#acca-f2f" },
                        { title: "ACCA cho Business Leader", url: "#acca-leader" },
                        { title: "Đội ngũ giảng viên ACCA", url: "#instructor-acca" },
                        { title: "Lịch khai giảng ACCA", url: "#acca-schedule" },
                        { title: "Học bổng ACCA 2026", url: "#acca-scholarship" },
                        { title: "Bài viết ACCA", url: "#acca-articles" },
                        { title: "Sự kiện ACCA", url: "#acca-events" },
                        { title: "Hành trình chinh phục ACCA", url: "#acca-roadmap" },
                        { title: "Đăng ký học thử ACCA Online", url: "#acca-trial" },
                        { title: "Test đầu vào ACCA", url: "#acca-entry-test" }
                    ]
                },
                { title: "Khóa học CFA", url: "#course-cfa" },
                { title: "Khóa học CMA", url: "#course-cma" },
                { title: "Khóa học IFRS", url: "#course-ifrs" },
                { title: "Khóa học chuyên sâu Quản Trị TCDN & Kiểm toán Nội bộ", url: "#course-ia-master" },
                { title: "Luyện thi BIG4 & Kiểm toán Nội bộ cấp tốc", url: "#course-big4-fast" }
            ]
        },
        {
            title: "Tin tức - Sự kiện",
            url: "#news",
            children: [
                { title: "Blog Kiến thức Kiểm toán", url: "#blog" },
                {
                    title: "Sự kiện",
                    url: "#events",
                    children: [
                        { title: "Sự kiện CGMA", url: "#event-cgma" },
                        { title: "Sự kiện ACCA", url: "#event-acca" },
                        { title: "Sự kiện CFA", url: "#event-cfa" },
                        { title: "Sự kiện CMA", url: "#event-cma" },
                        { title: "Sự kiện IFRS", url: "#event-ifrs" },
                        { title: "Workshop Kiểm toán Nội bộ Masterclass", url: "#event-ia-workshop" }
                    ]
                },
                { title: "Tin tức tuyển dụng ngành", url: "#industry-news" }
            ]
        },
        { title: "Học bổng", url: "#scholarships" },
        { title: "Góc học viên", url: "#student-corner" },
        { title: "Thi Đánh Giá Năng Lực", url: "#exam-center" },
        { title: "Trao Đổi Giảng Viên - Học Viên", url: "#qa-forum" },
        { title: "Tài liệu", url: "#documents" },
        { title: "Liên hệ", url: "#contact" }
    ],
    courses: [
        {
            id: 1,
            code: "IA-PRO-2026",
            title: "LÀM CHỦ KIỂM TOÁN NỘI BỘ & QUẢN TRỊ RỦI RO ENTERPRISE",
            category: "Kiểm toán Nội bộ",
            priceOriginal: "18.500.000đ",
            priceDiscount: "9.805.000đ",
            discountBadge: "Ưu đãi 47%",
            modules: 7,
            students: 1420,
            rating: 4.9,
            highlights: [
                "Phân tích chuyên sâu báo cáo tài chính & Gian lận",
                "Lập kế hoạch kiểm toán dựa trên rủi ro (Risk-based Audit)",
                "Đánh giá hệ thống KSNB theo chuẩn COSO & ISO 31000",
                "Ứng dụng AI & Data Analytics phát hiện dấu hiệu bất thường"
            ]
        },
        {
            id: 2,
            code: "ACCA-ADVANCED",
            title: "KHÓA HỌC ACCA ONLINE CHUẨN QUỐC TẾ 2026",
            category: "ACCA",
            priceOriginal: "22.000.000đ",
            priceDiscount: "11.660.000đ",
            discountBadge: "Ưu đãi 47%",
            modules: 12,
            students: 3100,
            rating: 5.0,
            highlights: [
                "Cam kết đầu ra chuẩn 100% bằng chứng chỉ ACCA Global",
                "Giảng viên là Trưởng phòng Kiểm toán BIG4 & CGMA",
                "Kho 5000+ đề thi Mock Test có chấm điểm AI"
            ]
        },
        {
            id: 3,
            code: "CIA-FASTTRACK",
            title: "LUYỆN THI CHỨNG CHỈ KIỂM TOÁN NỘI BỘ CIA (USA)",
            category: "Kiểm toán Nội bộ",
            priceOriginal: "25.000.000đ",
            priceDiscount: "13.250.000đ",
            discountBadge: "Ưu đãi 47%",
            modules: 3,
            students: 890,
            rating: 4.95,
            highlights: [
                "Full 3 Phần: Part 1 Essentials, Part 2 Practice, Part 3 Knowledge",
                "Bộ ngân hàng câu hỏi 2.000+ đề CIA chuẩn IIA",
                "Tương tác 1-1 với Chuyên gia Kiểm toán Nội bộ LÊ HẢI PHONG"
            ]
        }
    ],
    exams: [
        {
            id: "EXAM-IA-01",
            title: "Bài Thi Khảo Sát Năng Lực Kiểm Toán Nội Bộ & KSNB 2026",
            durationMinutes: 10,
            passScore: 70,
            questions: [
                {
                    id: 1,
                    question: "Khung kiểm soát nội bộ COSO 2013 bao gồm bao nhiêu thành phần cốt lõi?",
                    options: [
                        "A. 3 thành phần",
                        "B. 5 thành phần (Môi trường kiểm soát, Đánh giá rủi ro, Hoạt động kiểm soát, Thông tin & Truyền thông, Giám sát)",
                        "C. 7 thành phần",
                        "D. 17 nguyên tắc độc lập"
                    ],
                    correct: "B",
                    explanation: "Khung COSO 2013 có 5 thành phần cốt lõi và 17 nguyên tắc chỉ đạo."
                },
                {
                    id: 2,
                    question: "Tuyến phòng thủ thứ 3 trong Mô hình 3 Tuyến Phòng Thủ (3 Lines Model của IIA 2020) là gì?",
                    options: [
                        "A. Ban Quản Lý vận hành trực tiếp",
                        "B. Bộ phận Quản lý Rủi ro & Tuân thủ",
                        "C. Bộ phận Kiểm toán Nội bộ (Đảm bảo độc lập và khách quan)",
                        "D. Kiểm toán độc lập bên ngoài"
                    ],
                    correct: "C",
                    explanation: "Tuyến 3 cung cấp sự đảm bảo độc lập và khách quan cho Hội đồng Quản trị, chính là Kiểm toán Nội bộ."
                },
                {
                    id: 3,
                    question: "Yếu tố quan trọng nhất đảm bảo tính Độc Lập của Kiểm toán Nội bộ là gì?",
                    options: [
                        "A. Báo cáo trực tiếp về mặt chức năng cho Hội đồng Quản trị / Ủy ban Kiểm toán",
                        "B. Lương của Kiểm toán viên do Tổng Giám đốc phê duyệt",
                        "C. Tham gia trực tiếp vào việc ra quyết định kinh doanh",
                        "D. Không cần tuân thủ chuẩn mực IIA"
                    ],
                    correct: "A",
                    explanation: "Báo cáo chức năng cho UBKT/HĐQT giúp KTNB không bị chi phối bởi Ban Giám đốc vận hành."
                }
            ]
        }
    ],
    forumTopics: [
        {
            id: 1,
            title: "Làm thế nào để xây dựng Kế hoạch Kiểm toán Nội bộ dựa trên Rủi ro (Risk-based Audit Plan) cho doanh nghiệp sản xuất?",
            category: "Kinh nghiệm thực chiến KTNB",
            authorName: "Học viên Kim Anh",
            authorRole: "Học viên K48",
            avatar: "👩‍🎓",
            createdAt: "10 phút trước",
            content: "Kính gửi Thầy Lê Hải Phong và các Giảng viên, công ty em đang mở rộng 2 nhà máy mới. Em muốn hỏi quy trình ma trận đánh giá rủi ro để ưu tiên kiểm toán quy trình Mua hàng & Tồn kho như thế nào ạ?",
            replies: [
                {
                    id: 101,
                    authorName: "Lê Hải Phong - Seawind",
                    authorRole: "Giảng viên Trưởng / Founder",
                    isLecturer: true,
                    avatar: "👨‍🏫",
                    createdAt: "5 phút trước",
                    content: "Chào em Kim Anh! Để xây ma trận rủi ro cho nhà máy mới: 1. Đánh giá Rủi ro cố hữu (Inherent Risk) về gian lận mua hàng; 2. Đánh giá rủi ro thất thoát vật tư tồn kho; 3. Chấm điểm Tần suất x Mức độ ảnh hưởng. Thầy đã tải file mẫu Ma trận Rủi ro trong Portal Học viên, em vào mục Tài liệu K48 tải về nhé!"
                }
            ]
        }
    ]
};

// ==============================================================================
// 3. API ENDPOINTS (BACKEND API & DATA SERVICES)
// ==============================================================================

// API 1: Thông tin thương hiệu & CMS Dynamic Menu
app.get('/api/config', (req, res) => {
    res.json({ success: true, data: DB.branding });
});

app.get('/api/menu', (req, res) => {
    res.json({ success: true, data: DB.menus });
});

// API 2: Danh sách khóa học
app.get('/api/courses', (req, res) => {
    const { category } = req.query;
    if (category) {
        const filtered = DB.courses.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
        return res.json({ success: true, data: filtered });
    }
    res.json({ success: true, data: DB.courses });
});

// API 3: Thi đánh giá năng lực & Anti-cheat Submit
app.get('/api/exams', (req, res) => {
    // Trả về danh sách đề thi (che đáp án)
    const sanitizedExams = DB.exams.map(exam => ({
        id: exam.id,
        title: exam.title,
        durationMinutes: exam.durationMinutes,
        questionsCount: exam.questions.length,
        questions: exam.questions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options
        }))
    }));
    res.json({ success: true, data: sanitizedExams });
});

app.post('/api/exams/submit', (req, res) => {
    const { examId, answers, tabSwitches, studentName } = req.body;
    const exam = DB.exams.find(e => e.id === examId);

    if (!exam) {
        return res.status(404).json({ success: false, error: "Không tìm thấy đề thi!" });
    }

    let correctCount = 0;
    const total = exam.questions.length;
    const details = [];

    exam.questions.forEach(q => {
        const userAns = answers[q.id];
        const isCorrect = userAns === q.correct;
        if (isCorrect) correctCount++;
        details.push({
            questionId: q.id,
            question: q.question,
            userAns: userAns || "Không chọn",
            correctAns: q.correct,
            isCorrect: isCorrect,
            explanation: q.explanation
        });
    });

    const scorePercent = Math.round((correctCount / total) * 100);
    const isPassed = scorePercent >= exam.passScore;

    res.json({
        success: true,
        data: {
            studentName: studentName || "Học viên Seawind",
            examTitle: exam.title,
            correctCount,
            total,
            scorePercent,
            isPassed,
            antiCheatWarning: tabSwitches > 0 ? `Cảnh báo: Hệ thống Anti-Cheat ghi nhận bạn đã chuyển tab ${tabSwitches} lần trong khi làm bài!` : "Thao tác làm bài nghiêm túc, hợp lệ.",
            details
        }
    });
});

// API 4: Diễn đàn trao đổi Giảng viên - Học viên
app.get('/api/forum/topics', (req, res) => {
    res.json({ success: true, data: DB.forumTopics });
});

app.post('/api/forum/topics', (req, res) => {
    const { title, content, authorName, authorRole, category } = req.body;
    if (!title || !content) {
        return res.status(400).json({ success: false, error: "Vui lòng nhập đầy đủ tiêu đề và nội dung!" });
    }
    const newTopic = {
        id: DB.forumTopics.length + 1,
        title,
        content,
        authorName: authorName || "Học viên Seawind",
        authorRole: authorRole || "Học viên",
        category: category || "Thảo luận Kiểm toán",
        avatar: "🎓",
        createdAt: "Vừa xong",
        replies: []
    };
    DB.forumTopics.unshift(newTopic);
    res.json({ success: true, message: "Đăng câu hỏi thành công!", data: newTopic });
});

app.post('/api/forum/replies', (req, res) => {
    const { topicId, content, authorName, isLecturer } = req.body;
    const topic = DB.forumTopics.find(t => t.id === parseInt(topicId));
    if (!topic) {
        return res.status(404).json({ success: false, error: "Không tìm thấy chủ đề thảo luận!" });
    }
    const newReply = {
        id: Date.now(),
        authorName: authorName || (isLecturer ? "Lê Hải Phong - Seawind" : "Học viên"),
        authorRole: isLecturer ? "Giảng viên Trưởng" : "Học viên",
        isLecturer: !!isLecturer,
        avatar: isLecturer ? "👨‍🏫" : "👩‍🎓",
        createdAt: "Vừa xong",
        content
    };
    topic.replies.push(newReply);
    res.json({ success: true, message: "Đã phản hồi câu hỏi!", data: newReply });
});

// API 5: Đăng ký tư vấn miễn phí (Hotline 0913275851)
app.post('/api/consultation', (req, res) => {
    const { fullName, phone, email, courseInterest } = req.body;
    console.log(`[CONSULTATION REGISTRATION] ${fullName} - ${phone} - ${email} - Course: ${courseInterest}`);
    res.json({
        success: true,
        message: `Cảm ơn ${fullName}! Ban cố vấn LÊ HẢI PHONG-Seawind sẽ gọi lại tới SĐT ${phone || '0913275851'} trong 15 phút.`
    });
});

// Serve Single Page Application Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SERVER RUNNING LIVE AT: http://localhost:${PORT}`);
    console.log(`BRANDING: LÊ HẢI PHONG-Seawind | HOTLINE: 0913275851`);
    console.log(`=======================================================`);
});
