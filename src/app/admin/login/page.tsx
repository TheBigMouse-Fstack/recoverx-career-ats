"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [errorField, setErrorField] = useState<"email" | "password" | "">("");
  const [fieldMessage, setFieldMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setErrorField("");
    setFieldMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.field) {
          setErrorField(data.field);
          setFieldMessage(data.error);
        } else {
          setGeneralError(data.error || "Đăng nhập thất bại");
        }
        return;
      }

      router.push("/admin/pipeline");
      router.refresh();
    } catch {
      setGeneralError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-brand-50/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            ReCoverX Career
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cổng Đăng Nhập Quản Trị
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Hệ thống Quản lý Tuyển dụng & Hồ sơ Ứng viên (ATS)
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Lỗi chung nếu có */}
          {generalError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Trường Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email tài khoản <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    errorField === "email" ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorField === "email") {
                      setErrorField("");
                      setFieldMessage("");
                    }
                  }}
                  placeholder="admin@recoverx.career hoặc hr@recoverx.career"
                  className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-sm transition-all text-slate-900 ${
                    errorField === "email"
                      ? "border-red-500 bg-red-50/20 text-red-900 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400"
                  }`}
                />
              </div>
              {/* Dòng báo lỗi đỏ ngay dưới ô Email */}
              {errorField === "email" && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldMessage}</span>
                </p>
              )}
            </div>

            {/* Trường Mật khẩu */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                    errorField === "password" ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorField === "password") {
                      setErrorField("");
                      setFieldMessage("");
                    }
                  }}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-sm transition-all text-slate-900 ${
                    errorField === "password"
                      ? "border-red-500 bg-red-50/20 text-red-900 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-400"
                  }`}
                />
              </div>
              {/* Dòng báo lỗi đỏ ngay dưới ô Mật khẩu */}
              {errorField === "password" && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldMessage}</span>
                </p>
              )}
            </div>

            {/* Nút Đăng nhập có trạng thái Loading */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xác thực tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập hệ thống</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/jobs"
              className="text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
            >
              ← Quay lại Cổng việc làm công khai
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Chỉ dành riêng cho nhân sự được phân quyền truy cập ReCoverX Career
        </p>
      </div>
    </div>
  );
}
