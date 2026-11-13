# BẢNG TÌNH HUỐNG KIỂM THỬ THỰC HÀNH TOÀN DIỆN (FULL UAT TEST SCENARIOS GUIDE)
## Dự án: ReCoverX Career — Hệ thống Quản trị Tuyển dụng ATS

> **Dành cho:** Sinh viên / Chuyên viên Phân tích Nghiệp vụ (ITBA) tự kiểm tra và diễn tập thuyết trình Demo.  
> **Mục tiêu:** Từng bước thao tác thực tế trên giao diện để kiểm chứng 100% các Use Case (UC-00 đến UC-07) và các Quy tắc Nghiệp vụ cốt lõi (**BRL-01 đến BRL-10**).

---

## I. HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG TRONG 30 GIÂY

Trước khi bắt đầu kiểm thử, bạn mở cửa sổ Terminal/PowerShell tại thư mục dự án `D:\ATS project` và thực hiện:

1. **Khởi động máy chủ web:**
   ```bash
   npm run dev
   ```
2. Mở trình duyệt web (Chrome, Edge, Cốc Cốc) và truy cập:  
   👉 **`http://localhost:3000`**

3. **Chạy kiểm thử tự động 45 Test Cases backend:**
   ```bash
   npm test
   ```

---

## II. DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP NỘI BỘ (Xem thêm tại `ACCOUNTS.md`)

| Vai trò (Role) | Họ và tên | Email đăng nhập | Mật khẩu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Nguyễn Văn An | `admin@recoverx.career` | `Admin@123` | Toàn quyền cấu hình User, CSDL & Pipeline |
| **HR LEAD** | Nguyễn Thu Hà | `hr@recoverx.career` | `Hr@123456` | Quản trị Pipeline Kanban, Tạo Job, Duyệt CV |
| **HIRING MANAGER** | Trần Trọng Nhân | `techlead@recoverx.career` | `Manager@123` | Phỏng vấn chuyên môn & Chấm Scorecard |

---

## III. 14 KỊCH BẢN KIỂM THỬ THỦ CÔNG (UAT TEST CASES)

### 📌 KỊCH BẢN 1 (TC-AUTH-01): ĐĂNG NHẬP ADMIN & KIỂM TRA GIAO DIỆN CHUẨN
* **Mục tiêu:** Kiểm tra đăng nhập với quyền Quản trị viên tối cao.
* **Màn hình:** `http://localhost:3000/admin/login`
* **Các bước thực hiện:**
  1. Truy cập: `http://localhost:3000/admin/login`.
  2. Quan sát giao diện: Hoàn toàn sạch sẽ, không có Navbar và không lộ tên người dùng.
  3. Nhập Email: `admin@recoverx.career`.
  4. Nhập Mật khẩu: `Admin@123`.
  5. Bấm nút **"Đăng nhập hệ thống"**.
* **Kết quả mong đợi:**
  * Hệ thống chuyển hướng vào trang quản trị Pipeline.
  * Góc trên bên phải hiển thị tên: **Nguyễn Văn An**, huy hiệu xanh lá: **ADMIN**.
  * Trên thanh Menu xuất hiện tab **"Quản trị User (Admin)"** (đúng theo phân quyền RBAC).

---

### 📌 KỊCH BẢN 2 (TC-AUTH-02): KIỂM TRA PHÂN QUYỀN RBAC (HR LEAD KHÔNG THẤY USER ADMIN)
* **Mục tiêu:** Kiểm chứng ma trận phân quyền RBAC: HR Lead không được quyền can thiệp vào tài khoản User.
* **Các bước thực hiện:**
  1. Bấm nút icon **Đăng xuất (LogOut)** ở góc phải màn hình ➔ Hệ thống quay về `/admin/login`.
  2. Nhập Email: `hr@recoverx.career`, Mật khẩu: `Hr@123456`.
  3. Bấm **"Đăng nhập hệ thống"**.
* **Kết quả mong đợi:**
  * Tên góc phải hiển thị: **Nguyễn Thu Hà**, huy hiệu xanh dương: **HR LEAD**.
  * Tab **"Quản trị User (Admin)"** trên thanh Navbar **TỰ ĐỘNG BIẾN MẤT**.

---

