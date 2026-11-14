import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Lấy toàn bộ danh sách tin tuyển dụng nội bộ
export async function GET(req: Request) {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        creator: {
          select: { id: true, fullName: true, role: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách tin tuyển dụng" },
      { status: 500 }
    );
  }
}

// POST: Tạo tin tuyển dụng mới
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      department,
      location,
      employmentType,
      minExperienceYears,
      requiredSkills,
      requirementsJd,
    } = body;

    const fieldErrors: Record<string, string> = {};

    if (!title || !title.trim()) {
      fieldErrors.title = "Tiêu đề vị trí tuyển dụng không được để trống";
    }
    if (!department || !department.trim()) {
      fieldErrors.department = "Vui lòng nhập hoặc chọn phòng ban";
    }
    if (!requirementsJd || !requirementsJd.trim()) {
      fieldErrors.requirementsJd = "Mô tả chi tiết và yêu cầu JD bắt buộc phải có";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu tạo tin tuyển dụng chưa đầy đủ. Vui lòng kiểm tra lại các trường được đánh dấu đỏ.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const sessionUser = getSessionUser();
    let creatorId = sessionUser ? sessionUser.id : null;

    if (!creatorId) {
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ["ADMIN", "HR"] } },
      });
      creatorId = fallbackUser ? fallbackUser.id : 1;
    }

    // Xử lý skills mảng thành JSON string
    let formattedSkills = "[]";
    if (Array.isArray(requiredSkills)) {
      formattedSkills = JSON.stringify(requiredSkills.filter(Boolean));
    } else if (typeof requiredSkills === "string") {
      const parsed = requiredSkills
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      formattedSkills = JSON.stringify(parsed);
    }

    const job = await prisma.job.create({
      data: {
        creatorId,
        title: title.trim(),
        department: department.trim(),
        location: location?.trim() || "Hồ Chí Minh",
        employmentType: employmentType?.trim() || "Toàn thời gian",
        minExperienceYears: Number(minExperienceYears) || 0,
        requiredSkills: formattedSkills,
        requirementsJd: requirementsJd.trim(),
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Tạo tin tuyển dụng "${job.title}" thành công!`,
      data: job,
    });
  } catch (error: any) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi hệ thống khi tạo vị trí tuyển dụng: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

