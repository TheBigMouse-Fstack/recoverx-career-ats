import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractTextFromCv, parseAndScoreCv } from "@/lib/ai-parser";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = Number(params.id);
    if (isNaN(applicationId)) {
      return NextResponse.json(
        { success: false, error: "Mã hồ sơ không hợp lệ" },
        { status: 400 }
      );
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { candidate: true, job: true },
    });

    if (!app || !app.candidate || !app.job) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy hồ sơ hoặc vị trí tuyển dụng" },
        { status: 404 }
      );
    }

    // Đọc file từ thư mục public
    let cvText = app.candidate.cvText || "";
    if (app.candidate.cvFileUrl) {
      try {
        const filePath = path.join(
          process.cwd(),
          "public",
          app.candidate.cvFileUrl.replace(/^\//, "")
        );
        const buffer = await readFile(filePath);
        cvText = await extractTextFromCv(buffer, path.basename(filePath));
      } catch (err) {
        console.warn("Could not re-read file from disk, using existing cvText:", err);
      }
    }

    let requiredSkillsArray: string[] = [];
    try {
      requiredSkillsArray = JSON.parse(app.job.requiredSkills || "[]");
    } catch {
      requiredSkillsArray = [];
    }

    // Chạy AI phân tích lại
    const aiResult = await parseAndScoreCv(cvText, {
      title: app.job.title,
      requirementsJd: app.job.requirementsJd,
      requiredSkills: requiredSkillsArray,
      minExperienceYears: app.job.minExperienceYears,
    });

    // Cập nhật CSDL
    await prisma.candidate.update({
      where: { id: app.candidate.id },
      data: {
        experienceYears: aiResult.experienceYears,
        parsedSkills: JSON.stringify(aiResult.skills),
        parsedEducation: JSON.stringify(aiResult.education),
        parsedExperience: JSON.stringify(aiResult.experience),
        cvText: cvText.slice(0, 10000),
      },
    });

    const updatedApp = await prisma.application.update({
      where: { id: app.id },
      data: {
        aiMatchScore: aiResult.matchScore,
        aiMatchRationale: aiResult.rationale,
        aiMatchedSkills: JSON.stringify(aiResult.matchedSkills),
        aiMissingSkills: JSON.stringify(aiResult.missingSkills),
      },
      include: {
        candidate: true,
        job: true,
        evaluations: true,
        auditLogs: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Đã phân tích lại CV bằng AI thành công!",
      data: updatedApp,
    });
  } catch (error: any) {
    console.error("Re-parse API error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi hệ thống khi phân tích lại CV" },
      { status: 500 }
    );
  }
}
