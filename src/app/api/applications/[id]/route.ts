import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = Number(params.id);
    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "ID hồ sơ không hợp lệ" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: true,
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            requirementsJd: true,
            requiredSkills: true,
            minExperienceYears: true,
          },
        },
        evaluations: {
          include: {
            evaluator: {
              select: { id: true, fullName: true, email: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          include: {
            user: {
              select: { id: true, fullName: true, role: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ ứng tuyển này" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Fetch application detail error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy chi tiết hồ sơ ứng viên" },
      { status: 500 }
    );
  }
}

