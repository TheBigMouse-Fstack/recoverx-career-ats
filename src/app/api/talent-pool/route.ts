import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Lấy danh sách ứng viên trong Kho nhân tài (SCR-07 / UC-06)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const jobId = searchParams.get("jobId");
    const stage = searchParams.get("stage");

    const where: any = {};
    if (jobId && jobId !== "ALL") where.jobId = Number(jobId);
    if (stage && stage !== "ALL") where.currentStage = stage;

    if (search) {
      where.candidate = {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { parsedSkills: { contains: search } },
        ],
      };
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        candidate: true,
        job: true,
        evaluations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    console.error("GET /api/talent-pool error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy danh sách kho nhân tài" },
      { status: 500 }
    );
  }
}

// POST: Tái sử dụng ứng viên / Khôi phục hồ sơ (Re-pooling UC-06)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateId, targetJobId } = body;

    if (!candidateId || !targetJobId) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã ứng viên hoặc mã vị trí chuyển tuyển" },
        { status: 400 }
      );
    }

    // 1. Kiểm tra Ứng viên & Job đích
    const candidate = await prisma.candidate.findUnique({
      where: { id: Number(candidateId) },
    });
    if (!candidate) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ ứng viên này" },
        { status: 404 }
      );
    }

    const targetJob = await prisma.job.findUnique({
      where: { id: Number(targetJobId) },
    });
    if (!targetJob) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy vị trí tuyển dụng đích" },
        { status: 404 }
      );
    }

    // 2. Tìm đơn ứng tuyển gần nhất để đánh dấu nguồn re-pool
    const previousApp = await prisma.application.findFirst({
      where: { candidateId: candidate.id },
      orderBy: { createdAt: "desc" },
    });

    const sessionUser = getSessionUser();
    const userId = sessionUser ? sessionUser.id : null;

    // 3. Tạo Application mới ở trạng thái SCREENING
    const newApp = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        jobId: targetJob.id,
        currentStage: "SCREENING",
        repooledFromId: previousApp ? previousApp.id : null,
        aiMatchScore: previousApp?.aiMatchScore || 70,
        aiMatchRationale: `Hồ sơ được khôi phục từ Kho nhân tài và chuyển sang vị trí ${targetJob.title} bởi chuyên viên tuyển dụng.`,
      },
    });

    // 4. Ghi nhận AuditLog
    await prisma.auditLog.create({
      data: {
        applicationId: newApp.id,
        userId,
        fromStage: previousApp?.currentStage || "TALENT_POOL",
        toStage: "SCREENING",
        action: "TALENT_REPOOL",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã khôi phục và chuyển ứng viên ${candidate.fullName} sang vị trí "${targetJob.title}" thành công.`,
      data: newApp,
    });
  } catch (error: any) {
    console.error("POST /api/talent-pool repool error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi tái sử dụng hồ sơ ứng viên" },
      { status: 500 }
    );
  }
}

