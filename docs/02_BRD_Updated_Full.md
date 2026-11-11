# T?I LI?U Y?U C?U NGHI?P V? C?P NH?T (BRD - RECOVERX CAREER ATS)

> **Ngu?n:** Tr?ch xu?t t? phi?n l?m vi?c `8a254095-a9f4-4286-9307-fe701b5b5a78` (B??c 15).
> **Tr?ng th?i:** ?? c?p nh?t v? h?p nh?t to?n b? thay ??i (C?ng n?p CV tr?c tuy?n, S?ng l?c t? ??ng AI, Email t? ch?i t? ??ng c? delay, Quy tr?nh As-Is SOP).

---

Dưới đây là toàn văn **Tài liệu Yêu cầu Nghiệp vụ (BRD - Business Requirements Document)** đã được **cập nhật, hợp nhất toàn bộ các điểm sửa đổi** (Quy trình As-Is chuẩn SOP, Cổng nộp CV cho Ứng viên, Tính năng Sàng lọc tự động AI và Tự động gửi Email từ chối).

Bạn có thể sao chép trực tiếp bản hoàn chỉnh này vào tài liệu dự án của mình:

---

# **BUSINESS REQUIREMENTS DOCUMENT (BRD)**
## **Hệ thống Quản lý Hồ sơ Ứng viên (ReCoverX Career - ATS)**

*Ho Chi Minh City, November 2026*  
*Phiên bản: 1.1 (Cập nhật Cổng ứng viên & Tự động hóa Sàng lọc/Email)*

---

