"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface JobApplicationFormProps {
  jobId: number;
  jobTitle: string;
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
}: JobApplicationFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Xóa lỗi trường khi người dùng gõ
  const handleInputChange = (
    field: string,
    value: string,
    setter: (val: string) => void
  ) => {
    setter(value);
    if (fieldErrors[field]) {
      const nextErrors = { ...fieldErrors };
      delete nextErrors[field];
      setFieldErrors(nextErrors);
    }
    if (formError) setFormError(null);
  };

  // Xử lý chọn file
  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Reset lỗi tệp cũ
    const nextErrors = { ...fieldErrors };
    delete nextErrors.cvFile;
    setFieldErrors(nextErrors);
    setFormError(null);

    // BRL-01: Định dạng và dung lượng
    const validExtensions = [".pdf", ".docx"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const maxSizeBytes = 10 * 1024 * 1024;

    if (!validExtensions.includes(ext)) {
      setFieldErrors((prev) => ({
        ...prev,
        cvFile: "Chỉ chấp nhận tệp .pdf hoặc .docx theo quy tắc BRL-01",
      }));
      return;
    }

    if (file.size > maxSizeBytes) {
      setFieldErrors((prev) => ({
        ...prev,
        cvFile: `Dung lượng tệp (${(file.size / (1024 * 1024)).toFixed(1)}MB) vượt quá giới hạn 10MB (BRL-01)`,
      }));
      return;
    }

    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation sơ bộ client-side
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = "Họ và tên bắt buộc và phải từ 2 ký tự trở lên";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = "Vui lòng nhập địa chỉ email hợp lệ (VD: ungvien@gmail.com)";
    }
    const cleanPhone = phone.replace(/\s+/g, "");
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      errors.phone = "Số điện thoại hợp lệ phải từ 10 số, bắt đầu bằng 0 hoặc +84";
    }
    if (!cvFile) {
      errors.cvFile = "Vui lòng tải lên tệp CV của bạn (.pdf hoặc .docx)";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Vui lòng bổ sung đầy đủ thông tin vào các trường được đánh dấu đỏ.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobId", String(jobId));
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", cleanPhone);
      formData.append("cvFile", cvFile!);

      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setFormError(data.error || "Không thể nộp hồ sơ. Vui lòng kiểm tra lại thông tin.");
      } else {
        setSuccessResult(data.data);
      }
    } catch (err: any) {
      console.error("Submit application error:", err);
      setFormError("Lỗi kết nối máy chủ khi nộp hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // MÀN HÌNH THÀNH CÔNG (Sau khi nộp và AI bóc tách hoàn tất)
  if (successResult) {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm space-y-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Nộp Hồ Sơ Ứng Tuyển Thành Công!
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hồ sơ mã #{successResult.applicationId} đã được hệ thống ATS tiếp nhận.
            </p>
          </div>
        </div>

        {/* Thẻ kết quả AI Phân tích & So khớp */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Kết quả AI Sàng lọc Ban đầu
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${successResult.aiMatchScore >= 75
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : successResult.aiMatchScore >= 60
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-300"
                }`}
            >
              Match Score: {successResult.aiMatchScore}%
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-200">
            {successResult.aiMatchRationale}
          </p>

          {successResult.matchedSkills && successResult.matchedSkills.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-1">
                Kỹ năng phù hợp với vị trí:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {successResult.matchedSkills.map((sk: string) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    ✔ {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thông điệp tiếp theo */}
        <div className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>Hồ sơ đã được mã hóa và chuyển tới bộ phận Tuyển dụng (HR).</span>
          </p>
          <p className="text-slate-500">
            Bạn sẽ nhận được email phản hồi về các bước tiếp theo hoặc kết quả phỏng vấn qua hòm thư:{" "}
            <strong>{email}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/jobs"
            className="flex-1 py-3 px-4 rounded-xl text-center bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Khám phá vị trí tuyển dụng khác
          </Link>
          <button
            onClick={() => {
              setSuccessResult(null);
              setFullName("");
              setEmail("");
              setPhone("");
              setCvFile(null);
            }}
            className="py-3 px-4 rounded-xl text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
          >
            Nộp hồ sơ khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          Ứng tuyển vị trí này
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Điền thông tin và tải lên CV để hệ thống AI tự động đối chiếu với tiêu chuẩn tuyển dụng.
        </p>
      </div>

      {/* Banner báo lỗi tổng thể */}
      {formError && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3.5 text-red-900 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">{formError}</p>
        </div>
      )}

      {/* 1. Họ và tên */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Họ và tên của bạn <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value, setFullName)}
          placeholder="Ví dụ: Nguyễn Văn An"
          disabled={loading}
          className={`w-full text-xs rounded-xl border py-2.5 px-3.5 font-medium transition-all focus:outline-none focus:ring-2 ${fieldErrors.fullName
              ? "border-red-500 bg-red-50/20 focus:ring-red-500/20 text-red-900"
              : "border-slate-200 bg-slate-50/50 focus:ring-brand-500 focus:bg-white text-slate-900"
            }`}
        />
        {fieldErrors.fullName && (
          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{fieldErrors.fullName}</span>
          </p>
        )}
      </div>

      {/* 2. Địa chỉ Email */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Địa chỉ Email liên hệ <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => handleInputChange("email", e.target.value, setEmail)}
          placeholder="Ví dụ: an.nguyen@example.com"
          disabled={loading}
          className={`w-full text-xs rounded-xl border py-2.5 px-3.5 font-medium transition-all focus:outline-none focus:ring-2 ${fieldErrors.email
              ? "border-red-500 bg-red-50/20 focus:ring-red-500/20 text-red-900"
              : "border-slate-200 bg-slate-50/50 focus:ring-brand-500 focus:bg-white text-slate-900"
            }`}
        />
        {fieldErrors.email && (
          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{fieldErrors.email}</span>
          </p>
        )}
      </div>

      {/* 3. Số điện thoại */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Số điện thoại di động <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => handleInputChange("phone", e.target.value, setPhone)}
          placeholder="Ví dụ: 0912345678 hoặc +84912345678"
          disabled={loading}
          className={`w-full text-xs rounded-xl border py-2.5 px-3.5 font-medium transition-all focus:outline-none focus:ring-2 ${fieldErrors.phone
              ? "border-red-500 bg-red-50/20 focus:ring-red-500/20 text-red-900"
              : "border-slate-200 bg-slate-50/50 focus:ring-brand-500 focus:bg-white text-slate-900"
            }`}
        />
        {fieldErrors.phone && (
          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{fieldErrors.phone}</span>
          </p>
        )}
      </div>

      {/* 4. Tải lên tệp CV (BRL-01: PDF/DOCX <= 10MB) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Hồ sơ CV cá nhân (PDF hoặc DOCX, tối đa 10MB) <span className="text-red-500">*</span>
        </label>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${fieldErrors.cvFile
              ? "border-red-400 bg-red-50/30 hover:bg-red-50/50"
              : cvFile
                ? "border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/50"
                : "border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-brand-400"
            }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />

          {cvFile ? (
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                    {cvFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Tệp hợp lệ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCvFile(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600 transition-colors"
                title="Gỡ bỏ tệp"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Nhấp để tải lên hoặc kéo thả tệp CV vào đây
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Định dạng hỗ trợ: PDF, DOCX (Dung lượng tối đa 10MB theo BRL-01)
                </p>
              </div>
            </div>
          )}
        </div>

        {fieldErrors.cvFile && (
          <p className="text-[11px] text-red-600 font-medium mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{fieldErrors.cvFile}</span>
          </p>
        )}
      </div>

      {/* Ràng buộc nghiệp vụ note */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Lưu ý khi nộp hồ sơ:</p>
        <p>• BRL-02: Khử trùng lặp — không thể nộp lại cùng 1 vị trí trong 30 ngày.</p>
        <p>• BRL-09: Giới hạn ứng tuyển — tối đa 3 vị trí trong vòng 90 ngày.</p>
      </div>

      {/* Nút gửi form */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tải lên & Phân tích CV qua AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Nộp hồ sơ ngay & Kiểm tra Match AI</span>
          </>
        )}
      </button>
    </form>
  );
}


