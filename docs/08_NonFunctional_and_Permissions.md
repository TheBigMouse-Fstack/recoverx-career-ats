# MA TR?N PH?N QUY?N (RBAC) & Y?U C?U PHI CH?C N?NG (NFR)

> **D? ?n:** ReCoverX Career - ATS

---

Dưới đây là tài liệu chi tiết cho **Nhóm Phân quyền (Mục 13)** và **Yêu cầu Phi chức năng (Mục 14)** của hệ thống **ReCoverX Career (ATS)** theo chuẩn kỹ thuật phần mềm:

---

# MỤC 13: MA TRẬN PHÂN QUYỀN (RBAC - ROLE-BASED ACCESS CONTROL)

### 1. Định nghĩa các Vai trò người dùng (User Roles)
1. **Ứng viên (Candidate / Public):** Người dùng bên ngoài, truy cập công khai vào Cổng tuyển dụng để xem tin và nộp hồ sơ, không cần tài khoản đăng nhập.
2. **Chuyên viên HR (Recruiter):** Người vận hành chính của hệ thống; quản lý toàn bộ vòng đời ứng viên, vị trí tuyển dụng, luân chuyển trạng thái và gửi thông báo.
3. **Quản lý chuyên môn (Hiring Manager):** Trưởng bộ phận hoặc người phỏng vấn; được phân quyền xem hồ sơ theo vị trí được chỉ định, tham gia chấm điểm phỏng vấn.
4. **Quản trị viên (Admin):** Quản lý toàn bộ cấu hình hệ thống, tài khoản người dùng, mẫu email và có quyền xóa dữ liệu vĩnh viễn (Hard Delete).

---

### 2. Bảng Ma trận Phân quyền chi tiết (RBAC Matrix)

> **Ký hiệu quyền hạn:**
> * **C (Create):** Quyền tạo mới / Tải lên.
> * **R (Read):** Quyền xem / Đọc dữ liệu.
> * **U (Update):** Quyền chỉnh sửa / Kéo-thả chuyển trạng thái.
> * **D (Delete):** Quyền xóa (Soft Delete: Ẩn/Xóa mềm; Hard Delete: Xóa vĩnh viễn).
> * **`-` :** Không có quyền truy cập.

| STT | Nhóm chức năng / Nghiệp vụ | 👤 Ứng viên (Public) | 👔 Chuyên viên HR | 💼 Hiring Manager | 🛠️ Quản trị viên (Admin) | Ghi chú ràng buộc bảo mật |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **I** | **Cổng ứng tuyển trực tuyến** | | | | | |
| 1 | Xem danh sách tin tuyển dụng & JD | **R** | **R** | **R** | **R** | Công khai |
| 2 | Nộp hồ sơ & Upload CV công khai | **C** | - | - | - | Bắt buộc reCAPTCHA |
| **II**| **Quản lý Vị trí tuyển dụng (Jobs)** | | | | | |
| 3 | Tạo & Chỉnh sửa JD tuyển dụng | - | **C, R, U** | **R** *(chỉ đọc)* | **C, R, U, D** | Manager chỉ xem vị trí của mình |
| 4 | Đóng / Mở đợt tuyển dụng (Status) | - | **U** | - | **U** | |
| **III**| **Tiếp nhận & Bóc tách hồ sơ (CV Intake)**| | | | | |
| 5 | Tải lên CV nội bộ (Bulk Upload) | - | **C** | - | **C** | Tối đa 50 file/lần |
| 6 | Xem trước tệp CV gốc (Preview) | - | **R** | **R** | **R** | Xem trực tiếp trên trình duyệt |
| 7 | Xác nhận gộp hồ sơ trùng lặp | - | **U** | - | **U** | Chỉ HR/Admin được gộp |
| **IV**| **Quản lý Pipeline Kanban** | | | | | |
| 8 | Xem bảng Kanban 5 cột | - | **R** | **R** *(bị giới hạn)* | **R** | Manager chỉ xem thẻ được gán |
| 9 | Kéo - thả chuyển cột trạng thái | - | **U** | **`-` (CẤM)** | **U** | **Manager tuyệt đối không được kéo** |
| 10 | Tìm kiếm & Lọc hồ sơ nâng cao | - | **R** | **R** | **R** | Tốc độ phản hồi < 3s |
| 11 | **Xem thông tin nhạy cảm (Mức lương)** | - | **R** | **`-` (ẨN)** | **R** | **Bảo mật lương: Manager bị che** |
| 12 | Luân chuyển vị trí (Repooling) | - | **C, U** | - | **C, U** | |
| **V** | **Đánh giá phỏng vấn (Scorecard)** | | | | | |
| 13 | Chấm điểm & Ghi nhận xét của mình | - | **C, R, U** | **C, R, U** | **R** | Thang điểm 1 - 5 sao |
| 14 | Sửa đánh giá của thành viên khác | - | **`-` (CẤM)** | **`-` (CẤM)** | **`-` (CẤM)** | **Chỉ được sửa phiếu của chính mình** |
| 15 | Xem điểm trung bình tổng hợp | - | **R** | **R** | **R** | Hệ thống tự động tính |
| **VI**| **Tự động hóa & Email** | | | | | |
| 16 | Cấu hình thời gian delay gửi email | - | **R** | - | **U** | Mặc định delay 12h |
| 17 | Hủy gửi email từ chối tự động | - | **U** | - | **U** | Kéo thẻ khỏi cột Rejected |
| **VII**| **Kho nhân tài & Quản trị dữ liệu** | | | | | |
| 18 | Tra cứu Kho nhân tài (Talent Pool) | - | **R** | - | **R** | |
| 19 | Xóa mềm hồ sơ (Soft Delete) | - | **D** *(Soft)* | - | **D** *(Soft)* | Ẩn hồ sơ khỏi Pipeline |
| 20 | Xóa vĩnh viễn hồ sơ (Hard Delete) | - | **`-` (CẤM)** | **`-` (CẤM)** | **D** *(Hard)* | Hoặc Hệ thống tự xóa sau 6 tháng |
| 21 | Xuất dữ liệu báo cáo (Excel/CSV) | - | **R** | - | **R** | Trích xuất theo bộ lọc |
| 22 | Xem nhật ký thao tác (Audit Log) | - | **R** | - | **R** | Theo dõi lịch sử người dùng |

