import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { UserRole } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Kiểm tra thiếu trường
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập địa chỉ Email", field: "email" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập Mật khẩu", field: "password" },
        { status: 400 }
      );
    }

    // Tìm tài khoản theo email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: `Không tìm thấy tài khoản với email "${email}". Vui lòng kiểm tra lại.`,
          field: "email",
        },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Tài khoản của bạn đã bị Quản trị viên tạm khóa. Vui lòng liên hệ Admin.",
          field: "email",
        },
        { status: 403 }
      );
    }

    // Kiểm tra mật khẩu chính xác
    const isMatch = user.passwordHash === password;

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Mật khẩu không chính xác. Vui lòng kiểm tra lại.",
          field: "password",
        },
        { status: 401 }
      );
    }

    // Tạo phiên đăng nhập
    const sessionUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role as UserRole,
    };

    createSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      user: sessionUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi xử lý đăng nhập" },
      { status: 500 }
    );
  }
}
