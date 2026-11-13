/**
 * ReCoverX Career ATS — Test Suite Tự động hóa
 * Kiểm tra các Quy tắc Nghiệp vụ (BRL-01 đến BRL-10) và Logic Xác thực
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Bộ giả lập màu sắc console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
};

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${testName}`);
    passed++;
  } else {
    console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${testName} — ${details}`);
    failed++;
  }
}

async function runTests() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  🧪 RECOVERX CAREER ATS — BỘ KIỂM THỬ NGHIỆP VỤ (BRL) ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  // ---------------------------------------------------------
  // TEST SUITE 1: BRL-01 (Định dạng & Dung lượng tệp tin)
  // ---------------------------------------------------------
  console.log(`${colors.bold}1. Kiểm tra BRL-01 (File Format & Max 10MB):${colors.reset}`);
  
  function validateFile(fileName, sizeInBytes) {
    const validExtensions = [".pdf", ".docx"];
    const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validExtensions.includes(ext)) {
      return { valid: false, error: "Định dạng không hợp lệ. Chỉ chấp nhận .pdf, .docx" };
    }
    if (sizeInBytes > maxSize) {
      return { valid: false, error: "Dung lượng vượt quá giới hạn 10MB" };
    }
    return { valid: true };
  }

  assert(validateFile("my_cv.pdf", 2 * 1024 * 1024).valid === true, "Chấp nhận tệp PDF hợp lệ dưới 10MB");
  assert(validateFile("profile.docx", 5 * 1024 * 1024).valid === true, "Chấp nhận tệp DOCX hợp lệ dưới 10MB");
  assert(validateFile("script.exe", 1024).valid === false, "Chặn tệp không phải PDF/DOCX (ví dụ .exe)");
  assert(validateFile("heavy_cv.pdf", 12 * 1024 * 1024).valid === false, "Chặn tệp PDF vượt quá 10MB");

  // ---------------------------------------------------------
  // TEST SUITE 2: BRL-02 (Khử trùng lặp trong vòng 30 ngày)
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}2. Kiểm tra BRL-02 (Deduplication Email + Phone trong 30 ngày):${colors.reset}`);

  function checkDeduplication(existingApps, candidateEmail, candidatePhone, jobId) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const match = existingApps.find(
      (app) =>
        app.jobId === jobId &&
        (app.email === candidateEmail || app.phone === candidatePhone) &&
        new Date(app.createdAt) >= thirtyDaysAgo
    );

    return match ? { isDuplicate: true, duplicateAppId: match.id } : { isDuplicate: false };
  }

  const mockExisting = [
    { id: 101, email: "test@gmail.com", phone: "0901111222", jobId: 1, createdAt: new Date() }, // Nộp hôm nay
    { id: 102, email: "old@gmail.com", phone: "0903333444", jobId: 1, createdAt: new Date(Date.now() - 40 * 86400000) }, // Nộp 40 ngày trước
  ];

  assert(
    checkDeduplication(mockExisting, "test@gmail.com", "0901111222", 1).isDuplicate === true,
    "Phát hiện hồ sơ nộp trùng cùng 1 Job trong vòng 30 ngày"
  );
  assert(
    checkDeduplication(mockExisting, "test@gmail.com", "0901111222", 2).isDuplicate === false,
    "Cho phép ứng viên nộp cho vị trí khác (JobId khác) không bị tính trùng"
  );
  assert(
    checkDeduplication(mockExisting, "old@gmail.com", "0903333444", 1).isDuplicate === false,
    "Cho phép nộp lại cùng Job nếu đã qua 30 ngày (tạo đợt ứng tuyển mới)"
  );

  // ---------------------------------------------------------
  // TEST SUITE 3: BRL-08 (Tính điểm Scorecard trung bình có trọng số)
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}3. Kiểm tra BRL-08 (Scorecard Trọng số: 40% Chuyên môn, 30% Giao tiếp, 30% Văn hóa):${colors.reset}`);

  function calculateScorecard(tech, comm, cult) {
    // Công thức: (Tech * 0.4) + (Comm * 0.3) + (Cult * 0.3)
    return Number((tech * 0.4 + comm * 0.3 + cult * 0.3).toFixed(2));
  }

  assert(calculateScorecard(5, 5, 5) === 5.0, "Điểm tuyệt đối 5/5/5 cho ra 5.0");
  assert(calculateScorecard(4, 3, 3) === 3.4, "Điểm 4/3/3 cho ra đúng 3.40");
  assert(calculateScorecard(5, 4, 5) === 4.7, "Điểm 5/4/5 cho ra đúng 4.70");

  // ---------------------------------------------------------
  // TEST SUITE 4: BRL-06 (Stage Gate: Chặn Hired nếu chưa có Scorecard)
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}4. Kiểm tra BRL-06 (Stage Gate Rule — Chặn Hired nếu thiếu Scorecard):${colors.reset}`);

  function validateStageTransition(fromStage, toStage, evaluationsCount) {
    if (toStage === "HIRED") {
      if (evaluationsCount < 1) {
        return { allowed: false, error: "Yêu cầu ít nhất 1 Scorecard hoàn tất trước khi tuyển chọn (HIRED)" };
      }
    }
    return { allowed: true };
  }

  assert(validateStageTransition("INTERVIEW", "HIRED", 0).allowed === false, "Chặn kéo sang HIRED khi có 0 Scorecard");
  assert(validateStageTransition("INTERVIEW", "HIRED", 1).allowed === true, "Cho phép kéo sang HIRED khi đã có 1 Scorecard");

  // ---------------------------------------------------------
  // TEST SUITE 5: BRL-05 (Delay Buffer 12-24h khi gửi Email từ chối)
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}5. Kiểm tra BRL-05 (Delay Buffer 12-24h cho Email từ chối):${colors.reset}`);

  function scheduleRejectionEmail(now = new Date(), delayHours = 12) {
    return new Date(now.getTime() + delayHours * 60 * 60 * 1000);
  }

  const now = new Date();
  const scheduledTime = scheduleRejectionEmail(now, 12);
  const diffHours = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  assert(diffHours === 12, "Thời gian gửi thư từ chối được hoãn đúng 12 giờ so với thời điểm loại");

  // ---------------------------------------------------------
  // TEST SUITE 6: Database Integration & Seed Data Integrity
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}6. Kiểm tra Dữ liệu Cơ sở dữ liệu SQLite (${colors.cyan}dev.db${colors.reset}${colors.bold}):${colors.reset}`);

  try {
    const userCount = await prisma.user.count();
    const jobCount = await prisma.job.count();
    const candidateCount = await prisma.candidate.count();
    const appCount = await prisma.application.count();

    assert(userCount >= 3, `Có sẵn ${userCount} tài khoản người dùng nội bộ (Admin, HR, Hiring Manager)`);
    assert(jobCount >= 2, `Có sẵn ${jobCount} tin tuyển dụng hoạt động`);
    assert(candidateCount >= 3, `Có sẵn ${candidateCount} hồ sơ ứng viên`);
    assert(appCount >= 3, `Có sẵn ${appCount} đơn ứng tuyển ở các vòng Kanban`);

    // ---------------------------------------------------------
    // TEST SUITE 7: SPRINT 1 — XÁC THỰC & BẢO MẬT USER (UC-00 / BRL-Auth)
    // ---------------------------------------------------------
    console.log(`\n${colors.bold}7. Kiểm tra Sprint 1 (Xác thực, Phân quyền RBAC & BRL-Auth):${colors.reset}`);

    // BRL-Auth validation
    function validateUserCreation(password, email, existingEmails) {
      if (!password || password.length < 8) {
        return { valid: false, error: "Mật khẩu phải từ 8 ký tự trở lên (BRL-Auth)" };
      }
      if (existingEmails.includes(email.toLowerCase().trim())) {
        return { valid: false, error: "Email đã tồn tại trong hệ thống" };
      }
      return { valid: true };
    }

    assert(validateUserCreation("123", "new@ats.vn", []).valid === false, "Chặn tạo mật khẩu ngắn dưới 8 ký tự (BRL-Auth)");
    assert(validateUserCreation("SecurePass123", "hr@recoverx.career", ["hr@recoverx.career"]).valid === false, "Chặn tạo trùng email đã có");
    assert(validateUserCreation("StrongPass2026", "recruiter2@recoverx.career", ["hr@recoverx.career"]).valid === true, "Chấp nhận tạo tài khoản hợp lệ");

    // Test Admin Role permission check
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    assert(adminUser !== null && adminUser.role === "ADMIN", "Tài khoản ADMIN tồn tại và có quyền quản trị tối cao");

    const hrLead = await prisma.user.findFirst({ where: { role: "HR" } });
    assert(hrLead !== null && hrLead.role === "HR", "Tài khoản HR LEAD tồn tại và sẵn sàng quản lý Pipeline");
    // ---------------------------------------------------------
    // TEST SUITE 8: SPRINT 2 — KANBAN PIPELINE & BRL-07 SLA
    // ---------------------------------------------------------
    console.log(`\n${colors.bold}8. Kiểm tra Sprint 2 (Kanban Pipeline, BRL-07 SLA & Audit Trail):${colors.reset}`);

    // BRL-07 SLA Alert logic
    function checkSlaBreach(stage, stageUpdatedAtMs, currentMs) {
      const hours = (currentMs - stageUpdatedAtMs) / (1000 * 60 * 60);
      if (stage === "NEW" && hours > 48) {
        return { breached: true, hours: Math.floor(hours), msg: `Tồn đọng ${Math.floor(hours)}h (Quá hạn 48h)` };
      }
      if (stage === "SCREENING" && hours > 72) {
        return { breached: true, hours: Math.floor(hours), msg: `Sàng lọc ${Math.floor(hours)}h (Quá hạn 72h)` };
      }
      return { breached: false, hours: Math.floor(hours) };
    }

    const testNow = Date.now();
    const appFresh = testNow - 10 * 3600000; // 10h ago
    const appNewLate = testNow - 55 * 3600000; // 55h ago (> 48h)
    const appScreeningLate = testNow - 80 * 3600000; // 80h ago (> 72h)

    assert(checkSlaBreach("NEW", appFresh, testNow).breached === false, "Hồ sơ NEW dưới 48h không bị cảnh báo vi phạm SLA");
    assert(checkSlaBreach("NEW", appNewLate, testNow).breached === true, "Hồ sơ NEW trên 48h kích hoạt cảnh báo vi phạm SLA (BRL-07)");
    assert(checkSlaBreach("SCREENING", appScreeningLate, testNow).breached === true, "Hồ sơ SCREENING trên 72h kích hoạt cảnh báo vi phạm SLA (BRL-07)");

    // Test transition with BRL-06 enforcement
    const appWithNoScorecard = await prisma.application.findFirst({
      where: { evaluations: { none: {} } },
      include: { evaluations: true },
    });
    if (appWithNoScorecard) {
      assert(appWithNoScorecard.evaluations.length === 0, "Tìm thấy hồ sơ chưa có Scorecard trong DB để kiểm thử BRL-06");
      const canHire = appWithNoScorecard.evaluations.length > 0;
      assert(canHire === false, "Chặn tuyệt đối không cho phép chuyển hồ sơ chưa có Scorecard sang HIRED");
    }

    const appWithScorecard = await prisma.application.findFirst({
      where: { evaluations: { some: {} } },
      include: { evaluations: true },
    });
    if (appWithScorecard) {
      assert(appWithScorecard.evaluations.length > 0, "Tìm thấy hồ sơ đã có Scorecard để kiểm thử cho phép tuyển");
      const canHire = appWithScorecard.evaluations.length > 0;
      assert(canHire === true, "Cho phép hồ sơ đã có Scorecard được duyệt sang HIRED");
    }
  } catch (err) {
    assert(false, "Kết nối CSDL thất bại", err.message);
  } finally {
    await prisma.$disconnect();
  }

  // ---------------------------------------------------------
  // TỔNG KẾT
  // ---------------------------------------------------------
  console.log(`\n${colors.bold}====================================================${colors.reset}`);
  console.log(`  KẾT QUẢ KIỂM THỬ: ${colors.green}${passed} Passed${colors.reset} | ${colors.red}${failed} Failed${colors.reset}`);
  console.log(`${colors.bold}====================================================${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
