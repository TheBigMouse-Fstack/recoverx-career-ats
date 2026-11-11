# Rule: Tailwind CSS & UI Component Standards

## 1. Design System & Theme
- **Color Palette:** Modern Slate/Zinc with primary Indigo/Blue accents.
  - Background: Neutral light gray (`bg-slate-50` or `bg-zinc-100`).
  - Cards & Containers: Pure white (`bg-white`), subtle border (`border-slate-200`), rounded corners (`rounded-xl` or `rounded-lg`).
  - Text: High-contrast primary (`text-slate-900`), secondary (`text-slate-500`).
- **Icons:** Always use `lucide-react` icons (e.g. `Briefcase`, `Users`, `CheckCircle2`, `Clock`, `Star`, `UploadCloud`, `FileText`, `ChevronRight`).

## 2. Key Screen UI Specifications

### A. SCR-04: Kanban Pipeline Board (Core Dashboard)
- **5 Columns:**
  1. `NEW` (Received applications, awaiting review)
  2. `SCREENING` (AI parsed, undergoing criteria screening)
  3. `INTERVIEW` (Shortlisted, scheduling & scorecard evaluation)
  4. `HIRED` (Offer issued / accepted)
  5. `REJECTED` (Disqualified or rejected with delay buffer)
- **Candidate Card:**
  - Candidate Full Name & Applied Role
  - Match Score Badge: Green (>= 80%), Yellow (60-79%), Red (< 60%)
  - Experience badge (e.g., "3 yrs exp")
  - Quick actions: Click card to open Candidate Drawer.

### B. SCR-05: Candidate Detail Drawer (Slide-over from right)
- Width: `w-full max-w-2xl` sliding from right edge on backdrop overlay.
- Tab 1: AI Parsed Overview (Personal info, Skills list, Education, Summary).
- Tab 2: Original CV Preview (Embedded PDF viewer or download link).
- Tab 3: Evaluation & Match Rationale (Why AI scored this %, strengths & gaps).

### C. SCR-06: Interview Scorecard Modal
- Pop-up Dialog with star ratings (1 to 5 stars) for key criteria:
  - Technical Competency (Trọng số 40%)
  - Cultural Fit & Soft Skills (Trọng số 30%)
  - Problem Solving (Trọng số 30%)
- Overall Recommendation: "Strong Hire", "Hire", "No Hire", "Strong No Hire".
- Note text area and "Submit Evaluation" button.

## 3. Responsive & Accessibility Guidelines
- Use utility function `cn()` from `src/lib/utils.ts` (combining `clsx` and `tailwind-merge`).
- Ensure hover states, active states, and focus rings (`focus:ring-2 focus:ring-indigo-500`) are clearly visible for keyboard accessibility.

## 4. Bắt buộc Tuân thủ: Quy chuẩn UI/UX & Xử lý Lỗi Biểu mẫu (Form Validation)
AI Agents MUST strictly enforce `docs/11_UI_UX_Design_and_Form_Validation_Guidelines.md` across all screens:
1. **Field-level Error Highlighting:**
   - Khi ô input bị lỗi: bắt buộc dùng `border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-red-50/20`.
   - Bắt buộc có dòng thông báo lỗi cụ thể ngay dưới chân: `<p className="text-xs text-red-600 mt-1 flex items-center gap-1">`.
2. **Actionable Error Messages:**
   - Tuyệt đối không dùng thông báo chung chung ("Lỗi", "Thất bại").
   - Phải chỉ rõ sai cái gì, thiếu cái gì (ví dụ: "Mật khẩu chỉ có 5 ký tự (yêu cầu tối thiểu 8 ký tự theo BRL-Auth)").
3. **Deduplication UI:**
   - Khi phát hiện trùng lặp Email/Phone, nêu rõ đối tượng bị trùng và thời điểm nộp đơn trước đó.
4. **Context Isolation:**
   - Trang Login và Cổng Public tuyệt đối không hiển thị Navbar hoặc thông tin tài khoản nội bộ.
