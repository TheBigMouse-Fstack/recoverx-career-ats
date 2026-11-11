import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let sessionUser = getSessionUser();

    // Nếu chưa có cookie session (VD mới vào lần đầu), fallback lấy tài khoản HR Lead để demo thuận tiện
    if (!sessionUser) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: "HR" },
      });
      if (defaultUser) {
        sessionUser = {
          id: defaultUser.id,
          fullName: defaultUser.fullName,
          email: defaultUser.email,
          role: defaultUser.role as any,
        };
      }
    }

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (error) {
    return NextResponse.json({ success: false, user: null });
  }
}