### 📌 KỊCH BẢN 3 (TC-BRL-AUTH-01): CHẶN TẠO MẬT KHẨU YẾU (< 8 KÝ TỰ)
* **Mục tiêu:** Kiểm chứng quy tắc bảo mật **BRL-Auth** và UI/UX viền đỏ báo lỗi.
* **Màn hình:** `http://localhost:3000/admin/users`
* **Các bước thực hiện:**
  1. Đăng nhập quyền **ADMIN** và vào menu **"Quản trị User (Admin)"**.
  2. Bấm vào nút **`+ Thêm Tài khoản Mới`**.
  3. Nhập Họ tên: `Lê Thử Nghiệm`, Email: `test.brl@recoverx.career`.
  4. Tại ô Mật khẩu: Gõ **`12345`** (dưới 8 ký tự).
  5. Bấm **"Tạo Tài Khoản"**.
* **Kết quả mong đợi:**
  * Ô Mật khẩu lập tức viền đỏ (`border-red-500 bg-red-50/20`).
  * Dòng chữ thông báo lỗi màu đỏ xuất hiện ngay bên dưới ô: *"Mật khẩu phải có tối thiểu 8 ký tự theo BRL-Auth"*.

---

### 📌 KỊCH BẢN 4 (TC-KANBAN-01): KANBAN 5 CỘT & CẢNH BÁO VI PHẠM SLA (BRL-07)
* **Mục tiêu:** Kiểm tra giao diện Kanban kéo thả 5 cột và tính năng phát hiện vi phạm SLA (Cột NEW > 48h, SCREENING > 72h).
* **Màn hình:** `http://localhost:3000/admin/pipeline`
* **Các bước thực hiện:**
  1. Vào menu **"Pipeline Tuyển dụng"**.
  2. Quan sát 5 cột: **Mới tiếp nhận (NEW)**, **Sàng lọc tiêu chuẩn (SCREENING)**, **Phỏng vấn (INTERVIEW)**, **Tuyển chọn (HIRED)**, **Từ chối (REJECTED)**.
  3. Kiểm tra các thẻ ứng viên: Thẻ nào có thời gian tồn đọng quá hạn sẽ có nhãn vi phạm SLA màu đỏ nổi bật:  
     ⚠️ *Tồn đọng 55h (Quá hạn 48h)* hoặc *Sàng lọc 80h (Quá hạn 72h)*.
* **Kết quả mong đợi:** Nhãn vi phạm SLA BRL-07 hiển thị chuẩn xác giúp HR nhận diện hồ sơ trễ hạn ngay lập tức.

---

### 📌 KỊCH BẢN 5 (TC-BRL-06): STAGE GATE RULE — CHẶN KÉO SANG HIRED KHI THIẾU SCORECARD
* **Mục tiêu:** Kiểm tra quy tắc cổng chặn **BRL-06**: Tuyệt đối không cho phép tuyển chọn ứng viên nếu chưa có ít nhất 01 phiếu đánh giá Scorecard từ Hiring Manager.
* **Các bước thực hiện:**
  1. Trên bảng Kanban, tìm một ứng viên chưa có Scorecard (ví dụ ứng viên ở cột NEW hoặc INTERVIEW chưa chấm điểm).
  2. Dùng chuột kéo thẻ ứng viên này thả vào cột **"Tuyển chọn (HIRED)"**.
* **Kết quả mong đợi:**
  * Hệ thống **CHẶN LẠI NGAY LẬP TỨC** và trả thẻ ứng viên về cột ban đầu (Rollback UI).
  * Banner thông báo màu đỏ hiển thị trên đầu bảng:  
    *"Chặn chuyển trạng thái (Quy tắc Nghiệp vụ ATS): Không thể chuyển sang giai đoạn HIRED: Ứng viên cần có ít nhất 01 phiếu đánh giá Scorecard hoàn tất từ Hiring Manager theo quy tắc BRL-06."*

---

### 📌 KỊCH BẢN 6 (TC-BRL-05): DELAY BUFFER 12-24H CHO EMAIL TỪ CHỐI
* **Mục tiêu:** Kiểm tra cơ chế hoãn gửi thư từ chối để bảo vệ tâm lý ứng viên và hình ảnh nhà tuyển dụng.
* **Các bước thực hiện:**
  1. Kéo một ứng viên bất kỳ thả vào cột **"Từ chối (Rejected)"**.
  2. Quan sát thông báo thành công.
* **Kết quả mong đợi:**
  * Xuất hiện thông báo: *"Đã chuyển sang Từ chối. Email thông báo từ chối đã được lên lịch hoãn 12 tiếng theo quy tắc BRL-05."*
  * Thẻ ứng viên chuyển vào cột REJECTED và lưu trường `emailScheduledAt = Hiện tại + 12 giờ`.

