# Rule: Next.js 14+ App Router & TypeScript Standards

## 1. Directory Structure
```text
src/
├── app/
│   ├── layout.tsx                # Root layout (Fonts, Meta, Global Providers)
│   ├── page.tsx                  # Landing / Careers overview (Public)
│   ├── jobs/
│   │   ├── page.tsx              # Public Job listings (SCR-01)
│   │   └── [id]/page.tsx         # Job Detail & Application Form (SCR-02)
│   ├── admin/
│   │   ├── login/page.tsx        # Internal Login (SCR-03)
│   │   ├── pipeline/page.tsx     # Kanban Recruitment Pipeline (SCR-04)
│   │   ├── talent-pool/page.tsx  # Talent CRM & Export (SCR-07)
│   │   └── layout.tsx            # Admin sidebar navigation
│   └── api/
│       ├── applications/route.ts # Application submission & intake
│       ├── ai/parse/route.ts     # CV Parsing via Gemini API
│       ├── ai/match/route.ts     # Match scoring calculation
│       ├── kanban/status/route.ts# Application status drag-and-drop
│       └── scorecards/route.ts   # Evaluation scorecard submission
├── components/
│   ├── ui/                       # Buttons, Badges, Modals, Inputs
│   ├── kanban/                   # KanbanBoard, KanbanColumn, CandidateCard
│   ├── candidate/                # CandidateDrawer, CVViewer
│   └── scorecard/                # ScorecardModal, StarRating
├── lib/
│   ├── prisma.ts                 # Prisma Client singleton
│   ├── gemini.ts                 # Gemini API client & prompts
│   └── utils.ts                  # cn(), formatting, date helpers
└── types/
    └── index.ts                  # Shared TypeScript interfaces
```

## 2. Server vs Client Components
- By default, all components in `src/app/` are **Server Components**.
- Use `"use client"` directive at the very top only when the component requires:
  - React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`).
  - Interactive event listeners (`onClick`, `onChange`, `onSubmit`).
  - Drag-and-drop interactivity (`@hello-pangea/dnd`).
  - Browser APIs (`window`, `localStorage`, `file uploads`).
- Never mark an entire page as `"use client"` if child sections can be isolated into interactive client components.

## 3. TypeScript Standards
- **Strict typing:** Do not use `any`. Define explicit interfaces or types in `src/types/index.ts`.
- Prefer `interface` for object contracts and `type` for unions/primitives.
- Type all API request payloads and API responses strictly.
- Handle `null` and `undefined` safely with optional chaining (`?.`) and nullish coalescing (`??`).

## 4. Error Handling & API Responses
- All API routes must use structured `try / catch` blocks.
- Return standard JSON responses:
  - Success: `{ success: true, data: ... }` with HTTP status `200` or `201`.
  - Error: `{ success: false, error: "Human-readable message" }` with HTTP status `400`, `404`, or `500`.
- Client components must display user feedback via UI toasts or alert banners.
