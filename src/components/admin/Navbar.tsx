"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Kanban,
  Users,
  Database,
  LogOut,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { SessionUser } from "@/lib/auth";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDemoDropdownOpen, setIsDemoDropdownOpen] = useState(false);

  // Lấy user hiện tại
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Chuyển vai trò Demo tức thì (1-Click Switcher)
  const handleQuickSwitch = async (email: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "123" }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        setIsDemoDropdownOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navLinks = [
    { href: "/admin/pipeline", label: "Pipeline Tuyển dụng", icon: Kanban },
    { href: "/admin/jobs", label: "Tin Tuyển dụng", icon: Briefcase },
    { href: "/admin/users", label: "Quản trị User (Admin)", icon: Users, adminOnly: true },
    { href: "/admin/talent-pool", label: "Kho Nhân tài", icon: Database },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-base text-slate-900 tracking-tight">ReCoverX</span>
                <span className="text-xs font-semibold text-brand-600 ml-1.5 px-1.5 py-0.5 bg-brand-50 rounded">
                  ATS
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                // Ẩn tab User nếu không phải Admin
                if (link.adminOnly && currentUser?.role !== "ADMIN") return null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User & 1-Click Demo Switcher */}
          <div className="flex items-center gap-3">
            {/* Thanh Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDemoDropdownOpen(!isDemoDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors shadow-xs"
                title="Đổi vai trò nhanh để thuyết trình đồ án ITBA"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-amber-600 ml-0.5" />
              </button>

              {isDemoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs space-y-1">
                  <div className="px-2 py-1 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    Chuyển nhanh vai trò Demo:
                  </div>

                  <button
                    onClick={() => handleQuickSwitch("admin@recoverx.career")}
                    className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">1. Nguyễn Văn An</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Vai trò: ADMIN (Toàn quyền)</p>
                    </div>
                    {currentUser?.role === "ADMIN" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => handleQuickSwitch("hr@recoverx.career")}
                    className="w-full text-left p-2 rounded-lg hover:bg-blue-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">2. Nguyễn Thu Hà</p>
                      <p className="text-[11px] text-blue-600 font-medium">Vai trò: HR LEAD (Tuyển dụng)</p>
                    </div>
                    {currentUser?.role === "HR" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => handleQuickSwitch("techlead@recoverx.career")}
                    className="w-full text-left p-2 rounded-lg hover:bg-purple-50 flex items-center justify-between text-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">3. Trần Minh Quân</p>
                      <p className="text-[11px] text-purple-600 font-medium">Vai trò: HIRING MANAGER (Chấm Scorecard)</p>
                    </div>
                    {currentUser?.role === "HIRING_MANAGER" && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900 leading-none">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {currentUser.role === "ADMIN" && "Quản trị viên"}
                    {currentUser.role === "HR" && "Chuyên viên Tuyển dụng"}
                    {currentUser.role === "HIRING_MANAGER" && "Quản lý Chuyên môn"}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                  {currentUser.fullName.charAt(0)}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-1"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
