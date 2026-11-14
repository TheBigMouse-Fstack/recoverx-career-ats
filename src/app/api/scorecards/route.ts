import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Lấy danh sách phiếu đánh giá
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    const where: any = {};
    if (applicationId) {
      where.applicationId = Number(applicationId);
    }

    const evaluations = await prisma.evaluation.findMany({
      where,
      include: {
        evaluator: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        application: {
          include: {
            candidate: true,
            job: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: evaluations });
  } catch (error: any) {
    console.error("GET /api/scorecards error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách phiếu đánh giá" },
      { status: 500 }
    );
  }
}

// POST: Tạo phiếu đánh giá Scorecard mới theo quy tắc BRL-08
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      applicationId,
      technicalScore,
      communicationScore,
      culturalFitScore,
      comments,
      recommendation,
    } = body;

    const fieldErrors: Record<string, string> = {};

    if (!applicationId) {
      fieldErrors.applicationId = "Thiếu mã hồ sơ ứng tuyển";
    }

    const tech = Number(technicalScore);
    const comm = Number(communicationScore);
    const cult = Number(culturalFitScore);

    if (isNaN(tech) || tech < 1 || tech > 5) {
      fieldErrors.technicalScore = "Điểm kỹ năng chuyên môn phải từ 1 đến 5 sao";
    }
    if (isNaN(comm) || comm < 1 || comm > 5) {
      fieldErrors.communicationScore = "Điểm kỹ năng giao tiếp phải từ 1 đến 5 sao";
    }
    if (isNaN(cult) || cult < 1 || cult > 5) {
      fieldErrors.culturalFitScore = "Điểm độ phù hợp văn hóa phải từ 1 đến 5 sao";
    }

    if (!recommendation) {
      fieldErrors.recommendation = "Vui lòng chọn khuyến nghị tuyển dụng";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu đánh giá chưa hợp lệ. Vui lòng kiểm tra lại các trường được đánh dấu đỏ.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // 1. Kiểm tra Application có tồn tại không
    const app = await prisma.application.findUnique({
      where: { id: Number(applicationId) },
      include: { candidate: true, job: true },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ ứng tuyển này" },
        { status: 404 }
      );
    }

    // 2. TÍNH ĐIỂM TRUNG BÌNH CÓ TRỌNG SỐ THEO BRL-08:
    // Chuyên môn (40%) + Giao tiếp (30%) + Văn hóa (30%)
    const overallScore = Number((tech * 0.4 + comm * 0.3 + cult * 0.3).toFixed(2));

    // 3. Xác định Giám khảo (Evaluator) từ Session hoặc User mặc định
    const sessionUser = getSessionUser();
    let evaluatorId = sessionUser ? sessionUser.id : null;

    if (!evaluatorId) {
      // Tìm tài khoản Hiring Manager hoặc HR đầu tiên
      const fallbackUser = await prisma.user.findFirst({
        where: { role: { in: ["HIRING_MANAGER", "HR", "ADMIN"] } },
      });
      evaluatorId = fallbackUser ? fallbackUser.id : 1;
    }

    // 4. Lưu Evaluation và AuditLog trong Transaction
    const [evaluation] = await prisma.$transaction([
      prisma.evaluation.create({
        data: {
          applicationId: app.id,
          evaluatorId,
          technicalScore: tech,
          communicationScore: comm,
          culturalFitScore: cult,
          overallScore,
          comments: comments ? String(comments).trim() : null,
          recommendation: recommendation || "HIRE",
        },
        include: {
          evaluator: {
            select: { id: true, fullName: true, role: true },
          },
        },
      }),
      prisma.auditLog.create({
        data: {
          applicationId: app.id,
          userId: evaluatorId,
          fromStage: app.currentStage,
          toStage: app.currentStage,
          action: "SCORECARD_EVALUATE",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Đã lưu phiếu đánh giá Scorecard thành công (${overallScore}/5.0★)`,
      data: evaluation,
    });
  } catch (error: any) {
    console.error("POST /api/scorecards error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Lỗi hệ thống khi lưu phiếu đánh giá: " + (error.message || "Unknown error"),
      },
      { status: 500 }
    );
  }
}