---

### 📌 KỊCH BẢN 7 (TC-DRAWER-01): XEM CHI TIẾT ỨNG VIÊN (CANDIDATE DRAWER 3 TABS)
* **Mục tiêu:** Khám phá Slide-over Drawer xem chi tiết hồ sơ, bóc tách AI và lịch sử luân chuyển.
* **Các bước thực hiện:**
  1. Nhấp chuột vào bất kỳ thẻ ứng viên nào trên bảng Kanban.
  2. Drawer bên phải trượt ra gồm 3 Tab:
     * **Tab 1 - Tổng quan AI:** Hiển thị Điểm Match Score %, Rationale giải thích, Kỹ năng phù hợp/thiếu, Kinh nghiệm.
     * **Tab 2 - Nội dung CV gốc:** Xem toàn bộ văn bản thô bóc tách từ file PDF/DOCX.
     * **Tab 3 - Lịch sử & Scorecard:** Xem các phiếu đánh giá và Audit Trail thời gian thực.
* **Kết quả mong đợi:** Dữ liệu hiển thị mượt mà, đầy đủ thông tin phục vụ ra quyết định tuyển dụng.

---

### 📌 KỊCH BẢN 8 (TC-SCORECARD-01): TẠO PHIẾU ĐÁNH GIÁ SCORECARD TRỌNG SỐ (BRL-08)
* **Mục tiêu:** Chấm điểm phỏng vấn với công thức trọng số chuẩn: 40% Chuyên môn, 30% Giao tiếp, 30% Văn hóa.
* **Các bước thực hiện:**
  1. Trong Candidate Drawer của ứng viên, chọn **Tab 3: Lịch sử & Scorecard**.
  2. Bấm nút màu tím: **`+ Chấm Điểm Scorecard (BRL-08)`**.
  3. Modal chấm điểm mở ra:
     * Chuyên môn (40%): Chọn **5 sao**.
     * Giao tiếp (30%): Chọn **4 sao**.
     * Văn hóa (30%): Chọn **4 sao**.
     * Quan sát Điểm tổng hợp tự động tính: `(5*0.4) + (4*0.3) + (4*0.3) = 4.40 / 5.0★`.
     * Chọn Khuyến nghị: **"🌟 Xuất sắc — Tuyển dụng ngay (Strong Hire)"**.
     * Nhập nhận xét: *"Ứng viên có tư duy kỹ thuật xuất sắc, giao tiếp tự tin."*
  4. Bấm **"Lưu Phiếu Đánh Giá (Mở khóa Hired)"**.
* **Kết quả mong đợi:**
  * Phiếu đánh giá được lưu vào cơ sở dữ liệu.
  * Lúc này ứng viên đã có Scorecard, bạn có thể chuyển ứng viên sang cột **Tuyển chọn (HIRED)** thành công mà không còn bị chặn bởi BRL-06!

---

### 📌 KỊCH BẢN 9 (TC-PUBLIC-01): CỔNG TUYỂN DỤNG CÔNG KHAI (PUBLIC CAREERS)
* **Mục tiêu:** Ứng viên bên ngoài xem danh sách việc làm mà không cần đăng nhập.
* **Đường dẫn:** `http://localhost:3000/jobs`
* **Các bước thực hiện:**
  1. Mở tab trình duyệt ẩn danh hoặc truy cập `http://localhost:3000/jobs`.
  2. Quan sát danh sách các vị trí tuyển dụng đang mở (`Senior Frontend Engineer`, `Fullstack Engineer`,...).
  3. Bấm nút **"Ứng tuyển ngay"** tại một vị trí để vào trang nộp hồ sơ chi tiết (`/jobs/1`).
* **Kết quả mong đợi:** Giao diện công khai hiện đại, chuẩn UI/UX, hiển thị rõ ràng mô tả công việc (JD), kỹ năng yêu cầu và quyền lợi.

---

### 📌 KỊCH BẢN 10 (TC-BRL-01): KIỂM TRA ĐỊNH DẠNG VÀ DUNG LƯỢNG TỆP CV (BRL-01)
* **Mục tiêu:** Kiểm tra hệ thống tự động chặn tệp không phải PDF/DOCX hoặc tệp quá 10MB.
* **Màn hình:** `http://localhost:3000/jobs/1`
* **Các bước thực hiện:**
  1. Điền Họ tên: `Trần Văn Thử`, Email: `thu.tran@gmail.com`, SĐT: `0987654321`.
  2. Tại khung tải file CV: Thử chọn một file ảnh (.png, .jpg) hoặc file thực thi (.exe).
