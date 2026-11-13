import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, toStage } = body;

    if (!applicationId || !toStage) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID hồ sơ hoặc trạng thái đích" },
        { status: 400 }
      );
    }

    const validStages = ["NEW", "SCREENING", "INTERVIEW", "HIRED", "REJECTED"];
    if (!validStages.includes(toStage)) {
      return NextResponse.json(
        { success: false, error: `Trạng thái "${toStage}" không hợp lệ` },
        { status: 400 }
      );
    }

    // 1. Tìm hồ sơ ứng tuyển
    const app = await prisma.application.findUnique({
      where: { id: Number(applicationId) },
      include: {
        candidate: true,
        job: true,
        evaluations: true,
      },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ ứng tuyển này" },
        { status: 404 }
      );
    }

    const fromStage = app.currentStage;

    // Không chuyển nếu cùng trạng thái
    if (fromStage === toStage) {
      return NextResponse.json({ success: true, data: app });
    }

    // 2. KIỂM TRA BRL-06: STAGE GATE RULE TRƯỚC KHI HIRED
    if (toStage === "HIRED") {
      if (app.evaluations.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Không thể chuyển sang giai đoạn HIRED: Ứng viên cần có ít nhất 01 phiếu đánh giá Scorecard hoàn tất từ Hiring Manager theo quy tắc BRL-06.",
            rule: "BRL-06",
          },
          { status: 400 }
        );
      }
    }

    // 3. KIỂM TRA BRL-05: DELAY BUFFER CHO EMAIL TỪ CHỐI
    let emailScheduledAt: Date | null = app.emailScheduledAt;
    if (toStage === "REJECTED") {
      // Hẹn giờ sau 12 tiếng
      emailScheduledAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    }

    // 4. Lấy thông tin người thực hiện từ session
    const sessionUser = getSessionUser();
    const userId = sessionUser ? sessionUser.id : null;

    // 5. Cập nhật Application và tạo AuditLog trong 1 Transaction
    const [updatedApp] = await prisma.$transaction([
      prisma.application.update({
        where: { id: app.id },
        data: {
          currentStage: toStage,
          stageUpdatedAt: new Date(),
          emailScheduledAt,
        },
      }),
      prisma.auditLog.create({
        data: {
          applicationId: app.id,
          userId,
          fromStage,
          toStage,
          action: "STAGE_CHANGE",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Đã chuyển hồ sơ sang cột ${toStage}`,
      data: updatedApp,
    });
  } catch (error) {
    console.error("Move application error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi chuyển trạng thái hồ sơ" },
      { status: 500 }
    );
  }
}
