"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Đăng nhập thất bại");
        return;
      }

      router.push("/admin/pipeline");
      router.refresh();
    } catch {
      setErrorMessage("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Nút đăng nhập 1-click cho Demo đồ án
  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("123456");
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: "123456" }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin/pipeline");
        router.refresh();
      } else {
        setErrorMessage(data.error);
      }
    } catch {
      setErrorMessage("Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-brand-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
            <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">
            ReCoverX Career
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Cổng Quản trị Tuyển dụng Nội bộ
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Dành cho Ban Tuyển dụng (HR), Hiring Manager và Quản trị viên
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Thông báo lỗi nếu có */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form đăng nhập tiêu chuẩn */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email doanh nghiệp
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@recoverx.career"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Tiện ích Demo Switcher (Phục vụ Thuyết trình đồ án ITBA) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Tiện ích Thuyết trình ITBA (1-Click Login):</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin@recoverx.career")}
                className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900">1. Đăng nhập quyền ADMIN</p>
                  <p className="text-[11px] text-emerald-700">Nguyễn Văn An &bull; Quản trị người dùng & CSDL</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                  Chọn
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("hr@recoverx.career")}
                className="w-full text-left p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900">2. Đăng nhập quyền HR LEAD</p>
                  <p className="text-[11px] text-blue-700">Nguyễn Thu Hà &bull; Quản lý Pipeline Kanban & Duyệt CV</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                  Chọn
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("techlead@recoverx.career")}
                className="w-full text-left p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-900">3. Đăng nhập quyền HIRING MANAGER</p>
                  <p className="text-[11px] text-purple-700">Trần Minh Quân &bull; Chấm điểm Scorecard phỏng vấn</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-800">
                  Chọn
                </span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Bạn là ứng viên muốn nộp hồ sơ?{" "}
          <Link href="/jobs" className="font-semibold text-brand-600 hover:text-brand-700 underline">
            Đến Cổng việc làm công khai
          </Link>
        </p>
      </div>
    </div>
  );
}
