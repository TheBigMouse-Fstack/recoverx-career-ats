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

    // Kiểm tra đầu vào
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Vui lòng điền đầy đủ Họ tên, Email, Mật khẩu và Vai trò" },
        { status: 400 }
      );
    }

    // BRL-Auth: Kiểm tra độ dài mật khẩu >= 8 ký tự
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Mật khẩu phải có tối thiểu 8 ký tự theo BRL-Auth" },
        { status: 400 }
      );
    }

    // Kiểm tra email đã tồn tại chưa
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email này đã được sử dụng trong hệ thống" },
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
