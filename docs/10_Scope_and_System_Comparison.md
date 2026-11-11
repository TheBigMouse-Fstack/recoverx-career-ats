# TÀI LIỆU PHẠM VI DỰ ÁN & ĐỐI CHIẾU HỆ THỐNG MẪU (SCOPE & BENCHMARK COMPARISON)

> **Dự án:** ReCoverX Career — Hệ thống Quản lý Tuyển dụng (ATS)  
> **Mục tiêu tài liệu:** Làm rõ phạm vi Làm (In-Scope) / Không làm (Out-of-Scope), xác định rõ hệ thống đang clone theo, phân tích điểm khác biệt, ưu thế vượt trội (Điểm HƠN) và các giới hạn chấp nhận được (Điểm KÉM).

---

## I. CHÚNG TA ĐANG CLONE THEO HỆ THỐNG NÀO?

Hệ thống **ReCoverX Career (ATS)** được định vị theo mô hình kết hợp (Hybrid Benchmark) từ các hệ thống ATS dẫn đầu thị trường:

1. **Hệ thống lõi để Clone quy trình nghiệp vụ: [Base E-Hiring (Base.vn)](https://base.vn/e-hiring)**
   * **Lý do chọn:** Base E-Hiring là phần mềm ATS phổ biến và chuẩn mực nhất tại các doanh nghiệp Việt Nam hiện nay.
   * **Các điểm kế thừa từ Base E-Hiring:**
     * Bố cục chuẩn: Bảng Kanban kéo-thả ứng viên qua 5 vòng tuyển dụng.
     * Cửa sổ trượt (Slide-over Drawer) từ bên phải ra để xem CV mà không phải rời trang.
     * Quy trình sàng lọc phân tầng: HR duyệt sơ bộ ➔ Chuyển Hiring Manager phỏng vấn ➔ Chấm điểm Scorecard.

2. **Hệ thống tham chiếu để Clone phong cách UI/UX: [Greenhouse](https://www.greenhouse.com) & [Workable](https://www.workable.com)**
   * **Lý do chọn:** Các hệ thống ATS của Mỹ có giao diện tối giản (Minimalist), trực quan và hiện đại hơn so với giao diện nhiều chữ của phần mềm truyền thống.
   * **Các điểm kế thừa:**
     * Thiết kế phẳng (Flat Design) kết hợp Tailwind CSS & Lucide Icons.
     * Huy hiệu hiển thị điểm sao (Star Rating) và phần trăm độ phù hợp (Match Badge) bằng màu sắc nổi bật.

---

## II. BẢNG PHÂN ĐỊNH CHI TIẾT: IN-SCOPE (LÀM GÌ) & OUT-OF-SCOPE (KHÔNG LÀM GÌ)

| Nhóm nghiệp vụ | Tính năng chi tiết | Trạng thái | Đang Clone từ đâu? | Ghi chú kỹ thuật & Nghiệp vụ |
| :--- | :--- | :---: | :--- | :--- |
| **1. Tin tuyển dụng & Cổng nộp đơn** | Cổng tuyển dụng công khai (Careers Page) | **IN-SCOPE** | Base E-Hiring | Ứng viên xem danh sách việc làm không cần đăng nhập. |
| | Form nộp đơn trực tuyến & Upload file CV | **IN-SCOPE** | Workable | Tải tệp PDF/Docx (tối đa 10MB) + reCAPTCHA chống spam. |
| | Đăng tin tự động lên TopCV, VietnamWorks, LinkedIn | **OUT-OF-SCOPE** | - | *Không làm:* Chi phí API các sàn tuyển dụng rất cao và yêu cầu tài khoản Enterprise đối tác. Tuyển dụng viên sẽ copy link tin tuyển dụng dán thủ công lên các trang này. |
| **2. Tiếp nhận & Xử lý CV** | Khử trùng lặp ứng viên (Deduplication) | **IN-SCOPE** | Chuẩn ATS quốc tế | Nhận diện cặp `(Email, Phone)`. Trùng lặp trong vòng 30 ngày cho cùng 1 Job sẽ báo lỗi hoặc cập nhật đơn. |
| | Đọc & Bóc tách nội dung CV (AI Parsing) | **IN-SCOPE** | Điểm mới (LLM) | Dùng Google Gemini API trích xuất tự động học vấn, kỹ năng, năm kinh nghiệm. |
| | Đọc CV file scan dạng ảnh (OCR chuyên sâu) | **OUT-OF-SCOPE** | - | *Không làm:* CV chụp bằng máy ảnh bị mờ/nghiêng không hỗ trợ. Chỉ nhận file PDF có lớp văn bản (text-based) hoặc DOCX. |
| **3. Sàng lọc ứng viên** | Chấm điểm tự động độ phù hợp (Match Score %) | **IN-SCOPE** | Điểm mới (LLM) | So khớp năng lực CV với tiêu chí JD; sinh điểm % và bản tóm tắt lý do (Rationale). |
| | Bảng Kanban kéo - thả 5 cột | **IN-SCOPE** | Base E-Hiring | 5 giai đoạn: *New ➔ Screening ➔ Interview ➔ Hired ➔ Rejected*. |
| | Cửa sổ trượt (Drawer) xem CV song song | **IN-SCOPE** | Base E-Hiring | Xem dữ liệu AI trích xuất bên trái và nhúng file PDF gốc bên phải trên cùng màn hình. |
| | Bài kiểm tra trắc nghiệm Online (Online Assessment) | **OUT-OF-SCOPE** | - | *Không làm:* Chưa làm module tạo bài thi trắc nghiệm IQ/tiếng Anh. Điểm này có thể tích hợp qua link ngoài (Google Forms/TestGorilla) nếu cần. |
| **4. Phỏng vấn & Đánh giá** | Đặt lịch phỏng vấn & Gửi email mời | **IN-SCOPE** | Base E-Hiring | Lên lịch hẹn, tự động điền template email gửi ứng viên. |
| | Phiếu đánh giá Scorecard có trọng số | **IN-SCOPE** | Greenhouse | Chấm sao (1-5) theo 3 tiêu chí: Chuyên môn (40%), Kỹ năng mềm (30%), Xử lý tình huống (30%). |
| | Phỏng vấn video trực tuyến tích hợp trên web | **OUT-OF-SCOPE** | - | *Không làm:* Không tự dựng hệ thống gọi video call WebRTC nội bộ. Sử dụng link Google Meet / Zoom chèn vào lịch hẹn. |
| **5. Ra quyết định & Onboarding** | Tạo và gửi Thư mời nhận việc (Offer Letter) | **IN-SCOPE** | Base E-Hiring | Chọn mẫu thư Offer, điền mức lương, gửi email cho ứng viên xác nhận. |
| | Ký hợp đồng điện tử có tính pháp lý (E-Sign) | **OUT-OF-SCOPE** | - | *Không làm:* Không tích hợp chứng thư số pháp lý (như FPT eContract / DocuSign). Ứng viên phản hồi "Đồng ý" qua nút bấm hoặc ký giấy khi nhận việc. |
| | Quản lý bảo hiểm, chấm công, bảng lương | **OUT-OF-SCOPE** | - | *Không làm:* ATS là phần mềm tuyển dụng, các phần này thuộc về phần mềm nhân sự HRM / Payroll. |
| **6. Tự động hóa & Chăm sóc** | Email từ chối tự động có **Delay Buffer (12–24h)** | **IN-SCOPE** | Điểm cải tiến mới | Ứng viên bị loại sẽ không nhận mail từ chối tức thì, mà hệ thống hoãn lại 12–24h để tạo cảm giác chu đáo, tôn trọng. |
| | Gửi tin nhắn SMS Brandname / Zalo ZNS | **OUT-OF-SCOPE** | - | *Không làm:* Chỉ giao tiếp qua Email (SMTP/Resend), không tích hợp cổng viễn thông trả phí SMS. |
| **7. Quản lý tài năng & Báo cáo** | Kho hồ sơ dự phòng (Talent Pool) | **IN-SCOPE** | Base E-Hiring | Lưu trữ hồ sơ ứng viên chưa trúng tuyển để tái sử dụng; tự động lưu trữ sau 6 tháng. |
| | Báo cáo tuyển dụng cơ bản & Xuất Excel | **IN-SCOPE** | Base E-Hiring | Thống kê số lượng CV, tỷ lệ chuyển đổi qua các vòng, nút bấm tải danh sách ra Excel. |

---

## III. CHÚNG TA LÀM KHÁC CÁI GÌ? (DIFFERENTIATORS)

So với Base E-Hiring nguyên bản, hệ thống của bạn có **3 điểm đổi mới cốt lõi**:

### 1. Cơ chế Từ chối Nhân văn (Human-Centric Delay Buffer - BRL-05)
* **Base E-Hiring:** Khi HR bấm loại, hệ thống thường gửi email từ chối ngay lập tức (khiến ứng viên cảm thấy bị "máy móc loại" và tiêu cực), hoặc HR phải nhớ gửi thủ công từng người.
* **Hệ thống của bạn:** Khi hồ sơ bị xếp vào cột `REJECTED`, hệ thống **tự động lên lịch hẹn giờ (Queue Delay 12–24 tiếng sau mới bắn email)**. Ứng viên nhận được email vào sáng hôm sau và cảm thấy công ty đã xem xét hồ sơ rất kỹ lưỡng.

### 2. Bóc tách & Chấm điểm bằng Trí tuệ Nhân tạo thế hệ mới (Native Generative AI)
* **Base E-Hiring:** Hệ thống bóc tách truyền thống chủ yếu dựa trên từ khóa cố định (Regex / Keyword Matching), rất hay bị lỗi khi gặp CV định dạng tiếng Việt lạ, CV 2 cột hoặc tên trường đại học viết tắt.
* **Hệ thống của bạn:** Sử dụng **Google Gemini API**, có khả năng đọc hiểu ngữ nghĩa (Semantic Understanding), tự nhận diện kinh nghiệm tương đương (ví dụ: biết "Next.js" là kinh nghiệm thuộc "React"), và viết ra **lời giải thích tại sao đạt/không đạt (Rationale)** cho HR đọc.

### 3. Cửa sổ làm việc tập trung (Split-Screen Candidate Drawer)
* HR không bao giờ phải nhấn nút "Tải CV về máy tính" rồi mở ứng dụng đọc PDF riêng.
* Mọi thao tác: Đọc dữ liệu AI bóc tách, soi file PDF gốc, xem điểm Match %, và mở phiếu chấm Scorecard đều diễn ra **ngay trên 1 màn hình duy nhất**.

---

## IV. BẢNG ĐỐI ĐẦU: CÓ GÌ HƠN VÀ CÓ GÌ KÉM?

```text
               [ ReCoverX Career (ATS) ]
                  /                 \
        ĐIỂM HƠN (Ưu thế)       ĐIỂM KÉM (Ranh giới MVP)
        -----------------       ------------------------
   ★ Native Generative AI      ▼ Chưa tự đồng bộ TopCV/LinkedIn
   ★ Giải trình Match thông minh ▼ Chưa có trắc nghiệm Online tích hợp
   ★ Email từ chối có độ trễ   ▼ Chưa có gọi Video call trên web
   ★ Không phụ thuộc phí bản quyền ▼ Chưa có ký số hợp đồng pháp lý
   ★ Giao diện siêu mượt (Next.js) ▼ Chỉ dùng Email, chưa có SMS/Zalo
```

### 1. CÓ GÌ HƠN? (ƯU THẾ VƯỢT TRỘI)
* **Hơn về sự Thông minh của AI:** Base E-Hiring chỉ lọc từ khóa cơ bản. Hệ thống của bạn phân tích ngữ nghĩa, hiểu sâu kỹ năng và viết đoạn văn giải trình lý do chấm điểm cực kỳ rõ ràng.
* **Hơn về Trải nghiệm ứng viên:** Cơ chế delay gửi email giúp giữ hình ảnh thương hiệu nhà tuyển dụng (Employer Branding) chuyên nghiệp, nhân văn.
* **Hơn về Chi phí & Khả năng Tự chủ:** Doanh nghiệp dùng Base E-Hiring phải trả phí thuê bao hàng tháng rất đắt đỏ (tính theo số tài khoản người dùng). Hệ thống của bạn chạy trên mã nguồn tự chủ, chi phí duy trì máy chủ và gọi Gemini API chỉ tốn vài chục nghìn đồng/tháng.
* **Hơn về Tốc độ giao diện:** Ứng dụng xây dựng trên **Next.js 14 App Router + Tailwind CSS** cho tốc độ phản hồi kéo-thả tức thì, không bị tải lại trang chậm chạp.

### 2. CÓ GÌ KÉM? (NHỮNG THỨ CHẤP NHẬN BỎ QUA Ở GIAI ĐOẠN NÀY)
* **Kém về Mạng lưới đa kênh:** Chưa có API kết nối tự động kéo đơn từ VietnamWorks/TopCV về một nơi (phải dựa vào Cổng tuyển dụng riêng hoặc HR upload file thủ công).
* **Kém về Công cụ phỏng vấn khép kín:** Phải dán link Google Meet / Zoom ngoài thay vì có sẵn phòng họp ảo trong web.
* **Kém về Tính năng Bài kiểm tra (Assessment):** Chưa có hệ thống tạo đề thi trắc nghiệm chuyên môn hay bài test tính cách.
* **Kém về Kênh liên lạc:** Chưa có cổng gửi SMS Brandname trực tiếp đến điện thoại ứng viên (chỉ liên lạc qua Email).

---

## V. TỔNG KẾT ĐỊNH VỊ SẢN PHẨM

> 💡 **Khẩu hiệu cốt lõi của ReCoverX Career:**  
> *"Một hệ thống ATS tinh gọn, chuẩn mực như Base E-Hiring nhưng sở hữu bộ não AI hiện đại như Greenhouse, tập trung giải quyết triệt để 2 nút thắt tốn thời gian nhất của nhà tuyển dụng: Bóc tách đọc CV tự động và Sàng lọc ứng viên có độ phù hợp cao."*
