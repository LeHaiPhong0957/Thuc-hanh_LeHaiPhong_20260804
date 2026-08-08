import http.server
import socketserver
import json
import os
import urllib.parse

PORT = 3000

DB = {
    "branding": {
        "companyName": "LÊ HẢI PHONG-Seawind",
        "slogan": "Nền tảng Đào tạo, Thi Đánh Giá Năng Lực & Kiểm Toán Nội Bộ Hàng Đầu",
        "hotline": "0913275851",
        "email": "support@lehaiphong-seawind.edu.vn",
        "address": "Tòa nhà Seawind Financial Center, Hà Nội & TP. Hồ Chí Minh"
    },
    "menus": [
        {
            "title": "Về chúng tôi",
            "url": "#about",
            "children": [
                { "title": "Về LÊ HẢI PHONG-Seawind", "url": "#about-us" },
                {
                    "title": "Đội ngũ giảng viên",
                    "url": "#instructors",
                    "children": [
                        { "title": "Giảng viên CGMA", "url": "#instructor-cgma" },
                        { "title": "Giảng viên ACCA", "url": "#instructor-acca" },
                        { "title": "Giảng viên CFA", "url": "#instructor-cfa" },
                        { "title": "Giảng viên CMA", "url": "#instructor-cma" },
                        { "title": "Giảng viên IFRS", "url": "#instructor-ifrs" },
                        { "title": "Giảng viên Kiểm toán Nội bộ CIA", "url": "#instructor-cia" },
                        { "title": "Tuyển dụng giảng viên", "url": "#instructor-recruitment" }
                    ]
                },
                { "title": "Đội ngũ học thuật", "url": "#academic-team" },
                { "title": "Cơ sở vật chất 3D", "url": "#facilities" },
                { "title": "Tuyển dụng", "url": "#careers" }
            ]
        },
        {
            "title": "Khóa học",
            "url": "#courses",
            "children": [
                { "title": "Khóa học CGMA", "url": "#course-cgma" },
                {
                    "title": "Khóa học ACCA",
                    "url": "#course-acca",
                    "children": [
                        { "title": "Giới thiệu về ACCA", "url": "#acca-intro" },
                        { "title": "Khóa học ACCA Online", "url": "#acca-online" },
                        { "title": "Khóa học ACCA Face-to-face", "url": "#acca-f2f" },
                        { "title": "ACCA cho Business Leader", "url": "#acca-leader" },
                        { "title": "Đội ngũ giảng viên ACCA", "url": "#instructor-acca" },
                        { "title": "Lịch khai giảng ACCA", "url": "#acca-schedule" },
                        { "title": "Học bổng ACCA 2026", "url": "#acca-scholarship" },
                        { "title": "Bài viết ACCA", "url": "#acca-articles" },
                        { "title": "Sự kiện ACCA", "url": "#acca-events" },
                        { "title": "Hành trình chinh phục ACCA", "url": "#acca-roadmap" },
                        { "title": "Đăng ký học thử ACCA Online", "url": "#acca-trial" },
                        { "title": "Test đầu vào ACCA", "url": "#acca-entry-test" }
                    ]
                },
                { "title": "Khóa học CFA", "url": "#course-cfa" },
                { "title": "Khóa học CMA", "url": "#course-cma" },
                { "title": "Khóa học IFRS", "url": "#course-ifrs" },
                { "title": "Khóa học chuyên sâu Quản Trị TCDN & Kiểm toán Nội bộ", "url": "#course-ia-master" },
                { "title": "Luyện thi BIG4 & Kiểm toán Nội bộ cấp tốc", "url": "#course-big4-fast" }
            ]
        },
        {
            "title": "Tin tức - Sự kiện",
            "url": "#news",
            "children": [
                { "title": "Blog Kiến thức Kiểm toán", "url": "#blog" },
                {
                    "title": "Sự kiện",
                    "url": "#events",
                    "children": [
                        { "title": "Sự kiện CGMA", "url": "#event-cgma" },
                        { "title": "Sự kiện ACCA", "url": "#event-acca" },
                        { "title": "Sự kiện CFA", "url": "#event-cfa" },
                        { "title": "Sự kiện CMA", "url": "#event-cma" },
                        { "title": "Sự kiện IFRS", "url": "#event-ifrs" },
                        { "title": "Workshop Kiểm toán Nội bộ Masterclass", "url": "#event-ia-workshop" }
                    ]
                },
                { "title": "Tin tức tuyển dụng ngành", "url": "#industry-news" }
            ]
        },
        { "title": "Học bổng", "url": "#scholarships" },
        { "title": "Góc học viên", "url": "#student-corner" },
        { "title": "Thi Đánh Giá Năng Lực", "url": "#exam-center" },
        { "title": "Trao Đổi Giảng Viên - Học Viên", "url": "#qa-forum" },
        { "title": "Tài liệu", "url": "#documents" },
        { "title": "Liên hệ", "url": "#contact" }
    ],
    "courses": [
        {
            "id": 1,
            "code": "IA-PRO-2026",
            "title": "LÀM CHỦ KIỂM TOÁN NỘI BỘ & QUẢN TRỊ RỦI RO ENTERPRISE",
            "category": "Kiểm toán Nội bộ",
            "priceOriginal": "18.500.000đ",
            "priceDiscount": "9.805.000đ",
            "discountBadge": "Ưu đãi 47%",
            "modules": 7,
            "students": 1420,
            "rating": 4.9,
            "highlights": [
                "Phân tích chuyên sâu báo cáo tài chính & Gian lận",
                "Lập kế hoạch kiểm toán dựa trên rủi ro (Risk-based Audit)",
                "Đánh giá hệ thống KSNB theo chuẩn COSO & ISO 31000",
                "Ứng dụng AI & Data Analytics phát hiện dấu hiệu bất thường"
            ]
        },
        {
            "id": 2,
            "code": "ACCA-ADVANCED",
            "title": "KHÓA HỌC ACCA ONLINE CHUẨN QUỐC TẾ 2026",
            "category": "ACCA",
            "priceOriginal": "22.000.000đ",
            "priceDiscount": "11.660.000đ",
            "discountBadge": "Ưu đãi 47%",
            "modules": 12,
            "students": 3100,
            "rating": 5.0,
            "highlights": [
                "Cam kết đầu ra chuẩn 100% bằng chứng chỉ ACCA Global",
                "Giảng viên là Trưởng phòng Kiểm toán BIG4 & CGMA",
                "Kho 5000+ đề thi Mock Test có chấm điểm AI"
            ]
        },
        {
            "id": 3,
            "code": "CIA-FASTTRACK",
            "title": "LUYỆN THI CHỨNG CHỈ KIỂM TOÁN NỘI BỘ CIA (USA)",
            "category": "Kiểm toán Nội bộ",
            "priceOriginal": "25.000.000đ",
            "priceDiscount": "13.250.000đ",
            "discountBadge": "Ưu đãi 47%",
            "modules": 3,
            "students": 890,
            "rating": 4.95,
            "highlights": [
                "Full 3 Phần: Part 1 Essentials, Part 2 Practice, Part 3 Knowledge",
                "Bộ ngân hàng câu hỏi 2.000+ đề CIA chuẩn IIA",
                "Tương tác 1-1 với Chuyên gia Kiểm toán Nội bộ LÊ HẢI PHONG"
            ]
        }
    ],
    "exams": [
        {
            "id": "EXAM-IA-01",
            "title": "Bài Thi Khảo Sát Năng Lực Kiểm Toán Nội Bộ & KSNB 2026",
            "durationMinutes": 10,
            "passScore": 70,
            "questions": [
                {
                    "id": 1,
                    "question": "Khung kiểm soát nội bộ COSO 2013 bao gồm bao nhiêu thành phần cốt lõi?",
                    "options": [
                        "A. 3 thành phần",
                        "B. 5 thành phần (Môi trường kiểm soát, Đánh giá rủi ro, Hoạt động kiểm soát, Thông tin & Truyền thông, Giám sát)",
                        "C. 7 thành phần",
                        "D. 17 nguyên tắc độc lập"
                    ],
                    "correct": "B",
                    "explanation": "Khung COSO 2013 có 5 thành phần cốt lõi và 17 nguyên tắc chỉ đạo."
                },
                {
                    "id": 2,
                    "question": "Tuyến phòng thủ thứ 3 trong Mô hình 3 Tuyến Phòng Thủ (3 Lines Model của IIA 2020) là gì?",
                    "options": [
                        "A. Ban Quản Lý vận hành trực tiếp",
                        "B. Bộ phận Quản lý Rủi ro & Tuân thủ",
                        "C. Bộ phận Kiểm toán Nội bộ (Đảm bảo độc lập và khách quan)",
                        "D. Kiểm toán độc lập bên ngoài"
                    ],
                    "correct": "C",
                    "explanation": "Tuyến 3 cung cấp sự đảm bảo độc lập và khách quan cho Hội đồng Quản trị, chính là Kiểm toán Nội bộ."
                },
                {
                    "id": 3,
                    "question": "Yếu tố quan trọng nhất đảm bảo tính Độc Lập của Kiểm toán Nội bộ là gì?",
                    "options": [
                        "A. Báo cáo trực tiếp về mặt chức năng cho Hội đồng Quản trị / Ủy ban Kiểm toán",
                        "B. Lương của Kiểm toán viên do Tổng Giám đốc phê duyệt",
                        "C. Tham gia trực tiếp vào việc ra quyết định kinh doanh",
                        "D. Không cần tuân thủ chuẩn mực IIA"
                    ],
                    "correct": "A",
                    "explanation": "Báo cáo chức năng cho UBKT/HĐQT giúp KTNB không bị chi phối bởi Ban Giám đốc vận hành."
                }
            ]
        }
    ],
    "forumTopics": [
        {
            "id": 1,
            "title": "Làm thế nào để xây dựng Kế hoạch Kiểm toán Nội bộ dựa trên Rủi ro (Risk-based Audit Plan) cho doanh nghiệp sản xuất?",
            "category": "Kinh nghiệm thực chiến KTNB",
            "authorName": "Học viên Kim Anh",
            "authorRole": "Học viên K48",
            "avatar": "👩‍🎓",
            "createdAt": "10 phút trước",
            "content": "Kính gửi Thầy Lê Hải Phong và các Giảng viên, công ty em đang mở rộng 2 nhà máy mới. Em muốn hỏi quy trình ma trận đánh giá rủi ro để ưu tiên kiểm toán quy trình Mua hàng & Tồn kho như thế nào ạ?",
            "replies": [
                {
                    "id": 101,
                    "authorName": "Lê Hải Phong - Seawind",
                    "authorRole": "Giảng viên Trưởng / Founder",
                    "isLecturer": True,
                    "avatar": "👨‍🏫",
                    "createdAt": "5 phút trước",
                    "content": "Chào em Kim Anh! Để xây ma trận rủi ro cho nhà máy mới: 1. Đánh giá Rủi ro cố hữu (Inherent Risk) về gian lận mua hàng; 2. Đánh giá rủi ro thất thoát vật tư tồn kho; 3. Chấm điểm Tần suất x Mức độ ảnh hưởng. Thầy đã tải file mẫu Ma trận Rủi ro trong Portal Học viên, em vào mục Tài liệu K48 tải về nhé!"
                }
            ]
        }
    ]
}

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Serve static files from 'public' folder
        parsed = urllib.parse.urlparse(path)
        relpath = parsed.path.lstrip('/')
        if not relpath:
            relpath = 'index.html'
        fullpath = os.path.join(os.getcwd(), 'public', relpath)
        if not os.path.exists(fullpath) and not parsed.path.startswith('/api/'):
            fullpath = os.path.join(os.getcwd(), 'public', 'index.html')
        return fullpath

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/config':
            self.send_json_response({"success": True, "data": DB["branding"]})
        elif parsed.path == '/api/menu':
            self.send_json_response({"success": True, "data": DB["menus"]})
        elif parsed.path == '/api/courses':
            self.send_json_response({"success": True, "data": DB["courses"]})
        elif parsed.path == '/api/exams':
            sanitized = []
            for exam in DB["exams"]:
                sanitized.append({
                    "id": exam["id"],
                    "title": exam["title"],
                    "durationMinutes": exam["durationMinutes"],
                    "questionsCount": len(exam["questions"]),
                    "questions": [
                        {
                            "id": q["id"],
                            "question": q["question"],
                            "options": q["options"]
                        } for q in exam["questions"]
                    ]
                })
            self.send_json_response({"success": True, "data": sanitized})
        elif parsed.path == '/api/forum/topics':
            self.send_json_response({"success": True, "data": DB["forumTopics"]})
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length)
        body = json.loads(body_bytes.decode('utf-8')) if body_bytes else {}

        if parsed.path == '/api/exams/submit':
            exam_id = body.get('examId')
            answers = body.get('answers', {})
            tab_switches = body.get('tabSwitches', 0)
            student_name = body.get('studentName', 'Học viên Seawind')

            exam = next((e for e in DB["exams"] if e["id"] == exam_id), None)
            if not exam:
                return self.send_json_response({"success": False, "error": "Không tìm thấy đề thi!"}, status=404)

            correct_count = 0
            total = len(exam["questions"])
            details = []

            for q in exam["questions"]:
                user_ans = answers.get(str(q["id"])) or answers.get(q["id"])
                is_correct = (user_ans == q["correct"])
                if is_correct:
                    correct_count += 1
                details.append({
                    "questionId": q["id"],
                    "question": q["question"],
                    "userAns": user_ans or "Không chọn",
                    "correctAns": q["correct"],
                    "isCorrect": is_correct,
                    "explanation": q["explanation"]
                })

            score_percent = round((correct_count / total) * 100)
            is_passed = score_percent >= exam["passScore"]

            warning = f"Cảnh báo: Hệ thống Anti-Cheat ghi nhận bạn đã chuyển tab {tab_switches} lần trong khi làm bài!" if tab_switches > 0 else "Thao tác làm bài nghiêm túc, hợp lệ."

            self.send_json_response({
                "success": True,
                "data": {
                    "studentName": student_name,
                    "examTitle": exam["title"],
                    "correctCount": correct_count,
                    "total": total,
                    "scorePercent": score_percent,
                    "isPassed": is_passed,
                    "antiCheatWarning": warning,
                    "details": details
                }
            })

        elif parsed.path == '/api/forum/topics':
            title = body.get('title')
            content = body.get('content')
            new_topic = {
                "id": len(DB["forumTopics"]) + 1,
                "title": title,
                "content": content,
                "authorName": body.get('authorName', 'Học viên Seawind'),
                "authorRole": body.get('authorRole', 'Học viên'),
                "category": body.get('category', 'Thảo luận Kiểm toán'),
                "avatar": "🎓",
                "createdAt": "Vừa xong",
                "replies": []
            }
            DB["forumTopics"].insert(0, new_topic)
            self.send_json_response({"success": True, "message": "Đăng câu hỏi thành công!", "data": new_topic})

        elif parsed.path == '/api/forum/replies':
            topic_id = int(body.get('topicId', 0))
            content = body.get('content', '')
            is_lecturer = bool(body.get('isLecturer', False))
            topic = next((t for t in DB["forumTopics"] if t["id"] == topic_id), None)
            if not topic:
                return self.send_json_response({"success": False, "error": "Chủ đề không tồn tại"}, status=404)

            new_reply = {
                "id": len(topic["replies"]) + 100,
                "authorName": body.get('authorName', 'ThS. Nguyễn Văn Đức'),
                "authorRole": "Giảng viên Trưởng" if is_lecturer else "Học viên",
                "isLecturer": is_lecturer,
                "avatar": "👨‍🏫" if is_lecturer else "👩‍🎓",
                "createdAt": "Vừa xong",
                "content": content
            }
            topic["replies"].append(new_reply)
            self.send_json_response({"success": True, "message": "Đã phản hồi!", "data": new_reply})

        elif parsed.path == '/api/consultation':
            name = body.get('fullName', 'Học viên')
            phone = body.get('phone', '0913275851')
            self.send_json_response({
                "success": True,
                "message": f"Cảm ơn {name}! Ban cố vấn LÊ HẢI PHONG-Seawind sẽ gọi lại tới SĐT {phone} trong 15 phút."
            })
        else:
            self.send_json_response({"success": False, "error": "Not Found"}, status=404)

    def send_json_response(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    print(f"=======================================================")
    print(f"🚀 PYTHON WEB SERVER LIVE AT: http://localhost:{PORT}")
    print(f"BRANDING: LÊ HẢI PHONG-Seawind | HOTLINE: 0913275851")
    print(f"=======================================================")
    with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
        httpd.serve_forever()