### **Table of Contents**
1. [I. Record of Changes](#i-record-of-changes)
2. [II. Introduction & Business Overview](#ii-introduction--business-overview)
3. [III. Scope of Work](#iii-scope-of-work)
4. [IV. As-Is & To-Be Processes](#iv-as-is--to-be-processes)
5. [V. Business Requirements](#v-business-requirements)
6. [VI. Non-Functional Requirements](#vi-non-functional-requirements)
7. [VII. Assumptions, Dependencies & Constraints](#vii-assumptions-dependencies--constraints)
8. [VIII. Risks & Mitigation](#viii-risks--mitigation)

---

### **I. Record of Changes**

| Phiên bản | Ngày | Người thực hiện | Loại (A/M/D)* | Mô tả thay đổi |
| :---: | :---: | :---: | :---: | :--- |
| **1.0** | 11/11/2026 | Nguyễn Quốc Khánh | A | Khởi tạo dự thảo BRD lần đầu. |
| **1.1** | 12/11/2026 | Nguyễn Quốc Khánh | M | • Chuẩn hóa quy trình As-Is thành quy trình vận hành tiêu chuẩn (SOP).<br>• Bổ sung Cổng nộp hồ sơ công khai cho Ứng viên (Candidate Portal).<br>• Đưa tính năng Sàng lọc tự động AI và Tự động gửi Email từ chối vào In-Scope. |

*\*A - Added, M - Modified, D - Deleted*

---

### **II. INTRODUCTION & BUSINESS OVERVIEW**

#### **1. Bối cảnh kinh doanh (Business Context)**
Hiện tại, công ty tiếp nhận hồ sơ ứng viên thông qua nhiều kênh ngoại tuyến và bán tự động (Email tuyển dụng, Facebook, TopCV). Chuyên viên tuyển dụng (HR) phải tải tệp CV về máy tính cá nhân, đọc thông tin thủ công và ghi nhận lại vào bảng tính (Excel/Google Sheets) để quản lý tiến độ phỏng vấn.

**Vấn đề gặp phải (Pain-points):**
* **Quá tải nhập liệu thủ công:** Mất trung bình 3–5 phút cho mỗi CV chỉ để đọc và nhập liệu vào Excel. Với lưu lượng 500 – 1.000 CV/tháng, HR tiêu tốn 30–40% tổng quỹ thời gian chỉ cho tác vụ hành chính này.
* **Thời gian phản hồi chậm:** Do khối lượng CV lớn, các ứng viên không đạt tiêu chuẩn thường không nhận được phản hồi (tỷ lệ "im lặng" lên đến 80%), ảnh hưởng tiêu cực đến thương hiệu tuyển dụng (Employer Branding).
* **Phân tán dữ liệu & Rủi ro trùng lặp:** Hồ sơ lưu rải rác trên máy tính cá nhân của HR, không có cơ chế phát hiện ứng viên nộp nhiều lần hoặc ứng tuyển lại, gây lãng phí nguồn lực đánh giá.

#### **2. Mục tiêu kinh doanh & Tỷ suất hoàn vốn (Business Objectives & ROI)**
* **Rút ngắn thời gian sàng lọc:** Giảm 50% thời gian xử lý và phân loại hồ sơ ban đầu thông qua Cổng ứng tuyển trực tuyến và AI Parsing/Screening.
* **Tối ưu hóa phản hồi ứng viên:** 100% ứng viên nộp hồ sơ đều nhận được thông báo phản hồi trạng thái (bao gồm cả thư từ chối tự động và lịch sự).
* **Rút ngắn thời gian tuyển dụng (Time-to-Hire):** Giảm từ 3–5 ngày làm việc trên mỗi quy trình tuyển dụng.
* **Độ chính xác trích xuất:** Tính năng bóc tách CV (AI Parsing) đạt độ chính xác trên 85%.

#### **3. Thuật ngữ (Glossary)**
* **ATS (Applicant Tracking System):** Hệ thống quản lý và theo dõi quy trình tuyển dụng từ khi tiếp nhận hồ sơ đến khi tuyển dụng thành công.
* **Candidate Portal:** Cổng thông tin/biểu mẫu công khai cho phép ứng viên nộp hồ sơ trực tuyến.
* **AI Parsing:** Kỹ thuật tự động đọc tệp văn bản phi cấu trúc (PDF, Word) và trích xuất thành dữ liệu cấu trúc (Họ tên, Email, Kỹ năng...).
* **AI Screening & Matching:** Tính năng sử dụng AI để đối chiếu hồ sơ ứng viên với Bản mô tả công việc (JD) để chấm điểm và phân loại đạt/không đạt.
* **Kanban Pipeline:** Giao diện quản lý quy trình dạng bảng cột trực quan hỗ trợ kéo-thả (Drag & Drop).

---

### **III. SCOPE OF WORK (Phạm vi công việc)**

#### **1. Trong phạm vi (In-Scope)**
* **Cổng nộp hồ sơ trực tuyến (Candidate Portal):** Biểu mẫu web công khai cho phép ứng viên tự nộp CV trực tiếp mà không cần đăng nhập.
* **Tính năng Tải lên nội bộ (HR Upload):** Hỗ trợ HR tải lên hàng loạt (Bulk Upload) hoặc từng hồ sơ CV (.pdf, .doc, .docx) cho các nguồn nội bộ hoặc săn ứng viên chủ động.
* **Khử trùng lặp tự động (Deduplication):** Kiểm tra đối chiếu Email và Số điện thoại ngay khi nhận hồ sơ.
* **Trích xuất dữ liệu bằng AI (AI Parsing):** Tự động bóc tách Họ tên, SĐT, Email, Kỹ năng, Số năm kinh nghiệm.
* **Sàng lọc tự động bằng AI (AI Screening):** Đối chiếu tiêu chuẩn JD, chấm điểm độ phù hợp và tự động chuyển trạng thái hồ sơ.
* **Tự động gửi Email từ chối (Automated Rejection Email):** Gửi email thông báo từ chối lịch sự theo mẫu cho ứng viên không qua bước sàng lọc AI (kèm cơ chế thiết lập độ trễ gửi thư).
* **Giao diện Kanban Pipeline:** Quản lý quy trình tuyển dụng qua 5 cột trạng thái chuẩn: *New, Screening, Interview, Hired, Rejected*.
* **Công cụ Tìm kiếm & Lọc nâng cao:** Tra cứu ứng viên theo từ khóa và kỹ năng chuyên môn.
* **Biểu mẫu đánh giá (Scorecard):** Hỗ trợ hội đồng phỏng vấn chấm điểm và nhận xét trực tiếp trên hồ sơ.
* **Xuất dữ liệu (Data Export):** Xuất danh sách ứng viên ra file định dạng chuẩn (.csv, .xlsx).

#### **2. Ngoài phạm vi (Out-of-Scope)**
* Tính năng kết nối API để tự động đồng bộ CV trực tiếp từ các nền tảng thứ ba (TopCV, LinkedIn, Facebook Jobs).
* Tính năng tự động đồng bộ lịch phỏng vấn hai chiều với Google Calendar/Outlook (Interview Scheduling Automation).
* Bảng điều khiển phân tích nâng cao (Advanced Talent Analytics).

---

### **IV. AS-IS & TO-BE PROCESSES (Quy trình Hiện tại và Tương lai)**

#### **1. Quy trình hiện tại (As-Is Process - Chuẩn SOP)**
* **Bước 1: Tiếp nhận & Phân loại hồ sơ:** HR kiểm tra định kỳ các hòm thư email và kênh tuyển dụng, tải các tệp CV về máy tính cá nhân và sắp xếp vào các thư mục theo tên vị trí tuyển dụng.
* **Bước 2: Ghi nhận dữ liệu ứng viên:** HR mở từng file CV, đọc thông tin và nhập thủ công các trường: Họ tên, SĐT, Email, Kỹ năng, Vị trí vào bảng tính *File Excel Tuyển dụng*.
* **Bước 3: Sàng lọc hồ sơ:** HR đối chiếu thông tin ứng viên với tiêu chuẩn công việc (JD), dùng lệnh `Ctrl + F` trên Excel để dò tìm ứng viên có từ khóa phù hợp; chuyển tiếp CV tiềm năng cho Quản lý chuyên môn (Hiring Manager) xem xét duyệt phỏng vấn.
* **Bước 4: Tổ chức phỏng vấn & Đánh giá:** HR liên hệ ứng viên qua Email/Điện thoại để sắp xếp lịch phỏng vấn. Buổi phỏng vấn diễn ra; ý kiến đánh giá được ghi nhận trên giấy hoặc trao đổi qua tin nhắn nội bộ.
* **Bước 5: Cập nhật kết quả & Đóng hồ sơ:** HR tìm đến dòng của ứng viên trên Excel để gõ cập nhật trạng thái "Đậu" hoặc "Rớt". Gửi Thư mời nhận việc (Offer Letter) cho ứng viên trúng tuyển, hoặc gửi thư cảm ơn/từ chối thủ công cho ứng viên không đạt.

#### **2. Quy trình tương lai (To-Be Process)**
* **Bước 1: Tiếp nhận hồ sơ đa luồng & Khử trùng lặp (Intake & Deduplication):**
  * *Luồng 1 (Chính):* Ứng viên truy cập Cổng ứng tuyển trực tuyến, tải tệp CV và gửi hồ sơ trực tiếp vào hệ thống.
  * *Luồng 2 (Bổ trợ):* HR tải tệp CV từ các nguồn ngoại tuyến lên hệ thống (hỗ trợ kéo-thả hàng loạt).
  * *Hệ thống:* Tự động quét kiểm tra Email và SĐT. Nếu phát hiện trùng lặp, hệ thống cảnh báo và hỗ trợ gộp dữ liệu vào hồ sơ hiện có.
* **Bước 2: Trích xuất & Sàng lọc tự động bằng AI (AI Parsing & Screening):**
  * Hệ thống tự động bóc tách dữ liệu có cấu trúc từ CV.
  * AI đối chiếu thông tin với tiêu chí của JD và phân nhánh:
    * **Đạt tiêu chuẩn:** Khởi tạo thẻ ứng viên tại trạng thái *"New"* hoặc *"Screening"* trên Kanban.
    * **Không đạt tiêu chuẩn:** Tự động chuyển thẻ ứng viên sang cột *"Rejected"* kèm ghi chú lý do không đạt.
* **Bước 3: Tự động gửi phản hồi từ chối (Automated Feedback):**
  * Đối với các thẻ ở trạng thái *"Rejected"* do AI sàng lọc, hệ thống tự động kích hoạt gửi Email từ chối lịch sự theo mẫu định sẵn sau một khoảng thời gian trễ cấu hình trước (ví dụ: sau 12–24 giờ).
* **Bước 4: Phỏng vấn & Đánh giá tập trung (Interview & Scorecard):**
  * HR kéo thẻ ứng viên sang cột *"Interview"*, liên hệ hẹn lịch với ứng viên.
  * Trong buổi phỏng vấn, HR và Hiring Manager truy cập Biểu mẫu đánh giá (Scorecard) tích hợp sẵn trên thẻ ứng viên để chấm điểm (1–5 sao) và ghi nhận xét trực tiếp.
* **Bước 5: Đóng quy trình & Lưu trữ (Closure & Retention):**
  * Dựa trên kết quả phỏng vấn, HR kéo thẻ sang *"Hired"* hoặc *"Rejected"*.
  * Toàn bộ hồ sơ được lưu trữ tập trung vào Kho nhân tài (Talent Pool), tuân thủ thiết lập vòng đời dữ liệu (tự động dọn dẹp sau 06 tháng đối với hồ sơ bị loại).
* **Bước 6: Luân chuyển vị trí (Repooling/Transfer):**
  * HR có thể luân chuyển một hồ sơ tiềm năng nhưng chưa phù hợp ở vị trí hiện tại sang một vị trí tuyển dụng khác đang mở mà không cần ứng viên phải nộp lại CV.

---

### **V. BUSINESS REQUIREMENTS (Bảng yêu cầu nghiệp vụ)**

| Mã YC | Tên nghiệp vụ | Tác nhân | Mô tả & Tiêu chí chấp nhận (Acceptance Criteria) | Độ ưu tiên (MoSCoW) |
| :---: | :--- | :---: | :--- | :---: |
| **BR-01** | **Cổng nộp hồ sơ trực tuyến (Candidate Portal)** | Ứng viên | Cung cấp biểu mẫu web công khai, thân thiện trên cả PC và Mobile (không yêu cầu đăng nhập). Cho phép ứng viên nhập Họ tên, Email, SĐT và đính kèm CV (.pdf, .doc, .docx dung lượng ≤ 10MB). Hiển thị thông báo xác nhận nộp thành công ngay sau khi gửi. | **Must Have** |
| **BR-02** | **Tải lên và Xem trước CV nội bộ** | HR | Cho phép HR tải lên từng tệp hoặc hàng loạt (tối đa 50 CV/lần). Cung cấp trình xem trước (Preview) nội dung CV trực tiếp trên trình duyệt mà không cần tải tệp về máy tính cá nhân. | **Must Have** |
| **BR-03** | **Khử trùng lặp dữ liệu (Deduplication)** | Hệ thống | Tự động đối chiếu Email và Số điện thoại của hồ sơ mới với cơ sở dữ liệu. Nếu phát hiện trùng khớp, hệ thống hiển thị cảnh báo, ngăn chặn tạo thẻ rác và cung cấp tùy chọn gộp hồ sơ. | **Must Have** |
| **BR-04** | **Trích xuất dữ liệu tự động (AI Parsing)** | Hệ thống | Phân tích tệp CV để tự động bóc tách các trường: Họ tên, Email, SĐT, Kỹ năng, Số năm kinh nghiệm và tự động điền vào Form thông tin ứng viên với độ chính xác ≥ 85%. | **Must Have** |
| **BR-05** | **Sàng lọc tự động bằng AI (AI Screening)** | Hệ thống | Tự động so sánh hồ sơ ứng viên với yêu cầu của JD theo các tiêu chí bắt buộc (Hard Criteria) và thang điểm phù hợp (Match Score). Tự động gắn thẻ "Rejected" nếu không đáp ứng ngưỡng quy định. | **Must Have** |
| **BR-06** | **Tự động gửi Email từ chối** | Hệ thống | Tự động gửi email từ chối theo mẫu cho các ứng viên bị loại ở bước AI Screening. Hỗ trợ chèn các biến động (`{Candidate_Name}`, `{Job_Title}`) và cấu hình thời gian trễ (Delay: Gửi ngay, sau 12h, sau 24h). | **Must Have** |
| **BR-07** | **Tìm kiếm và Lọc nâng cao** | HR | Cung cấp thanh công cụ tìm kiếm theo từ khóa chuyên môn (hỗ trợ logic AND/OR). Trả về danh sách ứng viên phù hợp trong thời gian ≤ 3 giây. | **Must Have** |
| **BR-08** | **Quản lý Pipeline Kanban & SLA** | HR | Giao diện Kanban trực quan với 5 cột chuẩn (*New, Screening, Interview, Hired, Rejected*). Hỗ trợ kéo-thả để chuyển trạng thái. Tự động đổi màu cảnh báo nếu hồ sơ lưu lại một cột vượt quá SLA quy định. | **Must Have** |
| **BR-09** | **Biểu mẫu đánh giá (Scorecard)** | HR/Manager | Tích hợp biểu mẫu đánh giá năng lực ngay trên thẻ ứng viên. Cho phép nhiều người dùng chấm điểm (thang điểm 1–5) và lưu lại ý kiến nhận xét của từng người. | **Should Have** |
| **BR-10** | **Quản trị vòng đời dữ liệu (Retention)** | Hệ thống | Hồ sơ ở trạng thái "Rejected" trong Kho nhân tài được lưu trữ tối đa 06 tháng. Sau thời hạn này, hệ thống tự động chạy tác vụ dọn dẹp và xóa vĩnh viễn (Hard Delete) theo định kỳ. | **Must Have** |
| **BR-11** | **Ghi nhận lịch sử thao tác (Audit Log)** | Hệ thống | Tự động lưu vết toàn bộ hoạt động (người thực hiện, hành động, thời gian) khi có thay đổi trên hồ sơ ứng viên (chuyển cột, chỉnh sửa thông tin, xóa). | **Must Have** |
| **BR-12** | **Xuất dữ liệu (Data Export)** | HR | Cho phép trích xuất danh sách ứng viên theo bộ lọc ra tệp định dạng chuẩn (.xlsx, .csv). | **Could Have** |

---

### **VI. NON-FUNCTIONAL REQUIREMENTS (Yêu cầu phi chức năng)**

* **Hiệu năng hệ thống (Performance):** 
  * Tốc độ phản hồi giao diện dưới 3 giây đối với các thao tác tìm kiếm, lọc và kéo-thả Kanban.
  * Hỗ trợ hàng đợi xử lý ngầm (Task Queue) khi upload hàng loạt từ 50–100 CV mà không làm đơ giao diện người dùng.
* **Kiến trúc dữ liệu (Data Architecture):** Sử dụng hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) để đảm bảo tính toàn vẹn cấu trúc và ràng buộc dữ liệu ứng viên.
* **Bảo mật & Phòng chống Spam (Security & Anti-Spam):**
  * Tích hợp cơ chế bảo vệ biểu mẫu công khai (Google reCAPTCHA hoặc Rate Limiting giới hạn số lượt gửi/IP) nhằm ngăn chặn bot spam và tấn công từ chối dịch vụ.
* **Phân quyền truy cập (Access Control - Row Level Security):**
  * **Ứng viên (Public / Candidate):** Chỉ có quyền truy cập vào liên kết biểu mẫu nộp CV công khai; tuyệt đối không thể xem bất kỳ dữ liệu nội bộ nào của hệ thống.
  * **Admin (Quản trị viên):** Toàn quyền cấu hình hệ thống, tạo tài khoản, chỉnh sửa mẫu email, xem và xóa dữ liệu vĩnh viễn.
  * **HR (Chuyên viên tuyển dụng):** Quản lý toàn bộ vị trí tuyển dụng, upload CV, luân chuyển trạng thái Kanban, chỉnh sửa hồ sơ. Chỉ có quyền Ẩn/Xóa mềm (Soft Delete).
  * **Hiring Manager (Quản lý chuyên môn):** Quyền chỉ đọc (Read-only) với các hồ sơ được phân công; có quyền chấm điểm trên Scorecard. Không được xem thông tin bảo mật (như mức lương kỳ vọng của ứng viên).

---

### **VII. ASSUMPTIONS, DEPENDENCIES & CONSTRAINTS**

* **Giả định (Assumptions):** Đội ngũ HR cung cấp tối thiểu 50–100 CV mẫu thực tế kèm JD tương ứng để phục vụ quá trình kiểm thử độ chính xác của AI Parsing và AI Screening.
* **Phụ thuộc (Dependencies):**
  * Phụ thuộc vào dịch vụ API của bên thứ ba (LLM Provider như OpenAI/Gemini/Anthropic) cho module bóc tách và sàng lọc tự động.
  * Phụ thuộc vào dịch vụ gửi Email đám mây (SMTP / SendGrid / Amazon SES) để thực thi tính năng tự động gửi email từ chối.
* **Ràng buộc (Constraints):**
  * **Thời gian hoàn thành:** Giới hạn triển khai toàn bộ dự án trong vòng 05 tuần.
  * **Kỹ thuật:** Chỉ hỗ trợ tệp văn bản (.pdf, .doc, .docx). Không hỗ trợ bóc tách tệp PDF dạng ảnh scan thuần túy (Image-only PDF).

---

### **VIII. RISKS & MITIGATION (Rủi ro & Kế hoạch giảm thiểu)**

* **Rủi ro 1: AI Screening loại nhầm ứng viên tiềm năng (False Negative) do tiêu chí quá cứng nhắc.**
  * *Giảm thiểu:* Thiết lập ngưỡng điểm linh hoạt; cung cấp màn hình danh sách riêng cho các hồ sơ bị AI loại để HR có thể xem xét nhanh và khôi phục (Restore) lại nếu cần; kích hoạt chế độ gửi email trễ (sau 12–24h) để HR có thời gian can thiệp trước khi thư từ chối được gửi đi.
* **Rủi ro 2: Email tự động gửi đi bị rơi vào hòm thư rác (Spam/Junk) của ứng viên.**
  * *Giảm thiểu:* Cấu hình đầy đủ các bản ghi xác thực tên miền gửi thư (SPF, DKIM, DMARC) cho hệ thống mail server.
* **Rủi ro 3: Ứng viên gửi file dung lượng quá lớn hoặc tệp tin độc hại qua Cổng ứng viên.**
  * *Giảm thiểu:* Giới hạn kích thước tệp tải lên tối đa 10MB; kiểm tra phần mở rộng tệp (File Extension) và quét mã độc trước khi lưu vào máy chủ.