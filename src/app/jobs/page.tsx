import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cơ Hội Nghề Nghiệp | ReCoverX Career",
  description: "Khám phá các cơ hội nghề nghiệp công nghệ hấp dẫn tại ReCoverX Career.",
};

export default async function JobsPublicPage() {
  const jobs = await prisma.job.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  // Gom nhóm phòng ban để hiển thị tag
  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Header Public */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                ReCoverX Career
              </span>
              <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                Tuyển Dụng
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Trang chủ
            </Link>
            <Link
              href="/admin/login"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              Cổng Nội Bộ
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Banner Hero */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Tuyển Dụng Đón Đầu Công Nghệ 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Gia nhập Đội ngũ ReCoverX Career
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Hệ thống ứng tuyển thông minh ứng dụng AI tự động phân tích hồ sơ và phản hồi nhanh chóng, minh bạch cho ứng viên.
          </p>

          {/* Tag phòng ban */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Phòng ban:
            </span>
            {departments.map((dep) => (
              <span
                key={dep}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
              >
                {dep}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Danh sách công việc mở tuyển */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" />
            Các Vị Trí Đang Tuyển Dụng ({jobs.length})
          </h2>
          <span className="text-xs text-slate-500">
            Hồ sơ được bảo mật và sàng lọc tự động theo BRL-01 & BRL-02
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">Hiện chưa có vị trí nào đang mở tuyển</h3>
            <p className="text-xs text-slate-500">Vui lòng quay lại sau hoặc liên hệ bộ phận tuyển dụng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => {
              let skills: string[] = [];
              try {
                skills = JSON.parse(job.requiredSkills || "[]");
              } catch {
                skills = [];
              }

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200/70 mb-2">
                          {job.department}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        <CheckCircle className="w-3 h-3" />
                        Đang mở
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.employmentType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        Tối thiểu {job.minExperienceYears} năm KN
                      </span>
                    </div>

                    {/* Kỹ năng yêu cầu */}
                    {skills.length > 0 && (
                      <div className="pt-2">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Kỹ năng trọng yếu:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {skills.length > 5 && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-50 text-slate-500 border border-slate-200">
                              +{skills.length - 5}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Nút xem chi tiết & ứng tuyển */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Đăng tuyển: {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                    </span>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all"
                    >
                      Ứng tuyển ngay
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>© 2026 ReCoverX Career — Hệ thống Quản trị Tuyển dụng ATS Thông minh.</p>
        <p className="mt-1 text-slate-400">
          Tuân thủ bộ quy tắc chuẩn nghiệp vụ ITBA: BRL-01, BRL-02, BRL-04, BRL-09.
        </p>
      </footer>
    </div>
  );
}
