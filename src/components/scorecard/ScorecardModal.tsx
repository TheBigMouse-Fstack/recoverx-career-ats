"use client";

import { useState } from "react";
import {
  X,
  Star,
  Award,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
} from "lucide-react";

interface ScorecardModalProps {
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScorecardModal({
  applicationId,
  candidateName,
  jobTitle,
  isOpen,
  onClose,
  onSuccess,
}: ScorecardModalProps) {
  const [techScore, setTechScore] = useState<number>(4);
  const [commScore, setCommScore] = useState<number>(4);
  const [cultScore, setCultScore] = useState<number>(4);
  const [recommendation, setRecommendation] = useState<string>("HIRE");
  const [comments, setComments] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Tính điểm tổng hợp có trọng số theo BRL-08
  const overallScore = (techScore * 0.4 + commScore * 0.3 + cultScore * 0.3).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!techScore || techScore < 1 || techScore > 5) {
      errors.techScore = "Vui lòng cho điểm chuyên môn từ 1 đến 5";
    }
    if (!commScore || commScore < 1 || commScore > 5) {
      errors.commScore = "Vui lòng cho điểm giao tiếp từ 1 đến 5";
    }
    if (!cultScore || cultScore < 1 || cultScore > 5) {
      errors.cultScore = "Vui lòng cho điểm văn hóa từ 1 đến 5";
    }
    if (!recommendation) {
      errors.recommendation = "Vui lòng chọn khuyến nghị tuyển dụng";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Vui lòng hoàn thiện các tiêu chí đánh giá bắt buộc.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/scorecards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          technicalScore: techScore,
          communicationScore: commScore,
          culturalFitScore: cultScore,
          recommendation,
          comments,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setError(data.error || "Không thể lưu phiếu đánh giá Scorecard");
      } else {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error("Scorecard submit error:", err);
      setError("Lỗi kết nối máy chủ khi lưu phiếu đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  const renderStarButtons = (
    value: number,
    onChange: (val: number) => void,
    fieldKey: string
  ) => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              onChange(star);
              if (fieldErrors[fieldKey]) {
                const next = { ...fieldErrors };
                delete next[fieldKey];
                setFieldErrors(next);
              }
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${star <= value
                ? "bg-amber-500 text-white shadow-xs scale-105"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
          >
            <Star
              className={`w-4 h-4 ${star <= value ? "fill-white" : ""}`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-700 ml-2">
          {value}/5 sao
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200 mb-1.5">
              <Award className="w-3.5 h-3.5" />
              Quy tắc chuẩn BRL-08
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Đánh Giá Phỏng Vấn (Scorecard)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ứng viên: <strong className="text-slate-800">{candidateName}</strong> —{" "}
              {jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Lỗi */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-red-900 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tiêu chí 1: Kỹ năng Chuyên môn (40%) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                1. Kỹ năng Chuyên môn (Technical Skills)
              </label>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Trọng số 40%
              </span>
            </div>
            {renderStarButtons(techScore, setTechScore, "techScore")}
            {fieldErrors.techScore && (
              <p className="text-[11px] text-red-600 font-medium mt-1">
                {fieldErrors.techScore}
              </p>
            )}
          </div>

          {/* Tiêu chí 2: Giao tiếp & Ứng xử (30%) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                2. Giao tiếp & Thuyết trình (Communication)
              </label>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Trọng số 30%
              </span>
            </div>
            {renderStarButtons(commScore, setCommScore, "commScore")}
            {fieldErrors.commScore && (
              <p className="text-[11px] text-red-600 font-medium mt-1">
                {fieldErrors.commScore}
              </p>
            )}
          </div>

          {/* Tiêu chí 3: Phù hợp Văn hóa & Thái độ (30%) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                3. Văn hóa & Tinh thần Đồng đội (Cultural Fit)
              </label>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Trọng số 30%
              </span>
            </div>
            {renderStarButtons(cultScore, setCultScore, "cultScore")}
            {fieldErrors.cultScore && (
              <p className="text-[11px] text-red-600 font-medium mt-1">
                {fieldErrors.cultScore}
              </p>
            )}
          </div>

          {/* Preview Điểm có trọng số BRL-08 */}
          <div className="bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                Điểm Đánh Giá Tổng Hợp (BRL-08):
              </p>
              <p className="text-[11px] text-brand-700 mt-0.5">
                = (Chuyên môn × 0.4) + (Giao tiếp × 0.3) + (Văn hóa × 0.3)
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand-700">
                {overallScore}
              </span>
              <span className="text-xs font-bold text-brand-600"> / 5.0★</span>
            </div>
          </div>

          {/* Quyết định Khuyến nghị */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Khuyến nghị Tuyển dụng <span className="text-red-500">*</span>
            </label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="STRONG_HIRE">🌟 Xuất sắc — Tuyển dụng ngay (Strong Hire)</option>
              <option value="HIRE">✅ Đạt chuẩn — Đề xuất tuyển dụng (Hire)</option>
              <option value="NO_HIRE">⚠️ Chưa đạt — Xem xét từ chối (No Hire)</option>
              <option value="STRONG_NO_HIRE">⛔ Không phù hợp (Strong No Hire)</option>
            </select>
          </div>

          {/* Ghi chú nhận xét */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nhận xét chi tiết của Người phỏng vấn
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ghi nhận điểm mạnh, điểm cần cải thiện hoặc lý do đề xuất..."
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 rounded-xl shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Lưu Phiếu Đánh Giá (Mở khóa Hired)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


