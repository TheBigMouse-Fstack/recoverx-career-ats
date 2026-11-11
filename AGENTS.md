# AGENTS.md — ReCoverX Career (ATS)

> Standard Operating Instructions for AI Agents (Google Antigravity, Gemini, Codex, Claude Code).

## 1. Project Overview & Identity
- **Project Name:** ReCoverX Career — Applicant Tracking System (ATS)
- **Primary Objective:** Build an AI-driven, full-stack recruitment management platform that automates CV intake, AI parsing, matching against Job Descriptions (JDs), Kanban tracking, and candidate scorecard evaluations.
- **Root Directory:** `D:\ATS project`

## 2. Architecture & Tech Stack
- **Fullstack Framework:** Next.js 14+ (App Router) + TypeScript
- **Styling & Components:** Tailwind CSS + Lucide React + shadcn/ui component patterns
- **Drag-and-Drop Pipeline:** `@hello-pangea/dnd` (5-stage Kanban board)
- **Database & ORM:** Prisma ORM (SQLite for local dev `file:./dev.db`, PostgreSQL for production)
- **AI Engine:** Google Gemini API (`@google/genai`) for CV parsing & candidate match scoring
- **File Parsing:** `pdf-parse` for CV text extraction

## 3. Ground Truth Documents
When generating code, schema, API endpoints, or UI layouts, AI agents MUST strictly reference documents in `docs/`:
- `docs/02_BRD_Updated_Full.md` — Business Requirements Document
- `docs/03_BPMN_As_Is_and_To_Be.md` — As-Is and To-Be BPMN 2.0 processes
- `docs/04_FDD_and_Use_Case_List.md` — Functional decomposition & 7 core Use Cases (UC-01 to UC-07)
- `docs/05_Use_Case_Specifications.md` — Detailed Use Case tables & screen descriptions
- `docs/06_Dynamic_Models_Activity_Sequence_State.md` — State Machine & 4 Sequence Diagrams (SD-01 to SD-04)
- `docs/07_Database_Design_ERD.md` — Data Dictionary & 8 database tables
- `docs/08_NonFunctional_and_Permissions.md` — RBAC permissions & Non-Functional Requirements
- `docs/10_Scope_and_System_Comparison.md` — Scope boundary (In/Out-of-Scope) & Base E-Hiring comparison

## 4. Specialized Rules Directory
AI agents must consult modular rules located in `.agents/rules/`:
- `.agents/rules/nextjs-app-router.md`: Next.js 14 App Router & TypeScript conventions
- `.agents/rules/tailwind-shadcn.md`: UI styling, layouts, Kanban, and Drawer design
- `.agents/rules/prisma-database.md`: Database schema, Prisma client singleton, and queries
- `.agents/rules/business-ats.md`: Core Business Rules (BRL-01 to BRL-10)

## 5. Standard Commands
- Install dependencies: `npm install`
- Local dev server: `npm run dev` (Runs at `http://localhost:3000`)
- Database synchronization: `npx prisma db push`
- Database Studio viewer: `npx prisma studio`
- Seed database: `npx ts-node prisma/seed.ts` (or `node prisma/seed.js`)
