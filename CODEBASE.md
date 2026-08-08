# CODEBASE DOCUMENTATION - LÊ HẢI PHONG-Seawind

Nền tảng Web.App Đào tạo, Thi Đánh Giá Năng Lực & Trao Đổi Kiểm Toán Nội Bộ.

## 1. Cấu trúc thư mục (Directory Structure)

```
Thuc-hanh_LeHaiPhong_20260804/
├── database/
│   └── schema.sql         # Script SQL tạo cơ sở dữ liệu PostgreSQL / MySQL
├── public/
│   ├── css/
│   │   └── styles.css     # CSS 3D Luxury System (Navy Blue, Gold & Crisp White)
│   ├── js/
│   │   └── app.js         # Client-side Logic (Menu Engine, Anti-Cheat, Forum, Portals)
│   └── index.html         # Giao diện chính Web.App
├── package.json           # Khai báo phụ thuộc Node.js (express, cors, helmet, rate-limit)
├── server.js              # Server Backend Node.js Express & Security Middle-end
└── CODEBASE.md            # Tài liệu cấu trúc hệ thống
```

## 2. Các Phân Khu Chức Năng (Modules)

1. **Header & Navigation Dynamic Menu**: Menu đa cấp Ngang - Dọc - Mẹ - Con hiển thị mượt mà.
2. **Hero Banner 3D Luxury**: Banner giới thiệu giảng viên LÊ HẢI PHONG-Seawind & ưu đãi 47% Quản trị Tài chính & Kiểm toán Nội bộ.
3. **5 Portal Switcher**:
   - Trang chủ Public
   - Portal Học Viên (LMS)
   - Portal Giảng Viên
   - Trung Tâm Thi Online Anti-Cheat (Giám sát chuyển Tab & Tính điểm tự động)
   - Diễn Đàn Trao Đổi Giảng Viên - Học Viên (Q&A Forum)
4. **Bảo Mật Cyber Security**:
   - Helmet Security Headers
   - Rate Limiting (chống DDoS)
   - CORS Restriction
   - Anti-Cheat tab-switch logger for online exams

## 3. Hướng dẫn chạy localhost (Local Dev Server)

```bash
# Cài đặt thư viện dependencies
npm install

# Khởi chạy server
npm start
```
Địa chỉ truy cập: `http://localhost:3000`
