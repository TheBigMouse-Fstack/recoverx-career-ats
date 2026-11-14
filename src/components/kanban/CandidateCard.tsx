"use client";

import { Draggable } from "@hello-pangea/dnd";
import {
  Sparkles,
  Clock,
  Briefcase,
  Star,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

interface CandidateCardProps {
  application: any;
  index: number;
  onOpenDrawer: (appId: number) => void;
}

export default function CandidateCard({
  application,
  index,
  onOpenDrawer,
}: CandidateCardProps) {
  const { candidate, job, aiMatchScore, isSlaBreached, slaMessage, evaluations } =
    application;

  // Màu sắc của Huy hiệu Match Score (BRL-04)
  const getMatchBadgeColor = (score: number | null) => {
    if (score === null || score === undefined) return "bg-slate-100 text-slate-600 border-slate-200";
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
    return "bg-red-50 text-red-700 border-red-200 font-semibold";
  };

  return (
    <Draggable draggableId={String(application.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onOpenDrawer(application.id)}
          className={`group bg-white rounded-xl border p-4 mb-3 transition-all cursor-pointer relative ${snapshot.isDragging
              ? "shadow-2xl border-brand-500 ring-2 ring-brand-500/20 rotate-1 scale-102"
              : isSlaBreached
                ? "border-red-300 shadow-xs hover:border-red-400 hover:shadow-md"
                : "border-slate-200/90 shadow-2xs hover:border-brand-400 hover:shadow-md"
            }`}
        >
          {/* Cảnh báo vi phạm SLA đỏ (BRL-07) */}
          {isSlaBreached && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[11px] font-bold border border-red-200">
              <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
              <span>{slaMessage}</span>
            </div>
          )}

          {/* Tiêu đề: Tên ứng viên & Nút xem */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors line-clamp-1">
              {candidate?.fullName || "Ứng viên chưa cập nhật"}
            </h4>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>

          {/* Vị trí ứng tuyển */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{job?.title || "Vị trí không xác định"}</span>
          </p>

          {/* Badges: Match Score & Năm kinh nghiệm */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
            {/* Điểm AI Match */}
            {aiMatchScore !== null && aiMatchScore !== undefined ? (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${getMatchBadgeColor(
                  aiMatchScore
                )}`}
              >
                <Sparkles className="w-3 h-3" />
                Match: {Math.round(aiMatchScore)}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-500 border border-slate-200">
                <Clock className="w-3 h-3" />
                Chờ AI bóc tách
              </span>
            )}

            {/* Năm kinh nghiệm */}
            {candidate?.experienceYears !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-50 text-slate-600 border border-slate-200">
                {candidate.experienceYears > 0
                  ? `${candidate.experienceYears} năm KN`
                  : "Mới tốt nghiệp"}
              </span>
            )}

            {/* Đánh giá Scorecard nếu có */}
            {evaluations && evaluations.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-purple-50 text-purple-700 border border-purple-200 font-semibold ml-auto">
                <Star className="w-3 h-3 fill-purple-600 text-purple-600" />
                {evaluations[0].overallScore
                  ? `${evaluations[0].overallScore.toFixed(1)}/5`
                  : `${evaluations.length} Scorecard`}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}


