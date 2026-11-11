# Quy tắc Dự án: ReCoverX Career - Hệ thống ATS (Applicant Tracking System)

## 1. Thông tin Dự án & Kiến trúc
- **Tên dự án:** ReCoverX Career (ATS)
- **Kiến trúc:** Next.js Fullstack (App Router) + TypeScript + Tailwind CSS
- **ORM & Database:** Prisma ORM. Môi trường phát triển: SQLite (`file:./dev.db`); Sản xuất: PostgreSQL.
- **AI Engine:** Mô hình Lai (Hybrid): Lớp 1 (Regex/Validation cứng cục bộ) + Lớp 2 (Google Gemini API `@google/genai` nhiệt độ 0 cho AI Parsing & Match Scoring).
- **UI Kit:** Tailwind CSS, Lucide React, shadcn/ui components pattern.
- **Kéo thả Pipeline:** `@hello-pangea/dnd` (Kanban 5 cột: New, Screening, Interview, Hired, Rejected).

## 2. Nguồn Chân lý Nghiệp vụ (Single Source of Truth)
Khi sinh mã và kiểm thử, tuyệt đối tuân thủ các tài liệu đặc tả trong thư mục `docs/`:
- `docs/02_BRD_Updated_Full.md`: Phạm vi nghiệp vụ (In-Scope), dòng chảy tuyển dụng.
- `docs/03_BPMN_As_Is_and_To_Be.md`: Quy trình As-Is & To-Be BPMN 2.0.
- `docs/04_FDD_and_Use_Case_List.md`: Danh sách 7 Use Case cốt lõi (UC-01 đến UC-07).
- `docs/05_Use_Case_Specifications.md`: Bảng đặc tả chi tiết giao diện và luồng sự kiện.
- `docs/06_Dynamic_Models_Activity_Sequence_State.md`: Sơ đồ tuần tự (SD-01 đến SD-04) và Máy trạng thái (State Machine).
- `docs/07_Database_Design_ERD.md`: 8 bảng CSDL (`User`, `Job`, `Candidate`, `Application`, `AIParseResult`, `AIMatchScore`, `Interview`, `EvaluationScorecard`).
- `docs/08_NonFunctional_and_Permissions.md`: Ma trận phân quyền RBAC và yêu cầu phi chức năng.

## 3. Các Quy tắc Nghiệp vụ Bắt buộc (Business Rules - BRL)
- **BRL-01 (Định dạng & Dung lượng tệp):** Chỉ chấp nhận định dạng PDF, DOCX; dung lượng tối đa 10MB.
- **BRL-02 (Khử trùng lặp - Deduplication):** Khóa nhận diện ứng viên là cặp `(Email, Phone)`. Trùng lặp trong vòng 30 ngày cho cùng 1 Job sẽ báo lỗi hoặc cập nhật đơn cũ.
- **BRL-03 (Bóc tách dữ liệu AI):** Trích xuất thông tin cá nhân, học vấn, kỹ năng chính và năm kinh nghiệm lưu vào bảng `ai_parse_results`.
- **BRL-04 (Chấm điểm AI Match):** Tính điểm % phù hợp và tóm tắt lý do (Rationale). Điểm >= 60% chuyển sang vòng Phỏng vấn/Xem xét; dưới 60% xếp vào luồng Từ chối.
- **BRL-05 (Độ trễ gửi Email từ chối):** Email từ chối tự động không gửi ngay lập tức mà hoãn lại từ 12 - 24 giờ (Delay Buffer).
- **BRL-08 (Tính điểm Scorecard):** Tính điểm trung bình có trọng số từ các tiêu chí đánh giá của các giám khảo phỏng vấn.

## 4. Hướng dẫn Lập trình (Coding Standards)
- Luôn kiểm tra tính tương thích TypeScript, không dùng `any` bừa bãi.
- Giữ cấu trúc component rõ ràng, tách biệt logic API và giao diện UI.
- Viết mã xử lý lỗi rõ ràng (Try/Catch, hiển thị Toast thông báo cho người dùng).
