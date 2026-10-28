# XIANGQI-systems

**Xiangqi Mastery System** — Hệ thống Game Huấn luyện Cờ Tướng (Xiangqi) cá nhân hóa chuẩn Liên đoàn Cờ Tướng Thế Giới (WXF - World Xiangqi Federation).

---

## 🌟 Tính Năng Nổi Bật (Key Features)

1. **Bàn Cờ Tương Tác Chuẩn 9x10 (Interactive Xiangqi Board)**:
   - Hiển thị đầy đủ Sông (Sở Hà - Hán Giới), Cửu Cung nét đứt, các điểm hoa tiêu (fiducials).
   - Tọa độ chuẩn ký hiệu Cờ Tướng Việt Nam (Bên Đỏ từ phải qua trái 1-9, Bên Đen từ trái qua phải 1-9).
   - Kích thước bàn cờ lớn ($70\text{px}$/ô), hiển thị sắc nét với tỷ lệ tương phản cao (>15:1 WCAG AAA).
   - 4 chế độ hiển thị mặt quân: Ký hiệu Việt viết tắt (`X, M, P...`), Tên đầy đủ (`Xe, Mã, Pháo...`), Chữ Hán thư pháp (`帥, 將, 車...`), và Song ngữ (`R/X, H/M...`).

2. **Cây Kỹ Năng 4 Tầng (4-Tier Mastery Roadmap)**:
   - **Tầng 1 (Nhập Môn & Cảm Giác Quân)**: Luật cản chân Mã, Chặn mắt Tượng, Lộ mặt Tướng, Bảng giá trị quân cờ & Sát cục 1 nước.
   - **Tầng 2 (Sát Pháp Cơ Bản 2-3 Nước)**: 10 đòn sát cục kinh điển (Mã Hậu Pháo, Thiết Môn Thuyên, Pháo Trùng, Mã Ngọa Tào, Giáp Xe Pháo, Điếu Ngư Mã, Bạch Mã Hiện Kê...).
   - **Tầng 3 (Khai Cuộc Tinh Hoa)**: Các thế trận kinh điển (Pháo Đầu đối Bình Phong Mã, Tiên Nhân Chỉ Lộ, Thuận Pháo, Phi Tượng Cuộc) có mũi tên trực quan và phân tích ý đồ chiến thuật từng nước.
   - **Tầng 4 (Cờ Thế Giang Hồ & Cờ Tàn Thực Dụng)**: Cờ thế cổ điển (Thất Tinh Tụ Hội, Đơn Đao Phó Hội, Thiên Lý Độc Hành, Dã Mã Thao Điền) có đồng hồ đếm ngược và gợi ý 3 cấp độ.

3. **Hệ Thống Phân Tích & Chấm Điểm Nước Đi (AI Move Coach)**:
   - Phân loại nước đi thời gian thực: *Nước Tuyệt Diệu (Brilliant)*, *Nước Chuẩn (Best)*, *Nước Yếu (Inaccuracy)*, *Nước Sai Lầm (Blunder)*.
   - Nút giải thích chuyên sâu "Tại sao?" (Why?): Chỉ rõ nguyên nhân chiến thuật, cảnh báo đòn phản công và đề xuất nước đi tối ưu.

4. **Gamification & Huấn Luyện Viên 1-1**:
   - Thanh EXP, Danh hiệu cấp bậc (Tập Sự -> Kỳ Thủ -> Kiện Tướng -> Quốc Thủ -> Đại Sư).
   - Chuỗi ngày luyện tập (Streak), Thử thách giải đố hàng ngày.
   - Modal Huấn luyện viên Đại Sư 1-1 hỗ trợ kiểm tra trình độ đầu vào và trao đổi chiến thuật.

---

## 🛠️ Công Nghệ Phát Triển (Tech Stack)

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Testing**: Vitest (100% WXF Engine and Lessons cross-validated)

---

## 🚀 Cài Đặt & Chạy Thử (Getting Started)

```bash
# Cài đặt dependencies
npm install

# Khởi chạy môi trường phát triển (Development)
npm run dev

# Chạy bộ kiểm thử tự động (Unit Tests)
npm test

# Đóng gói sản phẩm (Production Build)
npm run build
```

---

## 📚 Tài Liệu Tham Khảo (Citations & Standards)

- [1] World Xiangqi Federation (WXF) - Official World Xiangqi Rules: https://www.wxf.org
- [2] Chess Programming Wiki - Chinese Chess Engine & Representation: https://www.chessprogramming.org/Chinese_Chess
- [3] W3C Web Content Accessibility Guidelines (WCAG) 2.1: https://www.w3.org/WAI/WCAG21/
