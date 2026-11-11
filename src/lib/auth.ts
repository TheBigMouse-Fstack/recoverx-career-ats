import { cookies } from "next/headers";
import { UserRole } from "@/types";

export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
}

const SESSION_COOKIE_NAME = "ats_user_session";

// Ghi cookie phiên đăng nhập
export function createSessionCookie(user: SessionUser) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  });
}

// Đọc cookie phiên đăng nhập hiện tại
export function getSessionUser(): SessionUser | null {
  try {
    const cookieStore = cookies();
    const sessionVal = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionVal) return null;
    return JSON.parse(sessionVal) as SessionUser;
  } catch {
    return null;
  }
}

// Xóa phiên đăng nhập
export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
