# Rule: Database Architecture & Prisma ORM Standards

## 1. Multi-Environment Database Strategy
- **Development (Local):** SQLite (`file:./dev.db`) for immediate zero-config setup.
- **Production:** PostgreSQL on cloud (Supabase, Railway, Neon).
- Prisma schema must remain vendor-neutral where possible to allow switching `provider` easily.

## 2. Singleton PrismaClient Pattern
Always instantiate PrismaClient via `src/lib/prisma.ts` to prevent connection exhaustion during Next.js Hot Module Replacement (HMR):

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## 3. Database Schema Models (Aligned with docs/07_Database_Design_ERD.md)
The system comprises 8 core entities:

1. `User`: Recruiter, Hiring Manager, or Admin accounts.
2. `Job`: Job vacancy with title, department, description, requirements, status (`DRAFT`, `PUBLISHED`, `CLOSED`).
3. `Candidate`: Deduplicated candidate profiles identified by `(email, phone)`.
4. `Application`: Association of Candidate to Job, tracking Kanban `status` (`NEW`, `SCREENING`, `INTERVIEW`, `HIRED`, `REJECTED`).
5. `AIParseResult`: Structured JSON data extracted from uploaded CV (education, skills, work experience, years of experience).
6. `AIMatchScore`: Matching percentage (0-100), AI rationale summary, missing skills, and scoring timestamp.
7. `Interview`: Scheduled interview session with datetime, round number, location/meeting link, and interviewer ID.
8. `EvaluationScorecard`: Weighted feedback submitted by interviewers with scores (1-5), comments, and hiring recommendation.

## 4. Query Best Practices
- Use selective queries (`select` or `include`) to fetch only necessary fields.
- Use transactions (`prisma.$transaction`) when creating Applications alongside initial AI parse results.
- Implement soft-delete or archiving where appropriate (e.g. moving disqualified candidates to Talent Pool).
