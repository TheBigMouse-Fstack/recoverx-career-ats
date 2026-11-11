# QUY CHUẨN THIẾT KẾ UI/UX & XỬ LÝ LỖI BIỂU MẪU (UI/UX & FORM VALIDATION GUIDELINES)

> **Dự án:** ReCoverX Career — Applicant Tracking System (ATS)  
> **Mục tiêu:** Thiết lập bộ tiêu chuẩn bắt buộc cho toàn bộ giao diện Frontend, ngăn chặn triệt để các lỗi trải nghiệm người dùng như: không đánh dấu đỏ ô nhập sai, thông báo lỗi chung chung mập mờ, không rõ lý do trùng lặp dữ liệu.

---

## I. QUY CHUẨN 1: ĐÁNH DẤU Ô NHẬP LIỆU BỊ LỖI (FIELD-LEVEL ERROR HIGHLIGHTING)

Mọi ô nhập liệu (`input`, `textarea`, `select`) khi người dùng nhập sai, nhập thiếu hoặc vi phạm nghiệp vụ **BẮT BUỘC** phải tuân theo 3 yếu tố trực quan:

```text
+-----------------------------------------------------------------------------------+
|  Email tài khoản *                                                                |
|  [ ✉ | hr_invalid_email                                           ] (Viền đỏ rực) |
|  ⚠ Email không đúng định dạng (Ví dụ: name@company.com)         (Chữ đỏ ngay dưới)|
+-----------------------------------------------------------------------------------+
```

### 1. Cấu hình Tailwind CSS chuẩn cho trạng thái Lỗi:
* **Trạng thái bình thường:**  
  `border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-900 bg-white`
* **Trạng thái LỖI (Error State):**  
  `border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/30 text-red-900 placeholder:text-red-300`
* **Dòng thông báo lỗi ngay dưới chân ô nhập (Inline Error Text):**  
  Phải nằm ngay bên dưới ô nhập lỗi, cỡ chữ nhỏ `text-xs text-red-600 mt-1 flex items-center gap-1 font-medium`.

---

## II. QUY CHUẨN 2: THÔNG ĐIỆP LỖI RÕ RÀNG & HÀNH ĐỘNG ĐƯỢC (ACTIONABLE ERROR MESSAGING)

Tuyệt đối **NGHIÊM CẤM** sử dụng các câu thông báo chung chung, vô nghĩa như:
- ❌ *"Có lỗi xảy ra."*
- ❌ *"Dữ liệu không hợp lệ."*
- ❌ *"Đăng nhập thất bại."*
- ❌ *"Thao tác thất bại."*

### Bảng Quy chuẩn Thông điệp Lỗi Bắt buộc:

| Trường / Nghiệp vụ | Lỗi phát sinh | ❌ Thông báo CẤM dùng | ✅ Thông báo CHUẨN BẮT BUỘC |
| :--- | :--- | :--- | :--- |
| **Email đăng nhập** | Email không tồn tại trong DB | "Lỗi đăng nhập" | *"Không tìm thấy tài khoản với email này trong hệ thống."* |
| **Mật khẩu đăng nhập**| Sai mật khẩu | "Sai thông tin" | *"Mật khẩu không chính xác. Vui lòng kiểm tra lại."* |
| **Tài khoản bị khóa**| `isActive = false` | "Không đăng nhập được" | *"Tài khoản này đã bị Quản trị viên tạm khóa. Vui lòng liên hệ Admin."* |
| **Tạo User - Mật khẩu**| Mật khẩu < 8 ký tự | "Mật khẩu yếu" | *"Mật khẩu hiện có {n} ký tự. Yêu cầu tối thiểu 8 ký tự theo quy tắc BRL-Auth."* |
| **Tạo User - Email** | Email đã được nhân viên khác dùng | "Trùng lặp dữ liệu" | *"Email '{email}' đã được đăng ký bởi nhân viên khác trong hệ thống."* |
| **Nộp CV - Tệp tin** | Tệp tin > 10MB | "File quá lớn" | *"Tệp '{file_name}' nặng {size}MB, vượt quá giới hạn cho phép (Tối đa 10MB theo BRL-01)."* |
| **Nộp CV - Định dạng**| Tệp .png, .exe, .zip | "Sai định dạng" | *"Định dạng tệp không hợp lệ. Hệ thống chỉ chấp nhận tệp .pdf hoặc .docx."* |
| **Nộp CV - Trùng lặp**| Đã nộp cùng Job trong 30 ngày | "Hồ sơ bị trùng" | *"Bạn đã nộp hồ sơ cho vị trí '{job_title}' vào ngày {date} (trong vòng 30 ngày qua theo BRL-02). Vui lòng không nộp lại liên tiếp."* |
| **Kéo sang HIRED** | Chưa có phiếu Scorecard | "Không kéo được" | *"Không thể chuyển sang HIRED: Ứng viên cần ít nhất 01 phiếu đánh giá Scorecard hoàn tất từ Hiring Manager (BRL-06)."* |

