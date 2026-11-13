"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal create job
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Công nghệ thông tin");
  const [location, setLocation] = useState("Hồ Chí Minh");
  const [employmentType, setEmploymentType] = useState("Toàn thời gian");
  const [minExp, setMinExp] = useState("1");
  const [skillsText, setSkillsText] = useState("React, TypeScript, Tailwind");
  const [requirementsJd, setRequirementsJd] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = "Tiêu đề vị trí tuyển dụng bắt buộc";
    if (!department.trim()) errors.department = "Vui lòng chọn hoặc nhập phòng ban";
    if (!requirementsJd.trim()) errors.requirementsJd = "Mô tả công việc & JD chi tiết bắt buộc";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Vui lòng điền các trường bắt buộc được đánh dấu đỏ.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          department,
          location,
          employmentType,
          minExperienceYears: Number(minExp) || 0,
          requiredSkills: skillsText,
          requirementsJd,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setFormError(data.error || "Không thể tạo tin tuyển dụng");
      } else {
        setNotice(`Đã tạo tin tuyển dụng "${title}" thành công!`);
        setIsModalOpen(false);
        setTitle("");
        setRequirementsJd("");
        fetchJobs();
      }
    } catch (err: any) {
      setFormError("Lỗi kết nối máy chủ khi tạo tin.");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-brand-600" />
            Quản Lý Vị Trí Tuyển Dụng (Jobs)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tạo lập và theo dõi các tiêu chuẩn tuyển dụng (JD) phục vụ đối sánh AI Match tự động.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo Tin Tuyển Dụng Mới</span>
          </button>

          <button
            onClick={() => fetchJobs()}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-brand-600" : ""}`} />
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-emerald-500 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên vị trí hoặc phòng ban..."
            className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Grid Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-600" />
            Đang tải danh sách vị trí...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            Chưa có tin tuyển dụng nào phù hợp.
          </div>
        ) : (
          filteredJobs.map((job) => {
            let skills: string[] = [];
            try {
              skills = JSON.parse(job.requiredSkills || "[]");
            } catch {
              skills = [];
            }

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                      {job.department}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.minExperienceYears} năm KN
                    </span>
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 border border-slate-200"
                        >
                          {sk}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-50 text-slate-400">
                          +{skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-brand-600" />
                    <strong>{job._count?.applications || 0}</strong> ứng viên
                  </span>

                  <Link
                    href={`/jobs/${job.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-bold"
                  >
                    <span>Cổng ứng tuyển</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Tạo Tin Tuyển Dụng */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Thêm Vị Trí Tuyển Dụng Mới (Job)
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 flex items-start gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="font-semibold">{formError}</p>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tiêu đề vị trí (Job Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Senior Backend Engineer"
                  className={`w-full rounded-xl border py-2 px-3 font-medium ${
                    fieldErrors.title
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                />
                {fieldErrors.title && (
                  <p className="text-red-600 font-medium mt-1">{fieldErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phòng ban <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="VD: Kỹ thuật, Marketing"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa điểm</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại hình</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 font-medium"
                  >
                    <option value="Toàn thời gian">Toàn thời gian</option>
                    <option value="Bán thời gian">Bán thời gian</option>
                    <option value="Thực tập sinh">Thực tập sinh</option>
                    <option value="Hợp đồng dự án">Hợp đồng dự án</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số năm KN tối thiểu</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={minExp}
                    onChange={(e) => setMinExp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kỹ năng bắt buộc (Cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="React, Node.js, TypeScript, SQL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Chi tiết JD & Tiêu chuẩn tuyển dụng <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={requirementsJd}
                  onChange={(e) => setRequirementsJd(e.target.value)}
                  placeholder="Mô tả trách nhiệm công việc, yêu cầu chuyên môn, quyền lợi..."
                  className={`w-full rounded-xl border p-3 font-medium ${
                    fieldErrors.requirementsJd
                      ? "border-red-500 bg-red-50/20"
                      : "border-slate-200 bg-slate-50/50"
                  }`}
                />
                {fieldErrors.requirementsJd && (
                  <p className="text-red-600 font-medium mt-1">{fieldErrors.requirementsJd}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formLoading}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 rounded-xl shadow-md shadow-brand-500/20"
                >
                  {formLoading ? "Đang tạo..." : "Tạo tin tuyển dụng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
