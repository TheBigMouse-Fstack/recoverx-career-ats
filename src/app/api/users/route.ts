import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// GET: Lấy danh sách toàn bộ User nội bộ
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { jobs: true, evaluations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}

// POST: Tạo người dùng mới (Chỉ Admin mới có quyền theo BRL-Auth)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, role } = body;

    // Kiểm tra từng đầu vào và trả về field cụ thể
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập đầy đủ Họ và Tên nhân viên", field: "fullName" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập địa chỉ Email công ty", field: "email" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập Mật khẩu", field: "password" },
        { status: 400 }
      );
    }

    // BRL-Auth: Kiểm tra độ dài mật khẩu >= 8 ký tự
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: `Mật khẩu hiện có ${password.length} ký tự. Yêu cầu tối thiểu 8 ký tự theo quy tắc BRL-Auth.`,
          field: "password",
        },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa (Khử trùng lặp)
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Email "${email}" đã được đăng ký bởi nhân viên "${existing.fullName}" trong hệ thống.`,
          field: "email",
        },
        { status: 409 }
      );
    }

    // Tạo người dùng mới
    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: password, // Trong thực tế lưu hash bcrypt
        role: role.toUpperCase(),
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Tạo tài khoản người dùng thành công",
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi tạo người dùng" },
      { status: 500 }
    );
  }
}

// PATCH: Khóa / Mở khóa tài khoản hoặc cập nhật Vai trò
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, isActive, role } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Thiếu ID người dùng" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...(typeof isActive === "boolean" && { isActive }),
        ...(role && { role }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật người dùng" },
      { status: 500 }
    );
  }
}