---

## III. QUY CHUẨN 3: XỬ LÝ KHỬ TRÙNG LẶP DỮ LIỆU (DEDUPLICATION UI/UX)

Trùng lặp là nghiệp vụ trọng tâm của hệ thống ATS. Khi phát hiện trùng lặp:
1. **Tại Cổng Ứng viên:**
   - Đánh viền đỏ cả ô Email và ô Số điện thoại.
   - Hiển thị hộp thông báo màu hổ phách/đỏ: Nêu rõ ứng viên đã nộp ngày nào, vị trí nào.
2. **Tại Màn hình Quản trị HR:**
   - Trên thẻ ứng viên hoặc Drawer, nếu là hồ sơ từng nộp trong quá khứ (> 30 ngày), hiển thị huy hiệu:  
     `[Hồ sơ Tái ứng tuyển - Đợt 2]` để HR biết ngay đây là ứng viên cũ quay lại.

---

## IV. QUY CHUẨN 4: TRẠNG THÁI TƯƠNG TÁC (INTERACTIVE FEEDBACK & STATES)

1. **Trạng thái Đang xử lý (Loading State):**
   - Khi bấm bất kỳ nút Submit nào (Đăng nhập, Tạo User, Nộp CV, Chấm Scorecard):
     - Nút bấm phải bị **vô hiệu hóa (`disabled`)**, giảm độ mờ (`opacity-60`).
     - Hiển thị biểu tượng xoay (Spinner) và đổi chữ hành động:
       - *"Đăng nhập"* ➔ *"Đang xác thực tài khoản..."*
       - *"Nộp hồ sơ"* ➔ *"Đang bóc tách CV bằng AI..."*
       - *"Tạo tài khoản"* ➔ *"Đang lưu vào CSDL..."*
2. **Trạng thái Trống (Empty State):**
   - Khi bảng/danh sách chưa có dữ liệu (ví dụ không tìm thấy User, không có ứng viên ở cột Kanban):
     - Tuyệt đối không để màn hình trắng trơn.
     - Phải hiển thị icon minh họa mờ + dòng thông báo lịch sự + nút hành động (ví dụ: *"Chưa có ứng viên nào ở vòng này"*).
3. **Cách ly Ngữ cảnh Tuyệt đối (Context Isolation):**
   - Các màn hình trước đăng nhập (`/admin/login`, `/jobs`) **tuyệt đối không được render các thành phần của trang sau đăng nhập** (như thanh Navbar Admin, thông tin tài khoản nội bộ).

---

## V. CHECKLIST KIỂM SOÁT KHI CODE BẤT KỲ MÀN HÌNH NÀO

Trước khi bàn giao bất kỳ màn hình nào, lập trình viên/Agent phải tự rà soát:
- [ ] Mọi trường bắt buộc đều có dấu sao đỏ (`*`).
- [ ] Khi submit để trống hoặc nhập sai, ô đó có viền đỏ rực và chữ đỏ chú thích ngay dưới chân không?
- [ ] Thông báo lỗi có giải thích rõ nguyên nhân và cách sửa không?
- [ ] Khi gọi API, nút bấm có bị khóa và hiện spinner loading không?
- [ ] Các trường dữ liệu trùng lặp có hiển thị rõ đối tượng bị trùng không?
