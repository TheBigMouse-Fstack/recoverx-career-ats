# BẢNG TÌNH HUỐNG KIỂM THỬ THỰC HÀNH (UAT TEST SCENARIOS GUIDE)
## Dự án: ReCoverX Career — Hệ thống ATS

> **Dành cho:** Sinh viên / Chuyên viên Phân tích Nghiệp vụ (ITBA) tự kiểm tra và diễn tập trước buổi Demo.  
> **Mục tiêu:** Từng bước thao tác thực tế trên giao diện để kiểm chứng tính năng khớp 100% với tài liệu đặc tả và các quy tắc nghiệp vụ (**BRL**).

---

## I. HƯỚNG DẪN KHỞI ĐỘNG HỆ THỐNG TRONG 30 GIÂY

Trước khi bắt đầu kiểm thử, bạn mở cửa sổ dòng lệnh (Terminal/PowerShell) tại thư mục `D:\ATS project` và thực hiện:

1. **Khởi động máy chủ web:**
   ```bash
   npm run dev
   ```
2. Mở trình duyệt web (Chrome, Edge) và truy cập địa chỉ:  
   👉 **`http://localhost:3000`**

---

## II. DANH SÁCH 7 KỊCH BẢN KIỂM THỬ THỦ CÔNG (MANUAL TEST CASES)

### 📌 KỊCH BẢN 1 (TC-AUTH-01): ĐĂNG NHẬP NHANH BẰNG "DEMO 1-CLICK SWITCHER"
* **Mục tiêu:** Kiểm tra tiện ích phục vụ thuyết trình đồ án ITBA, chuyển đổi tức thì giữa các vai trò mà không cần gõ phím.
* **Màn hình:** `http://localhost:3000/admin/login`
* **Các bước thực hiện:**
  1. Truy cập vào đường dẫn: `http://localhost:3000/admin/login`.
  2. Kéo xuống phần khung màu vàng **"Tiện ích Thuyết trình ITBA (1-Click Login)"**.
  3. Bấm vào nút: **`1. Đăng nhập quyền ADMIN (Nguyễn Văn An)`**.
* **Kết quả mong đợi (Expected Result):**
  * Hệ thống tự động chuyển hướng vào trang quản trị.
  * Nhìn lên thanh menu góc trên bên phải: Hiển thị tên **Nguyễn Văn An**, vai trò **Quản trị viên (ADMIN)**.
  * Trên thanh Menu xuất hiện tab **"Quản trị User (Admin)"** (vì tài khoản Admin mới có quyền này).

---

### 📌 KỊCH BẢN 2 (TC-AUTH-02): KIỂM TRA PHÂN QUYỀN RBAC (ẨN/HIỆN MENU THEO VAI TRÒ)
* **Mục tiêu:** Kiểm chứng ma trận phân quyền RBAC: HR Lead không được quyền can thiệp vào tài khoản User.
* **Các bước thực hiện:**
  1. Khi đang ở trang quản trị, bấm vào nút **`Demo Switcher`** màu vàng trên thanh Navbar.
  2. Chọn: **`2. Nguyễn Thu Hà — Vai trò: HR LEAD`**.
* **Kết quả mong đợi (Expected Result):**
  * Tên góc phải đổi sang **Nguyễn Thu Hà (Chuyên viên Tuyển dụng)**.
  * Tab **"Quản trị User (Admin)"** trên thanh Navbar **TỰ ĐỘNG BIẾN MẤT** hoàn toàn (đúng theo Ma trận phân quyền RBAC trong Mục 13).

---

### 📌 KỊCH BẢN 3 (TC-AUTH-03): ĐĂNG NHẬP THẤT BẠI VỚI THÔNG TIN SAI
* **Mục tiêu:** Kiểm tra khả năng xử lý lỗi xác thực và thông báo người dùng.
* **Các bước thực hiện:**
  1. Bấm nút icon **Đăng xuất (LogOut)** ở góc phải màn hình.
  2. Tại form đăng nhập, nhập Email: `taikhoan_khongtontai@gmail.com`, Mật khẩu: `123456`.
  3. Bấm nút **"Đăng nhập hệ thống"**.
* **Kết quả mong đợi (Expected Result):**
  * Hệ thống không chuyển trang.
  * Xuất hiện hộp thông báo màu đỏ: *"Email hoặc mật khẩu không chính xác"*.

---

### 📌 KỊCH BẢN 4 (TC-BRL-AUTH-01): CHẶN TẠO MẬT KHẨU YẾU (< 8 KÝ TỰ)
* **Mục tiêu:** Kiểm chứng quy tắc bảo mật **BRL-Auth** bắt buộc mật khẩu từ 8 ký tự trở lên.
* **Màn hình:** `http://localhost:3000/admin/users`
* **Các bước thực hiện:**
  1. Đăng nhập bằng quyền **ADMIN** (Nguyễn Văn An) và vào tab **"Quản trị User (Admin)"**.
  2. Bấm vào nút **`+ Thêm Tài khoản Mới`**.
  3. Nhập Họ tên: `Lê Thử Nghiệm`, Email: `test.brl@recoverx.career`.
  4. Tại ô Mật khẩu: Chỉ gõ **`12345`** (dưới 8 ký tự).
  5. Bấm nút **"Tạo Tài Khoản"**.
