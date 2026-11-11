# 🔐 DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP NỘI BỘ (RECOVERX CAREER ATS)

> **Màn hình Đăng nhập:** `http://localhost:3000/admin/login`  
> Toàn bộ tài khoản nội bộ đều đã được khởi tạo sẵn trong Cơ sở dữ liệu để bạn tự kiểm thử và thuyết trình đồ án:

---

### 📋 Bảng Thông tin Tài khoản & Quyền hạn (RBAC)

| STT | Họ và Tên | Vai trò (Role) | Email đăng nhập | Mật khẩu | Phạm vi Quyền hạn (Permissions) |
| :---: | :--- | :---: | :--- | :---: | :--- |
| **1** | **Nguyễn Văn An** | **`ADMIN`** | `admin@recoverx.career` | **`Admin@123`** | • Toàn quyền hệ thống.<br>• Xem và quản lý người dùng (`/admin/users`).<br>• Tạo mới nhân viên, phân quyền và khóa tài khoản.<br>• Xem Pipeline và tin tuyển dụng. |
| **2** | **Nguyễn Thu Hà** | **`HR`** *(Lead HR)* | `hr@recoverx.career` | **`Hr@123456`** | • Quản lý Pipeline Kanban 5 cột (`/admin/pipeline`).<br>• Đọc và xem chi tiết hồ sơ CV (Drawer).<br>• Kéo thả ứng viên qua các vòng.<br>• Lên lịch phỏng vấn và phát hành Offer.<br>• Không có quyền vào trang Quản trị User. |
| **3** | **Trần Minh Quân** | **`HIRING_MANAGER`** | `techlead@recoverx.career` | **`Manager@123`** | • Xem ứng viên ở vòng Phỏng vấn (`INTERVIEW`).<br>• Mở phiếu chấm điểm Scorecard 5 sao.<br>• Đưa ra nhận xét chuyên môn và đề xuất HIRE / NO_HIRE. |

---

### 💡 Hướng dẫn kiểm tra:
1. Mở trang: **`http://localhost:3000/admin/login`**.
2. Trang đăng nhập hoàn toàn sạch sẽ, không có Navbar và không có thông tin user nào.
3. Đăng nhập thử với từng tài khoản:
   - Đăng nhập bằng `admin@recoverx.career` / `Admin@123` ➔ Sẽ thấy tab **"Quản trị User (Admin)"** trên menu.
   - Bấm nút Đăng xuất ➔ Đăng nhập lại bằng `hr@recoverx.career` / `Hr@123456` ➔ Tab **"Quản trị User (Admin)"** sẽ tự động biến mất!
