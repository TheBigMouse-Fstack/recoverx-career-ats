"use client";

import { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Briefcase,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Star,
  ShieldAlert,
  ArrowRight,
  Loader2,
  History,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import ScorecardModal from "@/components/scorecard/ScorecardModal";

interface CandidateDrawerProps {
  applicationId: number | null;
  onClose: () => void;
  onStageChange: (appId: number, toStage: string) => Promise<boolean | string>;
}

export default function CandidateDrawer({
  applicationId,
  onClose,
  onStageChange,
}: CandidateDrawerProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "cv" | "history">("overview");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [isScorecardOpen, setIsScorecardOpen] = useState(false);

  // Tải chi tiết hồ sơ
  useEffect(() => {
    if (!applicationId) return;

    setLoading(true);
    setActionError("");
    fetch(`/api/applications/${applicationId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (!applicationId) return null;

  // Xử lý chuyển trạng thái nhanh từ trong Drawer
  const handleQuickMove = async (toStage: string) => {
    setActionError("");
    setActionLoading(true);
    const result = await onStageChange(applicationId, toStage);
    setActionLoading(false);

    if (typeof result === "string") {
      setActionError(result); // Báo lỗi BRL-06 hoặc lỗi nghiệp vụ
    } else if (result === true) {
      // Reload dữ liệu drawer
      fetch(`/api/applications/${applicationId}`)
        .then((r) => r.json())
        .then((r) => r.success && setData(r.data));
    }
  };

  // Parse JSON helper
  const safeParseJSON = (jsonString: string | null | undefined, fallback: any = []) => {
    if (!jsonString) return fallback;
    try {
      return JSON.parse(jsonString);
    } catch {
      return fallback;
    }
  };

  const parsedSkills = safeParseJSON(data?.candidate?.parsedSkills, []);
  const parsedEducation = safeParseJSON(data?.candidate?.parsedEducation, []);
  const parsedExperience = safeParseJSON(data?.candidate?.parsedExperience, []);
  const aiMatchedSkills = safeParseJSON(data?.aiMatchedSkills, []);
  const aiMissingSkills = safeParseJSON(data?.aiMissingSkills, []);

  const stages = [
    { key: "NEW", label: "Mới nộp (New)" },
    { key: "SCREENING", label: "Sàng lọc (Screening)" },
    { key: "INTERVIEW", label: "Phỏng vấn (Interview)" },
    { key: "HIRED", label: "Tuyển chọn (Hired)" },
    { key: "REJECTED", label: "Từ chối (Rejected)" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop mờ */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl sm:max-w-3xl bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700 uppercase tracking-wide">
                  Hồ sơ #{data?.id}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Cột: {data?.currentStage}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {loading ? "Đang tải hồ sơ..." : data?.candidate?.fullName}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{data?.job?.title} &bull; {data?.job?.department}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Bóc tách AI & Năng lực
            </button>

            <button
              onClick={() => setActiveTab("cv")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "cv"
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Xem trước CV Gốc
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Lịch sử Luân chuyển & Scorecard ({data?.evaluations?.length || 0})
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading ? (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600" />
                <p className="text-xs">Đang nạp chi tiết ứng viên & phân tích AI...</p>
              </div>
            ) : (
              <>
                {/* Lỗi nếu thao tác thất bại (VD vi phạm BRL-06) */}
                {actionError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Thao tác bị chặn:</p>
                      <p className="mt-0.5">{actionError}</p>
                    </div>
                  </div>
                )}

                {/* TAB 1: OVERVIEW & AI PARSING */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Hộp Thông tin Liên hệ */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Email</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {data?.candidate?.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Số điện thoại</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {data?.candidate?.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block mb-0.5">Kinh nghiệm</span>
                        <span className="font-semibold text-slate-800">
                          {data?.candidate?.experienceYears} năm thực tế
                        </span>
                      </div>
                    </div>

                    {/* Hộp AI Match Score & Giải trình Rationale (BRL-04) */}
                    <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 p-5 rounded-2xl border border-indigo-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">Điểm Phù hợp AI Match</h4>
                            <p className="text-[11px] text-slate-500">Đối chiếu tự động giữa CV và yêu cầu JD</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-brand-600">
                            {data?.aiMatchScore ? `${Math.round(data.aiMatchScore)}%` : "N/A"}
                          </span>
                        </div>
                      </div>

                      {data?.aiMatchRationale && (
                        <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-indigo-100/80 text-xs text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900 block mb-1">Giải trình AI (Rationale):</span>
                          {data.aiMatchRationale}
                        </div>
                      )}

                      {/* Phân tích Kỹ năng: Đạt vs Còn thiếu */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="bg-white/70 p-3 rounded-xl border border-emerald-100">
                          <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Kỹ năng Trùng khớp ({aiMatchedSkills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {aiMatchedSkills.length > 0 ? (
                              aiMatchedSkills.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs">Không có</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-white/70 p-3 rounded-xl border border-red-100">
                          <span className="text-[11px] font-bold text-red-800 flex items-center gap-1 mb-2">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            Kỹ năng Còn thiếu ({aiMissingSkills.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {aiMissingSkills.length > 0 ? (
                              aiMissingSkills.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px] font-medium border border-red-200">
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-emerald-600 text-xs font-semibold">Đạt trọn vẹn</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Danh sách Kỹ năng bóc tách từ CV */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Kỹ năng Bóc tách từ CV (Parsed Skills):
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedSkills.map((skill: string, idx: number) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Kinh nghiệm làm việc */}
                    {parsedExperience.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Kinh nghiệm Làm việc:
                        </h4>
                        <div className="space-y-2.5">
                          {parsedExperience.map((exp: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{exp.position}</span>
                                <span className="text-slate-400 font-normal">{exp.duration}</span>
                              </div>
                              <p className="text-brand-700 font-medium">{exp.company}</p>
                              {exp.summary && <p className="text-slate-600 mt-1">{exp.summary}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Học vấn */}
                    {parsedEducation.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-slate-500" /> Học vấn & Bằng cấp:
                        </h4>
                        <div className="space-y-2">
                          {parsedEducation.map((edu: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs">
                              <div className="flex justify-between font-bold text-slate-900">
                                <span>{edu.institution}</span>
                                <span className="text-slate-400 font-normal">{edu.grad_year}</span>
                              </div>
                              <p className="text-slate-600">{edu.degree}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: ORIGINAL CV PREVIEW */}
                {activeTab === "cv" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <FileText className="w-4 h-4 text-brand-600" />
                        <span>Tệp: {data?.candidate?.cvFileUrl}</span>
                      </div>
                      <span className="text-slate-400">Định dạng văn bản gốc bóc tách</span>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto border border-slate-800 shadow-inner">
                      {data?.candidate?.cvText || "Không có nội dung văn bản trích xuất."}
                    </div>
                  </div>
                )}

                {/* TAB 3: AUDIT LOGS & EVALUATIONS */}
                {activeTab === "history" && (
                  <div className="space-y-6">
                    {/* Scorecards */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-purple-600 fill-purple-600" />
                          Phiếu đánh giá phỏng vấn (Scorecards):
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsScorecardOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          + Chấm Điểm Scorecard (BRL-08)
                        </button>
                      </div>

                      {data?.evaluations?.length === 0 ? (
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                          Chưa có phiếu đánh giá Scorecard nào cho ứng viên này.
                        </div>
                      ) : (
                        data?.evaluations?.map((ev: any) => (
                          <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900">
                                Giám khảo: {ev.evaluator?.fullName} ({ev.evaluator?.role})
                              </span>
                              <span className="font-extrabold text-brand-600 text-sm">
                                {ev.overallScore ? `${ev.overallScore.toFixed(1)}/5.0` : "Chưa chấm"}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px]">
                              <div>Chuyên môn (40%): <b>{ev.technicalScore}/5★</b></div>
                              <div>Giao tiếp (30%): <b>{ev.communicationScore}/5★</b></div>
                              <div>Văn hóa (30%): <b>{ev.culturalFitScore}/5★</b></div>
                            </div>

                            {ev.comments && <p className="text-slate-600 italic">"{ev.comments}"</p>}
                            <div className="text-[10px] text-slate-400">Đánh giá lúc: {formatDateTime(ev.createdAt)}</div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Timeline Audit Logs */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-4 h-4 text-slate-500" />
                        Nhật ký Luân chuyển Trạng thái (Audit Logs):
                      </h4>

                      <div className="space-y-2">
                        {data?.auditLogs?.map((log: any) => (
                          <div key={log.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-slate-800">
                                Chuyển từ <span className="text-slate-500">{log.fromStage || "N/A"}</span> ➔{" "}
                                <span className="text-brand-600 font-bold">{log.toStage}</span>
                              </p>
                              <p className="text-[11px] text-slate-400">Thực hiện bởi: {log.user?.fullName || "Hệ thống"}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{formatDateTime(log.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Chuyển sang:</span>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((st) => (
                  <button
                    key={st.key}
                    disabled={actionLoading || data?.currentStage === st.key}
                    onClick={() => handleQuickMove(st.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      data?.currentStage === st.key
                        ? "bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed"
                        : st.key === "HIRED"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs"
                        : st.key === "REJECTED"
                        ? "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
                    }`}
                  >
                    {st.key}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Scorecard Modal (BRL-08) */}
      <ScorecardModal
        applicationId={applicationId}
        candidateName={data?.candidate?.fullName || ""}
        jobTitle={data?.job?.title || ""}
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
        onSuccess={() => {
          fetch(`/api/applications/${applicationId}`)
            .then((r) => r.json())
            .then((r) => r.success && setData(r.data));
        }}
      />
    </div>
  );
}
