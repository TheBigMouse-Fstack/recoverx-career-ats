import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const applications = await prisma.application.findMany({
      include: {
        candidate: true,
        job: true,
        evaluations: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Tạo CSV Header
    const headers = [
      "Mã đơn ứng tuyển",
      "Họ và tên ứng viên",
      "Email",
      "Số điện thoại",
      "Vị trí ứng tuyển",
      "Phòng ban",
      "Trạng thái Kanban",
      "Điểm AI Match (%)",
      "Năm kinh nghiệm",
      "Số phiếu Scorecard",
      "Điểm Scorecard TB",
      "Khuyến nghị",
      "Ngày nộp hồ sơ",
    ];

    // Escape CSV string
    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = applications.map((app) => {
      // Tính điểm Scorecard TB
      let avgScorecard: string = "Chưa có";
      let recommendation: string = "Chưa đánh giá";
      if (app.evaluations.length > 0) {
        const sum = app.evaluations.reduce((acc, ev) => acc + (ev.overallScore || 0), 0);
        avgScorecard = (sum / app.evaluations.length).toFixed(1);
        recommendation = app.evaluations[app.evaluations.length - 1].recommendation;
      }

      return [
        escapeCsv(app.id),
        escapeCsv(app.candidate?.fullName || ""),
        escapeCsv(app.candidate?.email || ""),
        escapeCsv(app.candidate?.phone || ""),
        escapeCsv(app.job?.title || ""),
        escapeCsv(app.job?.department || ""),
        escapeCsv(app.currentStage),
        escapeCsv(app.aiMatchScore ? `${Math.round(app.aiMatchScore)}%` : "Chờ AI"),
        escapeCsv(app.candidate?.experienceYears ?? 0),
        escapeCsv(app.evaluations.length),
        escapeCsv(avgScorecard),
        escapeCsv(recommendation),
        escapeCsv(new Date(app.createdAt).toLocaleString("vi-VN")),
      ].join(",");
    });

    // Thêm BOM UTF-8 (\uFEFF) để Excel hiển thị đúng tiếng Việt có dấu
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

    const dateStr = new Date().toISOString().slice(0, 10);
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="recoverx_talent_report_${dateStr}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/export error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xuất báo cáo CSV" },
      { status: 500 }
    );
  }
}