---

# MỤC 14: YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

Tài liệu được phân loại theo tiêu chuẩn quốc tế **ISO/IEC 25010** với các chỉ số đo lường định lượng cụ thể:

### 1. Hiệu năng & Khả năng chịu tải (Performance & Scalability)

| Mã NFR | Tiêu chí | Mô tả yêu cầu kỹ thuật | Chỉ số đo lường (Metric / SLA) |
| :---: | :--- | :--- | :--- |
| **NFR-PER-01** | **Tốc độ phản hồi giao diện** | Thời gian phản hồi cho các tác vụ tra cứu, tìm kiếm từ khóa nâng cao và kéo-thả thẻ Kanban. | **≤ 3.0 giây** trong điều kiện mạng tiêu chuẩn. |
| **NFR-PER-02** | **Tốc độ bóc tách AI (AI Parsing)** | Thời gian đọc tệp CV (.pdf, .doc, .docx) và trích xuất dữ liệu hoàn chỉnh. | **≤ 5.0 giây/CV**. |
| **NFR-PER-03** | **Xử lý tải lên hàng loạt (Bulk Upload)** | Khả năng tiếp nhận và đưa vào hàng đợi xử lý ngầm (Task Queue) khi HR upload cùng lúc. | Tiếp nhận mượt mà **50 – 100 CV cùng lúc** mà không gây treo (freeze) trình duyệt. |
| **NFR-PER-04** | **Số lượng người dùng đồng thời** | Hỗ trợ đội ngũ tuyển dụng và ứng viên truy cập cùng một thời điểm. | Tối thiểu **100 người dùng nội bộ** và **500 ứng viên vãng lai** truy cập đồng thời. |

---

### 2. Độ sẵn sàng & Khả năng phục hồi (Availability & Reliability)

| Mã NFR | Tiêu chí | Mô tả yêu cầu kỹ thuật | Chỉ số đo lường (Metric / SLA) |
| :---: | :--- | :--- | :--- |
| **NFR-REL-01** | **Thời gian hoạt động (Uptime)** | Tỷ lệ hệ thống hoạt động liên tục, sẵn sàng phục vụ người dùng. | Đạt **≥ 99.5%** thời gian trong năm (ngoại trừ lịch bảo trì định kỳ có thông báo trước). |
| **NFR-REL-02** | **Sao lưu dữ liệu (Backup)** | Tự động sao lưu toàn bộ cơ sở dữ liệu PostgreSQL và cấu hình hệ thống. | Tự động sao lưu **hàng ngày (Daily at 01:00 AM)**, lưu trữ bản snapshot trong 30 ngày. |
| **NFR-REL-03** | **Chỉ số RPO & RTO** | RPO (Mất mát dữ liệu tối đa) và RTO (Thời gian khôi phục tối đa khi có sự cố thảm họa). | **RPO ≤ 24 giờ**, **RTO ≤ 02 giờ**. |