* **Kết quả mong đợi:**
  * Khung tải file lập tức viền đỏ (`border-red-400 bg-red-50`).
  * Thông báo lỗi hiển thị rõ: *"Chỉ chấp nhận tệp .pdf hoặc .docx theo quy tắc BRL-01"*.

---

### 📌 KỊCH BẢN 11 (TC-BRL-02): KHỬ TRÙNG LẶP HỒ SƠ TRONG VÒNG 30 NGÀY (DEDUPLICATION)
* **Mục tiêu:** Kiểm tra cơ chế ngăn chặn ứng viên nộp hồ sơ lặp lại cho cùng 1 vị trí trong 30 ngày.
* **Màn hình:** `http://localhost:3000/jobs/1`
* **Các bước thực hiện:**
  1. Nhập thông tin của một ứng viên đã nộp hồ sơ trước đó cho vị trí này (ví dụ: Email `quoc.bao@gmail.com` hoặc SĐT `0901234567`).
  2. Chọn file CV hợp lệ (.pdf hoặc .docx).
  3. Bấm **"Nộp hồ sơ ngay & Kiểm tra Match AI"**.
* **Kết quả mong đợi:**
  * Hệ thống chặn nộp hồ sơ trùng.
  * Cả hai ô Email và Số điện thoại đều bị **viền đỏ**.
  * Dòng lỗi chi tiết xuất hiện: *"Email này đã ứng tuyển vị trí này trong 30 ngày qua (Quy tắc BRL-02)"*.

---

### 📌 KỊCH BẢN 12 (TC-AI-01): NỘP CV THÀNH CÔNG & KẾT QUẢ SÀNG LỌC AI (LAYER 2 HYBRID)
* **Mục tiêu:** Trải nghiệm quy trình bóc tách CV bằng AI và chấm điểm độ phù hợp (Match Score).
* **Màn hình:** `http://localhost:3000/jobs/1`
* **Các bước thực hiện:**
  1. Nhập ứng viên mới: Họ tên: `Lê Quốc Cường`, Email: `cuong.le@gmail.com`, SĐT: `0918889999`.
  2. Tải lên một tệp CV (PDF hoặc DOCX).
  3. Bấm **"Nộp hồ sơ ngay & Kiểm tra Match AI"**.
  4. Quan sát nút bấm chuyển sang trạng thái xoay vòng: *"Đang tải lên & Phân tích CV qua AI..."*.
* **Kết quả mong đợi:**
  * Xuất hiện thẻ kết quả thành công màu xanh lá:
    * Huy hiệu **Match Score %** (xanh lá nếu >= 75%, vàng nếu >= 60%).
    * Đoạn tóm tắt lý do chấm điểm (AI Match Rationale) bằng tiếng Việt.
    * Danh sách các kỹ năng của ứng viên khớp với JD.
  * Mở trang Pipeline nội bộ (`/admin/pipeline`): Hồ sơ của Lê Quốc Cường đã tự động xuất hiện ở cột **Mới tiếp nhận (NEW)**!

---

### 📌 KỊCH BẢN 13 (TC-TALENT-01): TÁI SỬ DỤNG HỒ SƠ ỨNG VIÊN (RE-POOLING UC-06)
* **Mục tiêu:** Khôi phục một ứng viên tiềm năng bị loại ở vị trí cũ để tuyển dụng cho vị trí mới.
* **Màn hình:** `http://localhost:3000/admin/talent-pool`
* **Các bước thực hiện:**
  1. Vào menu **"Kho Nhân tài"** trên Navbar.
  2. Quan sát bảng tổng hợp toàn bộ ứng viên.
  3. Tại dòng ứng viên đã bị `REJECTED`, bấm nút **`Khôi phục`** (icon xoay vòng màu tím).
  4. Modal Re-pooling mở ra: Chọn vị trí công việc mới muốn chuyển ứng viên vào.
  5. Bấm **"Xác nhận Khôi phục"**.
* **Kết quả mong đợi:**
  * Hồ sơ ứng viên được tạo một đợt ứng tuyển mới ở vòng **SCREENING** cho vị trí mới.
  * Không bắt ứng viên phải nộp lại CV từ đầu.
  * Lịch sử luân chuyển ghi nhận AuditLog: `action: "TALENT_REPOOL"`.

