# ![][image1]

# 

# 

# **BUSINESS REQUIREMENTS DOCUMENT (BRD)**

## Hệ thống Quản lý Hồ sơ Ứng viên (ReCoverX Career \- ATS )

## 

Ho Chi Minh City, November 2026

**Table of Contents**

[**I. Record of Changes	3**](#i.-record-of-changes)

[**II. INTRODUCTION & BUSINESS OVERVIEW	4**](#ii.-introduction-&-business-overview)

[1\. Bối cảnh kinh doanh (Business Context)	4](#1.-bối-cảnh-kinh-doanh-\(business-context\))

[2\. Mục tiêu kinh doanh & Tỷ suất hoàn vốn (Business Objectives & ROI)	4](#2.-mục-tiêu-kinh-doanh-&-tỷ-suất-hoàn-vốn-\(business-objectives-&-roi\))

[3\. Thuật ngữ (Glossary)	4](#3.-thuật-ngữ-\(glossary\))

[**III. SCOPE OF WORK (Phạm vi công việc)	5**](#iii.-scope-of-work-\(phạm-vi-công-việc\))

[1\. Trong phạm vi (In-Scope)	5](#1.-trong-phạm-vi-\(in-scope\))

[2\. Ngoài phạm vi (Out-of-Scope)	5](#2.-ngoài-phạm-vi-\(out-of-scope\))

[**IV. AS-IS & TO-BE PROCESSES (Quy trình Hiện tại và Tương lai)	6**](#iv.-as-is-&-to-be-processes-\(quy-trình-hiện-tại-và-tương-lai\))

[1\. Quy trình hiện tại (As-Is Process)	6](#1.-quy-trình-hiện-tại-\(as-is-process\))

[2\. Quy trình tương lai (To-Be Process)	6](#2.-quy-trình-tương-lai-\(to-be-process\))

[**V. BUSINESS REQUIREMENTS (Yêu cầu nghiệp vụ)	7**](#v.-business-requirements-\(yêu-cầu-nghiệp-vụ\))

[**VI. NON-FUNCTIONAL REQUIREMENTS (Yêu cầu phi chức năng)	8**](#vi.-non-functional-requirements-\(yêu-cầu-phi-chức-năng\))

[**VII. ASSUMPTIONS, DEPENDENCIES & CONSTRAINTS (Giả định, Phụ thuộc & Ràng buộc)	9**](#vii.-assumptions,-dependencies-&-constraints-\(giả-định,-phụ-thuộc-&-ràng-buộc\))

[**VIII. RISKS & MITIGATION (Rủi ro & Kế hoạch giảm thiểu)	10**](#viii.-risks-&-mitigation-\(rủi-ro-&-kế-hoạch-giảm-thiểu\))

# 

# **I. Record of Changes** {#i.-record-of-changes}

| Date | A\*M, D | In charge | Change Description |
| ----- | ----- | ----- | ----- |
| 11/11/2026 | Nguyễn Quốc Khánh | A | Khởi tạo tài liệu dự thảo BRD lần đầu |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

***Table 1\.** Record of Changes.*  
\*A \- Added M \- Modified D \- Deleted

# 

# **II. INTRODUCTION & BUSINESS OVERVIEW** {#ii.-introduction-&-business-overview}

## **1\. Bối cảnh kinh doanh (Business Context)** {#1.-bối-cảnh-kinh-doanh-(business-context)}

Hiện tại, bộ phận Tuyển dụng (HR) tiếp nhận CV từ đa kênh (Facebook, TopCV, Email cá nhân). CV được tải về và lưu trữ rải rác trong các thư mục máy tính cục bộ. Chuyên viên tuyển dụng phải mở từng file PDF/Doc để đọc thông tin, sau đó nhập liệu thủ công lại vào một file tổng (Excel/Google Sheet) để theo dõi. Việc cập nhật trạng thái phỏng vấn (Đậu/Rớt) cũng đang được thực hiện hoàn toàn thủ công.

**Vấn đề gặp phải (Pain-points):**

* **Quá tải thủ công:** Mất trung bình 3-5 phút cho mỗi CV chỉ để đọc và nhập liệu thủ công (Với 100 CV, HR tốn gần 1 ngày làm việc).  
* **Quy mô và Khối lượng dữ liệu:** Hiện tại, trung bình mỗi tháng công ty tuyển dụng từ 5 \- 10 vị trí, mỗi vị trí nhận về khoảng 50 \- 100 CV. Tổng lưu lượng xử lý ước tính từ 500 \- 1.000 CV/tháng.  
* **Phân tán dữ liệu:** Không có kho lưu trữ CV tập trung, khó truy xuất lại hồ sơ cũ.  
* **Kiểm soát kém:** Thiếu công cụ lọc CV tự động, dẫn đến việc phải "dò" lại file Excel hoặc đọc lại CV bằng mắt thường khi cần tìm ứng viên có kỹ năng đặc thù.13

## **2\. Mục tiêu kinh doanh & Tỷ suất hoàn vốn (Business Objectives & ROI)** {#2.-mục-tiêu-kinh-doanh-&-tỷ-suất-hoàn-vốn-(business-objectives-&-roi)}

* Giảm 30% thời gian sàng lọc hồ sơ ban đầu thông qua tự động hóa.  
* Giảm thiểu chi phí cơ hội cho doanh nghiệp bằng cách rút ngắn thời gian tuyển dụng (Time-to-Hire) từ 3-5 ngày.  
* Loại bỏ tỷ lệ bỏ sót ứng viên tiềm năng (đang ở mức 15% \- 20% trong các đợt tuyển dụng cao điểm).  
* Độ chính xác của tính năng bóc tách CV (Parsing) phải đạt trên 85%.

## **3\. Thuật ngữ (Glossary)** {#3.-thuật-ngữ-(glossary)}

* **ATS (Applicant Tracking System):** Hệ thống quản lý và theo dõi hồ sơ ứng viên.  
* **Parsing CV:** Kỹ thuật dùng AI/NLP để đọc tệp văn bản phi cấu trúc (PDF, Word) và tự động trích xuất ra các trường dữ liệu có cấu trúc (Tên, tuổi, kỹ năng).  
* **Kanban Pipeline:** Giao diện quản lý quy trình dạng bảng lưới/cột, hỗ trợ kéo-thả (Drag & Drop) trực quan để di chuyển thẻ ứng viên giữa các vòng.

# **III. SCOPE OF WORK (Phạm vi công việc)** {#iii.-scope-of-work-(phạm-vi-công-việc)}

## **1\. Trong phạm vi (In-Scope)** {#1.-trong-phạm-vi-(in-scope)}

* Tính năng Upload file CV đa định dạng (.pdf, .doc, .docx).  
* Tính năng tự động trích xuất dữ liệu (Parsing): Tên, Email, SĐT, Kỹ năng, Số năm kinh nghiệm.  
* Thanh công cụ tìm kiếm và lọc ứng viên theo từ khóa chuyên môn.  
* Giao diện quản lý trạng thái bằng Kanban Pipeline với 5 cột chuẩn: New, Screening, Interview, Hired, Rejected.  
* Tính năng xuất danh sách ứng viên (Data Export) ra tệp định dạng chuẩn (.csv, .xlsx) hỗ trợ thao tác tải về.

## **2\. Ngoài phạm vi (Out-of-Scope)** {#2.-ngoài-phạm-vi-(out-of-scope)}

* Tính năng kết nối API để tự động lấy CV trực tiếp từ TopCV, Facebook.  
* Tính năng gửi email từ chối/mời phỏng vấn tự động (Email Automation).  
* Bảng điều khiển (Dashboard) báo cáo phân tích nâng cao (Talent Analytics).

# **IV. AS-IS & TO-BE PROCESSES (Quy trình Hiện tại và Tương lai)** {#iv.-as-is-&-to-be-processes-(quy-trình-hiện-tại-và-tương-lai)}

## **1\. Quy trình hiện tại (As-Is Process)** {#1.-quy-trình-hiện-tại-(as-is-process)}

1. Ứng viên nộp CV qua Email/TopCV.  
2. HR mở luồng Email/Web \-\> Tải CV về máy tính.  
3. HR mở file Excel theo dõi tuyển dụng.  
4. HR mở file PDF CV \-\> Đọc bằng mắt \-\> Copy/Gõ lại Họ tên, kỹ năng vào Excel.  
5. HR cần tìm người có kinh nghiệm \-\> Dùng Ctrl+F dò trên Excel hoặc đọc lại từng file PDF.  
6. Ứng viên qua vòng phỏng vấn \-\> HR tìm đến dòng của ứng viên trên Excel và gõ cập nhật trạng thái "Đậu/Rớt".

## **2\. Quy trình tương lai (To-Be Process)** {#2.-quy-trình-tương-lai-(to-be-process)}

1. HR Tải lên & Khử trùng lặp (Upload & Deduplication): Người dùng tải hàng loạt tệp hồ sơ (CV) lên hệ thống. Hệ thống tự động quét các trường dữ liệu định danh (Email, Số điện thoại) để phát hiện và cảnh báo hồ sơ trùng lặp, hỗ trợ gộp dữ liệu vào hồ sơ hiện có trong hệ thống.  
2. Trích xuất dữ liệu (AI Parsing): Hệ thống tự động phân tích tệp văn bản đầu vào và trích xuất các trường thông tin cấu trúc (Họ tên, SĐT, Email, Kỹ năng, Kinh nghiệm). Sau khi trích xuất, hệ thống khởi tạo thẻ ứng viên tại trạng thái "New" trên bảng luồng công việc (Kanban).  
3. Sàng lọc & Quản lý luồng công việc (Screening & Pipeline Management): Người dùng sử dụng thanh tìm kiếm và bộ lọc để phân loại ứng viên. Quá trình luân chuyển ứng viên giữa các vòng (Screening, Interview) được thực hiện qua thao tác kéo-thả thẻ (Drag & Drop). Hệ thống tự động ghi nhận thời gian (Timestamp) tại mỗi cột để theo dõi SLA xử lý hồ sơ.  
4.  Đánh giá năng lực (Candidate Evaluation): Tại trạng thái "Interview", người dùng truy cập biểu mẫu đánh giá (Scorecard) tích hợp sẵn trên thẻ ứng viên để nhập điểm số và ghi nhận phản hồi từ hội đồng phỏng vấn.  
5. Đóng quy trình & Lưu trữ (Closure & Retention): Tùy thuộc vào kết quả, thẻ ứng viên được chuyển sang trạng thái "Hired" hoặc "Rejected". Toàn bộ dữ liệu hồ sơ được lưu trữ tập trung vào Kho nhân tài (Talent Pool) theo thiết lập quản trị vòng đời dữ liệu của hệ thống, phục vụ cho các chiến dịch tuyển dụng trong tương lai.  
6. Luân chuyển vị trí (Repooling/Transfer): Trong trường hợp ứng viên bị từ chối ở vị trí hiện tại nhưng được đánh giá phù hợp với một vị trí khác đang mở, HR thực hiện thao tác luân chuyển. Hệ thống sẽ khởi tạo một thẻ ứng viên mới tại trạng thái "New" của vị trí đích, đồng thời liên kết bảo toàn thông tin gốc và lịch sử đánh giá cũ.

# **V. BUSINESS REQUIREMENTS (Yêu cầu nghiệp vụ)** {#v.-business-requirements-(yêu-cầu-nghiệp-vụ)}

| Mã | Tên nghiệp vụ | Đối tượng  | Mô tả & Tiêu chí chấp nhận | Độ ưu tiên (MoSCoW) |
| ----- | ----- | ----- | ----- | ----- |
| BR-01 | Tải lên và Xem trước CV | HR | Cho phép tải lên tệp CV (định dạng .pdf, .doc, .docx). Cung cấp trình xem trước (preview) nội dung trực tiếp trên giao diện hệ thống. | Must Have |
| BR-02 | Khử trùng lặp dữ liệu (Deduplication) | System | Khi tệp được tải lên, hệ thống kiểm tra đối chiếu Email và Số điện thoại với cơ sở dữ liệu hiện tại. Nếu phát hiện trùng khớp, hệ thống hiển thị cảnh báo và cho phép gộp hồ sơ.  | Must Have |
| BR-03 | Trích xuất dữ liệu tự động (Parsing) | System | Hệ thống phân tích tệp đầu vào để tự động bóc tách và điền các trường: Họ và tên, Email, Số điện thoại, Kỹ năng vào Form hồ sơ ứng viên. | Must Have |
| BR-04 | Tìm kiếm và Lọc nâng cao | HR | Cung cấp thanh tìm kiếm hỗ trợ từ khóa kết hợp logic Boolean. Trả về kết quả hồ sơ tương ứng trong thời gian phản hồi dưới 3 giây. | Must Have |
| BR-05 | Quản lý Pipeline và Cảnh báo SLA | HR | Cung cấp giao diện Kanban với 5 trạng thái kéo-thả (New, Screening, Interview, Hired, Rejected). Hỗ trợ cài đặt giới hạn thời gian lưu thẻ tối đa tại mỗi cột và đổi màu cảnh báo khi quá hạn.  | Must Have |
| BR-06 | Biểu mẫu đánh giá (Scorecard) | HR/Manager | Tích hợp biểu mẫu đánh giá năng lực ứng viên tại giao diện chi tiết hồ sơ. Cho phép nhiều người dùng cùng nhập điểm đánh giá (thang điểm 1-5) và bình luận. | Should Have |
| BR-07 | Quản trị vòng đời dữ liệu  | System | Hệ thống hỗ trợ thiết lập quy tắc tự động dọn dẹp dữ liệu hồ sơ ứng viên ở trạng thái "Rejected". Dữ liệu thuộc Kho nhân tài (Talent Pool) được cấu hình lưu trữ tối đa 06 tháng. Quá thời hạn này, hệ thống tự động thực hiện tiến trình xóa vĩnh viễn (Hard Delete). | Must Have |
| BR-08 | Ghi nhận lịch sử thao tác (Audit Log)  | System | Hệ thống ghi nhận và lưu trữ toàn bộ lịch sử thao tác (tạo mới, cập nhật trạng thái, xóa) trên từng thẻ ứng viên, bao gồm thông tin người thực hiện và thời gian. | Must Have |

***Table 2\.** Business requirements table.*

# **VI. NON-FUNCTIONAL REQUIREMENTS (Yêu cầu phi chức năng)** {#vi.-non-functional-requirements-(yêu-cầu-phi-chức-năng)}

**Hiệu năng hệ thống (Performance):** Duy trì tốc độ phản hồi dưới 3 giây cho các tác vụ tìm kiếm, lọc và luân chuyển trạng thái. Hỗ trợ xử lý tải lên hàng loạt (Bulk Upload) từ 50-100 CV cùng lúc thông qua hàng đợi (Task Queue) mà không gây gián đoạn giao diện.

**Kiến trúc Dữ liệu (Data Architecture):** Sử dụng hệ quản trị cơ sở dữ liệu quan hệ (Relational Database) để đảm bảo tính toàn vẹn của cấu trúc dữ liệu ứng viên và lịch sử trạng thái tuyển dụng.

**Phân quyền Truy cập (Security & Access Control):** Hệ thống hỗ trợ cơ chế bảo mật cấp độ hàng (Row Level Security) theo Ma trận phân quyền cốt lõi sau:

* **Admin (Quản trị viên):** Có toàn quyền cấu hình hệ thống, quản lý người dùng, xem/sửa mọi dữ liệu và thực hiện xóa vĩnh viễn (Hard Delete).  
* **HR (Chuyên viên tuyển dụng)**: Quyền tạo vị trí tuyển dụng, tải lên CV, luân chuyển trạng thái Kanban, chỉnh sửa hồ sơ. Chỉ được quyền Ẩn/Xóa mềm (Soft Delete).  
* **Hiring Manager (Quản lý chuyên môn):** Quyền truy cập chỉ đọc (Read-only) đối với các hồ sơ được HR phân công. Được quyền nhập điểm và bình luận trên Biểu mẫu đánh giá (Scorecard). Không có quyền xem thông tin nhạy cảm (lương kỳ vọng) hoặc chỉnh sửa/xóa hồ sơ gốc.

# **VII. ASSUMPTIONS, DEPENDENCIES & CONSTRAINTS (Giả định, Phụ thuộc & Ràng buộc)** {#vii.-assumptions,-dependencies-&-constraints-(giả-định,-phụ-thuộc-&-ràng-buộc)}

**Giả định (Assumptions):** Đội ngũ HR có đủ nhân lực để cung cấp trước một tập hợp từ 50-100 CV mẫu phục vụ cho công tác kiểm thử (Testing) hệ thống.

**Phụ thuộc (Dependencies):** Việc hoàn thiện module Trích xuất dữ liệu (Parsing) phụ thuộc vào dịch vụ API của bên thứ ba (LLM Provider) để đảm bảo tiến độ triển khai thay vì tự huấn luyện mô hình.

**Ràng buộc (Constraints):**

* **Thời gian:** Dự án phải hoàn tất các giai đoạn phát triển, kiểm thử và nghiệm thu trong giới hạn 5 tuần.  
* **Kỹ thuật:** Hệ thống hỗ trợ phân tích văn bản trên 3 định dạng (.pdf, .doc, .docx). Không yêu cầu bóc tách dữ liệu từ tệp PDF chỉ chứa lớp hình ảnh (Image-only PDF).

# **VIII. RISKS & MITIGATION (Rủi ro & Kế hoạch giảm thiểu)** {#viii.-risks-&-mitigation-(rủi-ro-&-kế-hoạch-giảm-thiểu)}

**Rủi ro 1:** Độ chính xác của tính năng Parsing CV (Trích xuất dữ liệu) không đạt kỳ vọng (\< 85%) do định dạng CV quá đa dạng và phức tạp.  
**Kế hoạch giảm thiểu:** Sử dụng tập CV mẫu đa dạng ngành nghề để kiểm thử và tinh chỉnh thuật toán. Thiết kế giao diện cho phép HR thao tác chỉnh sửa tay (Manual Edit) các trường thông tin nếu hệ thống đọc sai.  
**Rủi ro 2:** Nhân viên HR kháng cự, từ chối thay đổi thói quen dùng Excel.  
**Kế hoạch giảm thiểu:** Đảm bảo tính năng kéo-thả Kanban trực quan, dễ dùng hơn Excel. Quản lý chặt chẽ và báo cáo kết quả tiết kiệm 30% thời gian cho Ban Giám đốc để thúc đẩy áp dụng từ cấp trên xuống.  


[image1]: <data:image/png;base64,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>