import Link from "next/link";
import {
  Briefcase,
  Users,
  Sparkles,
  Kanban,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                ReCoverX Career
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                ATS v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition-colors"
            >
              Cổng việc làm (Ứng viên)
            </Link>
            <Link
              href="/admin/pipeline"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm transition-all"
            >
              <Kanban className="w-4 h-4" />
              Kênh Tuyển dụng (HR)
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Mô hình Lai (Hybrid AI) — Lọc cứng tất định & Bóc tách ngữ nghĩa LLM
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nền tảng Tuyển dụng Thông minh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              ReCoverX Career
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Tự động hóa toàn diện từ thu thập hồ sơ đa nguồn, bóc tách CV bằng
            AI, so khớp tiêu chuẩn JD, quản lý Kanban 5 giai đoạn cho tới phiếu
            đánh giá Scorecard phỏng vấn.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/admin/pipeline"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all text-sm"
            >
              <Kanban className="w-4 h-4" />
              Mở Bảng Kanban Tuyển dụng
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 transition-all text-sm shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-brand-600" />
              Xem Cổng Tuyển dụng Công khai
            </Link>
          </div>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Lớp 1: Lọc cứng Tất định</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Khử trùng lặp Email + SĐT trong 30 ngày, giới hạn tệp 10MB và
              chặn hoàn toàn hồ sơ lỗi mà không tốn phí AI.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Lớp 2: Gemini AI Parsing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trích xuất học vấn, kỹ năng tương đương và tính điểm Match % có
              giải trình Rationale minh bạch cho HR.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Pipeline Kanban 5 Cột</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Kéo thả mượt mà qua các giai đoạn New, Screening, Interview,
              Hired và Rejected theo chuẩn Base E-Hiring.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Email Hoãn 12-24h</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cơ chế tự động hóa nhân văn, hoãn gửi thư từ chối để bảo vệ trải
              nghiệm và thương hiệu nhà tuyển dụng.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          ReCoverX Career ATS &bull; Kiến trúc Next.js 14 + Tailwind CSS + Prisma ORM + Gemini API
        </div>
      </footer>
    </div>
  );
}