* **Kết quả mong đợi (Expected Result):**
  * Hệ thống chặn lại ngay lập tức.
  * Hiển thị cảnh báo lỗi màu đỏ trong Modal: *"Mật khẩu phải có tối thiểu 8 ký tự theo BRL-Auth"*.

---

### 📌 KỊCH BẢN 5 (TC-BRL-AUTH-02): CHẶN TRÙNG EMAIL TÀI KHOẢN NỘI BỘ
* **Mục tiêu:** Kiểm tra ràng buộc Unique Email của hệ thống.
* **Các bước thực hiện:**
  1. Mở lại Modal **`+ Thêm Tài khoản Mới`**.
  2. Nhập Email trùng với tài khoản đã có: **`hr@recoverx.career`**.
  3. Nhập Mật khẩu hợp lệ: `Password123@`.
  4. Bấm **"Tạo Tài Khoản"**.
* **Kết quả mong đợi (Expected Result):**
  * Hệ thống báo lỗi: *"Email này đã được sử dụng trong hệ thống"*.

---

### 📌 KỊCH BẢN 6 (TC-USER-01): TẠO TÀI KHOẢN MỚI THÀNH CÔNG & PHÂN QUYỀN
* **Mục tiêu:** Kiểm tra tính năng tạo nhân viên mới của Admin.
* **Các bước thực hiện:**
  1. Mở Modal **`+ Thêm Tài khoản Mới`**.
  2. Nhập Họ tên: `Hoàng Minh Châu`.
  3. Nhập Email: `chau.hoang@recoverx.career`.
  4. Nhập Mật khẩu: `ChauHoang2026!`.
  5. Chọn Vai trò (Role): **`HIRING MANAGER`**.
  6. Bấm **"Tạo Tài Khoản"**.
* **Kết quả mong đợi (Expected Result):**
  * Modal tự đóng lại.
  * Dòng nhân viên **Hoàng Minh Châu** xuất hiện ngay lập tức trên bảng danh sách với huy hiệu tím: **HIRING MANAGER**, trạng thái màu xanh: **Đang hoạt động**.

---

### 📌 KỊCH BẢN 7 (TC-USER-02): KHÓA TÀI KHOẢN & KIỂM TRA CHẶN ĐĂNG NHẬP
* **Mục tiêu:** Kiểm tra tính năng vô hiệu hóa quyền truy cập nhân viên nghỉ việc hoặc vi phạm.
* **Các bước thực hiện:**
  1. Tại dòng tài khoản `chau.hoang@recoverx.career` vừa tạo, bấm nút **`Khóa`**.
  2. Quan sát trạng thái: Chuyển sang màu đỏ **`Đã khóa`**, nút đổi thành **`Mở khóa`**.
  3. Đăng xuất khỏi hệ thống (`/admin/login`).
  4. Thử đăng nhập bằng tài khoản vừa bị khóa: Email `chau.hoang@recoverx.career` / Mật khẩu `ChauHoang2026!`.
* **Kết quả mong đợi (Expected Result):**
  * Hệ thống chặn không cho vào và xuất hiện thông báo:  
    *"Tài khoản của bạn đã bị khóa bởi Quản trị viên"*.

---

## III. BẢNG CHECKLIST BÁO CÁO KẾT QUẢ TỰ TEST (UAT SIGN-OFF SHEET)

Bạn hãy tích chọn vào bảng này khi tự thực hiện trên máy tính của mình:

| Mã Test Case | Tên tình huống kiểm thử | Kết quả mong đợi | Trạng thái của bạn |
| :---: | :--- | :--- | :---: |
| **TC-01** | Đăng nhập 1-Click Demo Switcher | Vào thẳng vai Admin/HR/TechLead | [ ] Đạt (Pass) |
| **TC-02** | Ẩn/Hiện Menu theo quyền RBAC | Quyền HR không thấy tab Quản trị User | [ ] Đạt (Pass) |
| **TC-03** | Đăng nhập sai tài khoản | Báo lỗi đỏ không cho vào | [ ] Đạt (Pass) |
| **TC-04** | Kiểm tra BRL-Auth mật khẩu ngắn | Chặn tạo mật khẩu < 8 ký tự | [ ] Đạt (Pass) |
| **TC-05** | Chặn trùng Email User | Báo lỗi email đã tồn tại | [ ] Đạt (Pass) |
| **TC-06** | Tạo User mới phân quyền Role | Tạo thành công, xuất hiện trên bảng | [ ] Đạt (Pass) |
| **TC-07** | Khóa tài khoản nhân viên | Tài khoản bị khóa không đăng nhập được | [ ] Đạt (Pass) |

---

> 💡 **Mẹo:** Ngoài việc tự test bằng tay trên giao diện web, bất cứ lúc nào bạn muốn kiểm tra toàn bộ 22 quy tắc backend xem có bị hỏng hóc gì không, bạn chỉ cần mở Terminal và gõ:  
> **`npm test`**  
> Toàn bộ 22 kịch bản tự động sẽ chạy trong **1 giây** và báo cáo kết quả xanh 100%!
