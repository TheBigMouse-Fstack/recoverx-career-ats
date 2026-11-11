# Rule: ATS Business Rules & Validation Logic (BRL-01 to BRL-10)

## 0. Kiến trúc Sàng lọc & Bóc tách: MÔ HÌNH LAI (HYBRID MODEL)
Hệ thống kết hợp 2 lớp phòng vệ tối ưu giữa Bộ lọc quy tắc (Rule-based) và Trí tuệ nhân tạo (Gemini LLM):
1. **Lớp 1 — Bộ lọc Quy tắc Cứng (Rule-based / Regex - Miễn phí 100%, tất định):**
   - Chặn tệp không hợp lệ (> 10MB hoặc khác PDF/DOCX) ngay lập tức.
   - Kiểm tra định dạng Email, Số điện thoại hợp lệ.
   - Khử trùng lặp `(Email, Phone)` trong 30 ngày.
   - Trích xuất văn bản thô từ PDF/DOCX bằng thư viện cục bộ `pdf-parse`.
   - *Mục tiêu:* Tiết kiệm 100% chi phí AI cho các hồ sơ rác, file lỗi hoặc đơn nộp trùng.
2. **Lớp 2 — Bộ não Phân tích Ngữ nghĩa (Gemini API LLM - Thông minh & Chống ảo giác):**
   - Chỉ được kích hoạt khi Lớp 1 vượt qua thành công.
   - Cấu hình bắt buộc: `temperature: 0` (triệt tiêu ảo giác/bịa đặt) và áp dụng strict `JSON Schema`.
   - Phân tích ngữ nghĩa tương đương, chống gian lận từ khóa trắng (Keyword Stuffing).
   - Trả về cấu trúc JSON chuẩn, tính điểm Match % và sinh đoạn giải trình (Rationale) ngắn gọn.

---

### BRL-01: File Format & File Size Limits
- Accepted formats: `.pdf`, `.docx`
- Maximum file size: **10MB**
- Frontend must validate file size & MIME type before upload.
- Backend must reject invalid files with HTTP 400 and clear error messages.

---

### BRL-02: Candidate Deduplication (Khử trùng lặp hồ sơ)
- Unique candidate identification key: Combination of `(Email, Phone)`.
- If a candidate reapplies for the **same Job within 30 days**:
  - The system flags as duplicate.
  - Option A: Inform the candidate they have an active application.
  - Option B: Update the existing application with the newer CV without creating duplicate records.
- If applying for a **different Job**, a new `Application` record is created, linked to the existing `Candidate`.

---

### BRL-03: AI CV Parsing Requirements
- Gemini API must parse raw CV text into structured JSON matching this schema:
  ```json
  {
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "years_of_experience": 3.5,
    "skills": ["TypeScript", "Next.js", "PostgreSQL"],
    "education": [
      {
        "institution": "University ABC",
        "degree": "Bachelor of Computer Science",
        "grad_year": 2022
      }
    ],
    "experience": [
      {
        "company": "Company XYZ",
        "position": "Frontend Developer",
        "duration": "2022 - 2024",
        "summary": "Built dashboard using React..."
      }
    ]
  }
  ```
- Store the raw parsed JSON in `AIParseResult.parsed_data`.

---

### BRL-04: AI Match Scoring & Screening Threshold
- Compare parsed CV skills, experience, and education against the `Job.requirements`.
- Output:
  - `match_score`: integer from 0 to 100 (%)
  - `rationale`: 2-3 sentence explanation highlighting strengths and deficiencies.
  - `matched_skills`: list of skills present in both JD and CV.
  - `missing_skills`: required skills absent from CV.
- **Screening Rule:**
  - `match_score >= 60%`: Candidate remains in `SCREENING` or is eligible for promotion to `INTERVIEW`.
  - `match_score < 60%`: Candidate is flagged for rejection pipeline.

---

### BRL-05: Rejection Email Delay Buffer
- **Human-Centric Rule:** Rejection emails are **NEVER** sent instantly upon disqualification.
- When an application enters `REJECTED` status:
  - Schedule rejection email with a **12 to 24-hour delay buffer** (`scheduled_at = now + 12 hours`).
  - This prevents candidate demotivation and simulates a thoughtful review process.

---