---

### 3. An toàn thông tin & Bảo mật (Security & Compliance)

| Mã NFR | Tiêu chí | Mô tả yêu cầu kỹ thuật | Phương pháp triển khai |
| :---: | :--- | :--- | :--- |
| **NFR-SEC-01** | **Mã hóa đường truyền** | Toàn bộ lưu lượng giao tiếp giữa Client và Server bắt buộc phải được mã hóa. | Sử dụng giao thức **HTTPS (TLS 1.3)** với chứng chỉ SSL hợp lệ. |
| **NFR-SEC-02** | **Mã hóa dữ liệu nghỉ (At-Rest)** | Tệp CV gốc và mật khẩu người dùng phải được bảo vệ nghiêm ngặt. | • Mật khẩu băm bằng **BCrypt (Work factor ≥ 12)**.<br>• Tệp CV trên S3 mã hóa bằng **AES-256 (SSE-S3)**. |
| **NFR-SEC-03** | **Bảo vệ chống Spam/DDoS** | Ngăn chặn bot tự động gửi hàng loạt file rác lên Cổng tuyển dụng công khai. | • Tích hợp **Google reCAPTCHA v3**.<br>• Giới hạn tần suất (**Rate Limiting: 5 requests/10 phút/IP**). |
| **NFR-SEC-04** | **Bảo mật phân quyền cấp hàng (RLS)** | Giấu các thông tin bảo mật theo phân quyền người dùng. | **Ẩn mức lương kỳ vọng** đối với tài khoản vai trò `HIRING_MANAGER`. |
| **NFR-SEC-05** | **Ghi vết kiểm toán (Audit Trail)** | Lưu vết toàn bộ hành vi thay đổi dữ liệu nhạy cảm hoặc luân chuyển trạng thái thẻ. | Tự động ghi vào bảng `audit_logs` gồm: `User ID`, `Action`, `Timestamp`, `IP Address`. Dữ liệu không được sửa/xóa. |

---

### 4. Tính khả dụng & Khả năng bảo trì (Usability & Maintainability)

| Mã NFR | Tiêu chí | Mô tả yêu cầu kỹ thuật | Tiêu chuẩn đánh giá |
| :---: | :--- | :--- | :--- |
| **NFR-USA-01** | **Tính tương thích đa thiết bị** | Cổng ứng tuyển dành cho ứng viên phải hiển thị tối ưu trên cả máy tính và điện thoại. | **Responsive 100%** trên các trình duyệt phổ biến (Chrome, Safari, Edge, Firefox) và Mobile screen (iOS, Android). |
| **NFR-USA-02** | **Độ dễ sử dụng** | Thao tác kéo-thả Kanban trực quan, thông báo phản hồi rõ ràng khi thành công hoặc có lỗi. | Nhân viên HR mới có thể sử dụng thành thạo sau **dưới 01 giờ đào tạo**. |
| **NFR-MNT-01** | **Kiến trúc mô hình hóa AI (Agnostic)** | Tách biệt tầng logic gọi AI qua Interface để dễ dàng thay đổi nhà cung cấp LLM. | Có thể chuyển đổi giữa **Google Gemini, OpenAI GPT, Claude** mà không phải viết lại code ứng dụng. |
| **NFR-MNT-02** | **Tài liệu API chuẩn hóa** | Toàn bộ API Backend được tài liệu hóa rõ ràng để phục vụ tích hợp và kiểm thử. | Sử dụng chuẩn **OpenAPI 3.0 / Swagger UI**. |

---

🎉 **Tuyệt vời!** Đến đây, bạn đã hoàn tất **12/16 mục** trong checklist của mình.

👉 **BƯỚC TIẾP THEO CẦN LÀM:**  
Chúng ta sẽ chuyển sang nhóm Giao diện:  
**Mục 11: Danh sách màn hình (SCR-xx)** + map Use Case và Vai trò sử dụng.

Bạn có muốn mình lên luôn **Danh sách các màn hình (SCR-01 đến SCR-xx)** cho hệ thống không?