---

### 📌 KỊCH BẢN 14 (TC-EXPORT-01): XUẤT BÁO CÁO TUYỂN DỤNG RA EXCEL (UC-07)
* **Mục tiêu:** Tải về tệp CSV chứa toàn bộ dữ liệu tuyển dụng để báo cáo ban giám đốc, hỗ trợ chuẩn font tiếng Việt có dấu.
* **Màn hình:** `http://localhost:3000/admin/talent-pool`
* **Các bước thực hiện:**
  1. Tại góc trên bên phải trang Kho Nhân tài, bấm nút màu xanh lá: **`Xuất Báo Cáo CSV (Excel)`**.
  2. Trình duyệt tự động tải xuống tệp: `recoverx_talent_report_YYYY-MM-DD.csv`.
  3. Mở tệp bằng Microsoft Excel, Google Sheets hoặc Notepad.
* **Kết quả mong đợi:**
  * Toàn bộ font tiếng Việt có dấu hiển thị chuẩn 100% không bị lỗi font (nhờ chuẩn UTF-8 BOM `\uFEFF`).
  * Có đầy đủ các cột: Mã đơn, Họ tên, Email, SĐT, Vị trí, Điểm AI Match, Điểm Scorecard TB, Khuyến nghị,...

---

## IV. BẢNG TỔNG KẾT NGHIỆP VỤ BRL & USE CASES ĐÃ HOÀN TẤT

| Mã Quy tắc / UC | Tên Nghiệp vụ | Vị trí kiểm chứng | Trạng thái |
| :--- | :--- | :--- | :---: |
| **UC-00 / BRL-Auth** | Xác thực phân quyền & Mật khẩu >= 8 ký tự | `/admin/login`, `/admin/users` | ✅ Đã kiểm chứng |
| **UC-01 & UC-02** | Xem JD công khai & Nộp hồ sơ CV | `/jobs`, `/jobs/[id]` | ✅ Đã kiểm chứng |
| **UC-03 / BRL-03** | AI Phân tích CV & Chấm điểm Match Score | `/api/applications`, Candidate Drawer | ✅ Đã kiểm chứng |
| **UC-04 / BRL-07** | Kanban 5 cột & Cảnh báo trễ hạn SLA | `/admin/pipeline` | ✅ Đã kiểm chứng |
| **BRL-01** | Chỉ nhận PDF/DOCX, Dung lượng tối đa 10MB | Form tải file CV | ✅ Đã kiểm chứng |
| **BRL-02** | Khử trùng lặp Email + Phone trong 30 ngày | API nộp hồ sơ | ✅ Đã kiểm chứng |
| **BRL-05** | Hoãn gửi email từ chối 12 - 24 giờ | Khi chuyển thẻ sang REJECTED | ✅ Đã kiểm chứng |
| **BRL-06** | Stage Gate: Chặn HIRED nếu thiếu Scorecard | Drag & Drop Kanban | ✅ Đã kiểm chứng |
| **BRL-08** | Scorecard: (Tech×0.4) + (Comm×0.3) + (Cult×0.3) | Modal chấm điểm Scorecard | ✅ Đã kiểm chứng |
| **BRL-09** | Quota giới hạn: Tối đa 3 Jobs trong 90 ngày | Kiểm tra lịch sử nộp | ✅ Đã kiểm chứng |
| **UC-06** | Kho nhân tài & Tái sử dụng (Re-pooling) | `/admin/talent-pool` | ✅ Đã kiểm chứng |
| **UC-07** | Xuất báo cáo CSV UTF-8 mở bằng Excel | Nút Xuất Báo Cáo | ✅ Đã kiểm chứng |

---

> 💡 **Khuyến nghị cho buổi Thuyết trình:**  
> Bạn có thể mở đồng thời 2 tab trình duyệt:  
> - **Tab 1:** Cổng ứng viên `http://localhost:3000/jobs` để mô phỏng ứng viên nộp hồ sơ có AI phân tích trực tiếp.  
> - **Tab 2:** Cổng nội bộ `http://localhost:3000/admin/pipeline` để trình chiếu thẻ ứng viên vừa nộp tự động nhảy vào cột NEW và diễn tập kéo thả Kanban kèm các quy tắc nghiệp vụ BRL-06, BRL-05, BRL-07!
