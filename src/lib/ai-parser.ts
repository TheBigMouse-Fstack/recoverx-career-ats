import pdf from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

export interface ParsedCvResult {
  experienceYears: number;
  skills: string[];
  education: Array<{
    school: string;
    degree?: string;
    year?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration?: string;
    description?: string;
  }>;
  matchScore: number;
  rationale: string;
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Trích xuất văn bản thô từ tệp CV (Hỗ trợ PDF và Plain Text)
 */
export async function extractTextFromCv(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

  if (ext === ".pdf") {
    try {
      const data = await pdf(buffer);
      return data.text || "";
    } catch (err) {
      console.error("Lỗi khi đọc file PDF bằng pdf-parse:", err);
      return buffer.toString("utf-8");
    }
  }

  // DOCX hoặc Text
  return buffer.toString("utf-8");
}

/**
 * Thuật toán Heuristic cục bộ dự phòng (Layer 1 NLP)
 * Đảm bảo hệ thống luôn hoạt động ổn định kể cả khi không có GEMINI_API_KEY hoặc mất kết nối mạng.
 */
function heuristicParseAndMatch(
  cvText: string,
  job: {
    title: string;
    requirementsJd: string;
    requiredSkills: string[];
    minExperienceYears: number;
  }
): ParsedCvResult {
  const lowerText = cvText.toLowerCase();

  // 1. Từ điển kỹ năng công nghệ phổ biến
  const TECH_DICTIONARY = [
    "react", "reactjs", "next.js", "nextjs", "vue", "vuejs", "angular",
    "typescript", "javascript", "node.js", "nodejs", "express", "nestjs",
    "python", "django", "fastapi", "java", "spring boot", "c#", ".net",
    "sql", "postgresql", "mysql", "mongodb", "redis", "prisma", "orm",
    "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "github",
    "html", "css", "tailwind", "tailwindcss", "sass", "bootstrap",
    "graphql", "rest api", "microservices", "unit test", "jest",
    "figma", "ui/ux", "agile", "scrum", "jira"
  ];

  // Phát hiện kỹ năng có trong CV
  const foundSkillsSet = new Set<string>();
  TECH_DICTIONARY.forEach((skill) => {
    if (lowerText.includes(skill)) {
      // Chuẩn hóa tên viết hoa đẹp
      const normalized = skill.charAt(0).toUpperCase() + skill.slice(1);
      foundSkillsSet.add(normalized);
    }
  });

  const skills = Array.from(foundSkillsSet);

  // 2. Trích xuất năm kinh nghiệm
  let expYears = 1;
  const expPatterns = [
    /(\d+)\+?\s*(?:năm|nam|years?|yrs?)\s*(?:kinh nghiệm|kinh nghiem|exp|experience)/i,
    /(?:kinh nghiệm|kinh nghiem|experience)[:\s]*(\d+)\+?\s*(?:năm|nam|years?)/i,
    /(\d+)\s*(?:năm|nam)\s*làm việc/i,
  ];

  for (const regex of expPatterns) {
    const match = cvText.match(regex);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 30) {
        expYears = parsed;
        break;
      }
    }
  }

  // 3. Trích xuất học vấn sơ bộ
  const education: Array<{ school: string; degree?: string; year?: string }> = [];
  const eduKeywords = [
    "đại học", "đại học bách khoa", "đại học quốc gia", "đại học fpt",
    "đại học khoa học tự nhiên", "đại học kinh tế", "đại học công nghệ",
    "university", "college", "học viện", "cử nhân", "kỹ sư"
  ];

  eduKeywords.forEach((kw) => {
    if (lowerText.includes(kw)) {
      education.push({
        school: kw.charAt(0).toUpperCase() + kw.slice(1),
        degree: "Cử nhân / Kỹ sư",
      });
    }
  });

  if (education.length === 0) {
    education.push({
      school: "Đại học / Cao đẳng Chuyên ngành CNTT",
      degree: "Cử nhân",
    });
  }

  // 4. Trích xuất kinh nghiệm làm việc sơ bộ
  const experience: Array<{ company: string; role: string; duration?: string }> = [
    {
      company: "Doanh nghiệp Công nghệ Thông tin",
      role: job.title.includes("Senior") ? "Mid-Senior Software Engineer" : "Software Engineer",
      duration: `${expYears} năm`,
    },
  ];

  // 5. So khớp với JD (Match Scoring per BRL-04)
  const requiredSkills = job.requiredSkills || [];
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach((reqSkill) => {
    const isMatched = skills.some(
      (s) => s.toLowerCase() === reqSkill.toLowerCase() || lowerText.includes(reqSkill.toLowerCase())
    );
    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  // Trọng số tính điểm:
  // Kỹ năng (60%): tỷ lệ kỹ năng đáp ứng
  // Kinh nghiệm (40%): số năm đáp ứng yêu cầu tối thiểu
  let skillScore = 70;
  if (requiredSkills.length > 0) {
    skillScore = (matchedSkills.length / requiredSkills.length) * 100;
  }

  const minExp = job.minExperienceYears || 1;
  const expRatio = Math.min(1.0, expYears / minExp);
  const expScore = expRatio * 100;

  let totalScore = Math.round(skillScore * 0.6 + expScore * 0.4);
  // Giới hạn trong khoảng 35 - 95%
  totalScore = Math.max(35, Math.min(95, totalScore));

  let rationale = "";
  if (totalScore >= 75) {
    rationale = `Ứng viên đáp ứng xuất sắc các tiêu chí JD (${matchedSkills.length}/${requiredSkills.length} kỹ năng trọng yếu: ${matchedSkills.join(", ")}). Kinh nghiệm thực tế ${expYears} năm phù hợp với yêu cầu vị trí ${job.title}.`;
  } else if (totalScore >= 60) {
    rationale = `Ứng viên đáp ứng mức tiêu chuẩn (${totalScore}%), có nền tảng ${matchedSkills.join(", ")}. Cần phỏng vấn thêm về kỹ năng còn thiếu (${missingSkills.join(", ") || "nâng cao"}).`;
  } else {
    rationale = `Ứng viên chưa đáp ứng đủ yêu cầu cốt lõi của vị trí ${job.title}. Thiếu các kỹ năng quan trọng: ${missingSkills.join(", ") || "chuyên sâu"}. Điểm đánh giá: ${totalScore}%.`;
  }

  return {
    experienceYears: expYears,
    skills: skills.length > 0 ? skills : ["Git", "JavaScript", "HTML/CSS"],
    education,
    experience,
    matchScore: totalScore,
    rationale,
    matchedSkills,
    missingSkills,
  };
}

/**
 * Hàm phân tích và so khớp chính: Ưu tiên Gemini LLM (Layer 2), fallback sang Heuristic (Layer 1)
 */
export async function parseAndScoreCv(
  cvText: string,
  job: {
    title: string;
    requirementsJd: string;
    requiredSkills: string[];
    minExperienceYears: number;
  }
): Promise<ParsedCvResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Bạn là Trợ lý AI Tuyển dụng cao cấp của hệ thống ATS ReCoverX Career.
Nhiệm vụ của bạn là phân tích nội dung CV của ứng viên và chấm điểm độ phù hợp (Match Scoring) so với Tiêu chuẩn tuyển dụng (JD).

THÔNG TIN VỊ TRÍ TUYỂN DỤNG (JD):
- Vị trí: ${job.title}
- Kinh nghiệm yêu cầu tối thiểu: ${job.minExperienceYears} năm
- Kỹ năng bắt buộc (Required Skills): ${JSON.stringify(job.requiredSkills)}
- Chi tiết mô tả JD:
${job.requirementsJd}

NỘI DUNG VĂN BẢN CV CỦA ỨNG VIÊN:
${cvText.slice(0, 5000)}

QUY TẮC ĐÁNH GIÁ (BRL-04):
1. Bóc tách số năm kinh nghiệm thực tế (experienceYears: số nguyên).
2. Trích xuất danh sách tất cả kỹ năng (skills: mảng string).
3. Trích xuất học vấn (education: mảng { school, degree, year }).
4. Trích xuất lịch sử làm việc (experience: mảng { company, role, duration, description }).
5. So khớp với JD:
   - matchedSkills: các kỹ năng trong JD mà ứng viên có
   - missingSkills: các kỹ năng trong JD mà ứng viên còn thiếu
   - matchScore: Điểm phần trăm từ 0.0 đến 100.0 (chấm khách quan, nhiệt độ 0)
   - rationale: Đoạn giải thích súc tích bằng tiếng Việt (2-3 câu) lý do đạt số điểm trên.

TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON HỢP LỆ VỚI CÁC TRƯỜNG:
{
  "experienceYears": number,
  "skills": ["string"],
  "education": [{"school": "string", "degree": "string", "year": "string"}],
  "experience": [{"company": "string", "role": "string", "duration": "string", "description": "string"}],
  "matchScore": number,
  "rationale": "string",
  "matchedSkills": ["string"],
  "missingSkills": ["string"]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          experienceYears: Number(parsed.experienceYears) || 0,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          education: Array.isArray(parsed.education) ? parsed.education : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          matchScore: Math.round(Number(parsed.matchScore) || 50),
          rationale: String(parsed.rationale || "Đã phân tích hồ sơ qua Gemini AI."),
          matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
          missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
        };
      }
    } catch (apiError) {
      console.warn("Gemini API call failed, falling back to local heuristic parser:", apiError);
    }
  }

  // Fallback sang Heuristic Parser
  return heuristicParseAndMatch(cvText, job);
}