### BRL-06: Stage Gate Rule — Ràng buộc Quyết định Tuyển chọn (Pre-Hire Requirement)
- Một ứng viên **chỉ được phép chuyển sang cột `HIRED`** khi và chỉ khi:
  - Đã trải qua vòng `INTERVIEW`.
  - Có **ít nhất 01 phiếu đánh giá Scorecard hoàn tất** với khuyến nghị `HIRE` hoặc `STRONG_HIRE`.
- Nếu chưa có Scorecard hợp lệ, hệ thống phải chặn thao tác chuyển cột và hiển thị thông báo: *"Yêu cầu hoàn tất ít nhất 01 phiếu đánh giá Scorecard trước khi phát hành Offer/Tuyển chọn"*.

---

### BRL-07: Cảnh báo Vi phạm SLA Tuyển dụng (SLA Breach Alert)
- Nhằm chống "bỏ quên" ứng viên, hệ thống tự động kiểm tra thời gian lưu thẻ (`stage_updated_at`):
  - Cột `NEW`: Quá **48 giờ** chưa xử lý ➔ Gắn nhãn cảnh báo đỏ `[SLA Breached - Cần sàng lọc gấp]`.
  - Cột `SCREENING`: Quá **72 giờ** chưa chuyển phỏng vấn/từ chối ➔ Gắn nhãn `[SLA Breached]`.

---

### BRL-08: Scorecard Evaluation Weighted Calculation
- When calculating overall interview score from multiple criteria:
  - **Overall Score = (Technical * 0.4) + (SoftSkills * 0.3) + (ProblemSolving * 0.3)**
  - Final score displayed on 5.0 scale (e.g. `4.2 / 5.0`).
- If an interviewer marks "Strong No Hire", flag the application for HR review regardless of the numerical score.

---

### BRL-09: Hạn ngạch Ứng tuyển Đa vị trí (Application Quota)
- Một ứng viên (nhận diện qua `Email + Phone`) được phép ứng tuyển tối đa **03 vị trí khác nhau trong vòng 90 ngày**.
- Nếu cố gắng nộp vị trí thứ 4, hệ thống chặn gửi đơn với thông báo: *"Bạn đã vượt quá giới hạn 03 vị trí trong 90 ngày. Vui lòng thử lại sau"*.

---

### BRL-Auth: Xác thực & Quản lý Tài khoản Nội bộ
- Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số.
- Khóa tài khoản tạm thời 15 phút nếu nhập sai mật khẩu quá 5 lần liên tiếp (chống tấn công dò mật khẩu Brute-force).
- Không mở đăng ký tự do (Public Register). Chỉ tài khoản có vai trò `ADMIN` mới có quyền tạo mới, khóa/mở khóa và phân quyền `HR` / `HIRING_MANAGER`.

---

## 5. Xử lý các Trường hợp Ngoại lệ (Edge Cases)

### Edge Case 1: Tệp CV có cài mật khẩu (Password-protected PDF) hoặc tệp lỗi
- Lớp 1 (Validation) phát hiện tệp mã hóa/hỏng ➔ Trả về mã lỗi 400 và thông báo thân thiện: *"Tệp PDF được cài mật khẩu bảo vệ hoặc bị lỗi định dạng. Vui lòng tải lên tệp mở"*. Không gửi tệp sang AI để tránh hao tổn tài nguyên.

### Edge Case 2: Gemini API Timeout hoặc mất mạng khi nộp CV (Fault Tolerance)
- Đơn nộp vẫn **được lưu thành công** vào CSDL ở trạng thái `NEW`, trường `aiMatchScore = NULL`.
- Hệ thống ghi log cảnh báo và hiển thị nút **[Chạy lại AI (Retry AI Parsing)]** trên màn hình quản lý của HR. Tuyệt đối không làm mất hồ sơ của ứng viên.

### Edge Case 3: Ứng viên nộp lại cùng 1 vị trí sau 30 ngày (Ví dụ đợt tuyển mới)
- Cho phép nộp và tạo bản ghi `Application` mới, đồng thời giữ nguyên `candidate_id` cũ.
- Tại Cửa sổ xem chi tiết ứng viên (Drawer), hiển thị thêm mục: *"Lịch sử ứng tuyển: Đã từng ứng tuyển đợt 1 ngày dd/mm/yyyy (Kết quả: Rớt sàng lọc)"*.
