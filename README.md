# 🎯 ReCoverX Career - Hệ thống Quản lý Tuyển dụng (ATS)
## Dữ liệu Toàn bộ Phiên làm việc & Tài liệu Kỹ thuật

> **Mã định danh phiên làm việc gốc (Source Conversation ID):** `8a254095-a9f4-4286-9307-fe701b5b5a78`  
> **Thời gian thực hiện phân tích:** 08/11/2026 - 11/11/2026  
> **Tổng số lượt tương tác:** 102 steps  
> **Thư mục lưu trữ dự án:** `D:\ATS project`

---

## 📁 Cấu trúc Thư mục Dự án

```text
D:\ATS project/
├── README.md                                    # Tài liệu tổng quan dự án & chỉ mục tập tin
├── CHAT_HISTORY.md                              # Toàn bộ lịch sử trò chuyện chi tiết (102 steps)
│
├── docs/                                        # Bộ tài liệu đặc tả nghiệp vụ & kỹ thuật chi tiết
│   ├── 01_BRD_Original.md                       # Bản BRD gốc do người dùng tải lên
│   ├── 02_BRD_Updated_Full.md                   # Toàn văn BRD cập nhật hợp nhất đầy đủ
│   ├── 03_BPMN_As_Is_and_To_Be.md               # Quy trình As-Is & To-Be (chuẩn BPMN 2.0 & SOP)
│   ├── 04_FDD_and_Use_Case_List.md              # Sơ đồ FDD, danh sách FR và 7 Use Case cốt lõi
│   ├── 05_Use_Case_Specifications.md            # Bản đặc tả chi tiết dạng bảng (UC-01 đến UC-05)
│   ├── 06_Dynamic_Models_Activity_Sequence_State.md # State Machine, Swimlane Activity & 4 Sequence Diagrams
│   ├── 07_Database_Design_ERD.md                # Thiết kế CSDL PostgreSQL, Data Dictionary, mã SQL DDL, ERD Draw.io & Mermaid
│   ├── 08_NonFunctional_and_Permissions.md      # Ma trận phân quyền RBAC & Yêu cầu phi chức năng (NFR)
│   ├── 09_Technical_Setup_and_Antigravity_Guide.md # Định hướng Frontend, Clone Dashboard & Hướng dẫn thiết lập Antigravity CI
│   └── 10_Scope_and_System_Comparison.md        # Bản phân định In/Out-Scope, hệ thống clone & so sánh điểm hơn/kém
│
├── media/                                       # Toàn bộ 14 hình ảnh sơ đồ & tệp đính kèm gốc
│   ├── media_1794120545429_f88cf311.png         # Sơ đồ As-Is vẽ tay ban đầu
│   ├── media_1794122049232_eed6d462.png         # Sơ đồ As-Is hiệu chỉnh lần 1
│   ├── media_1794123728379_fc258178.png         # Sơ đồ As-Is hoàn thiện
│   ├── media_1794128176475_45763b00.png         # Sơ đồ To-Be phác thảo
│   ├── media_1794128522818_5c0509af.png         # Sơ đồ To-Be hoàn chỉnh
│   ├── media_1794140899553_825e7d95.png         # Sơ đồ UC-01
│   ├── media_1794141059009_c909493d.png         # Sơ đồ UC-01 & UC-02
│   ├── media_1794141359783_3ed746bd.png         # Template bảng đặc tả chuẩn BA
│   ├── media_1794141685181_0df5ac8c.png         # Sơ đồ UC-03
│   ├── media_1794141906077_59b44b76.png         # Sơ đồ UC-03 hiệu chỉnh
│   ├── media_1794142185408_d39d1cdf.png         # Sơ đồ UC-04
│   ├── media_1794142468418_01d2dd7c.png         # Sơ đồ UC-05
│   ├── media_1794143664055_378c39ac.png         # Sơ đồ Máy trạng thái (State Machine)
│   └── media_1794147297222_b86539a0.png         # Sơ đồ Tuần tự SD-02
│
└── raw_logs/                                    # Nhật ký giao tiếp gốc hệ thống
    ├── transcript.jsonl                         # File log tóm tắt gọn
    └── transcript_full.jsonl                    # File log đầy đủ dữ liệu gốc (Full Context)
```

---

## 📌 Tóm tắt Các Quyết định Trọng yếu của Hệ thống ATS

### 1. Phạm vi & Điểm mới trong BRD
- **Cổng Ứng viên (Candidate Portal):** Ứng viên trực tiếp nộp CV qua giao diện Web, hệ thống tự động khử trùng lặp (Deduplication) dựa trên Email và Số điện thoại.
- **Bóc tách hồ sơ tự động (AI Parsing):** Trích xuất thông tin học vấn, kỹ năng, kinh nghiệm từ file PDF/Docx.
- **Sàng lọc tự động bằng AI (AI Automated Screening):** Chấm điểm độ phù hợp (Match Score % và Rationale) đối chiếu với mô tả công việc (JD).
- **Gửi Email từ chối tự động có cơ chế Delay:** Tự động gửi thư từ chối sau khoảng thời gian hoãn (Delay Buffer 12 - 24 giờ) để tạo trải nghiệm ứng tuyển nhân văn.

### 2. Danh mục 7 Use Case Cốt lõi (In-Scope)
| Mã UC | Tên Use Case | Tác nhân chính (Actors) |
| :--- | :--- | :--- |
| **UC-01** | Tạo & Quản lý Tin tuyển dụng (Job Posting) | HR, Hiring Manager |
| **UC-02** | Nộp hồ sơ Trực tuyến & Thu thập CV Đa nguồn | Ứng viên, HR |
| **UC-03** | Bóc tách & Sàng lọc CV Tự động bằng AI | Hệ thống AI, HR |
| **UC-04** | Đặt lịch Phỏng vấn & Đánh giá bằng Scorecard | HR, Hiring Manager, Ứng viên |
| **UC-05** | Phê duyệt Tuyển chọn, Phát hành Offer & Onboarding | Hiring Manager, HR, Giám đốc, Ứng viên |
| **UC-06** | Quản lý Kho Dữ liệu Tài năng (Talent Pool & CRM) | HR |
| **UC-07** | Báo cáo Phân tích Tuyển dụng (Recruitment Analytics) | HR Manager, Ban Giám đốc |

### 3. Kiến trúc Dữ liệu Đề xuất (PostgreSQL)
- `users`: Tài khoản nội bộ và phân quyền RBAC.
- `jobs`: Tin tuyển dụng và tiêu chí chấm điểm của JD.
- `candidates`: Hồ sơ ứng viên cơ bản (Email, Phone, Deduplication key).
- `applications`: Đơn ứng tuyển theo từng Job, lưu trạng thái Kanban.
- `ai_parse_results`: Dữ liệu JSON bóc tách từ CV.
- `ai_match_scores`: Điểm % match và giải trình AI.
- `interviews`: Lịch phỏng vấn đa vòng.
- `evaluation_scorecards`: Phiếu đánh giá có trọng số của người phỏng vấn.

### 4. Môi trường Máy chủ & Công nghệ Sẵn sàng
- **Node.js:** `v24.16.0`
- **NPM:** `11.5.1`
- **Git:** `2.50.1`
- **Chiến lược Frontend:** Tận dụng Dashboard UI mã nguồn mở hiện đại (Next.js / Tailwind CSS / shadcn/ui / Lucide Icons).
- **Quy trình Antigravity:** Sử dụng AI Assistant để sinh mã, kiểm thử và thiết lập quy tắc dự án tự động.
