"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import CandidateCard from "@/components/kanban/CandidateCard";
import CandidateDrawer from "@/components/candidate/CandidateDrawer";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Layers,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface JobOption {
  id: number;
  title: string;
  department: string;
  status: string;
  _count: {
    applications: number;
  };
}

interface ColumnConfig {
  id: string;
  title: string;
  badgeColor: string;
  headerBg: string;
  dotColor: string;
  description: string;
}

const COLUMNS_CONFIG: ColumnConfig[] = [
  {
    id: "NEW",
    title: "Mới tiếp nhận",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    headerBg: "bg-blue-50/70 border-b border-blue-100",
    dotColor: "bg-blue-500",
    description: "CV nộp qua cổng hoặc tải lên",
  },
  {
    id: "SCREENING",
    title: "Sàng lọc tiêu chuẩn",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    headerBg: "bg-indigo-50/70 border-b border-indigo-100",
    dotColor: "bg-indigo-500",
    description: "AI Match & HR duyệt sơ bộ",
  },
  {
    id: "INTERVIEW",
    title: "Phỏng vấn",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    headerBg: "bg-amber-50/70 border-b border-amber-100",
    dotColor: "bg-amber-500",
    description: "Đang đánh giá vòng chuyên môn",
  },
  {
    id: "HIRED",
    title: "Tuyển chọn (Hired)",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    headerBg: "bg-emerald-50/70 border-b border-emerald-100",
    dotColor: "bg-emerald-500",
    description: "Đạt chuẩn & có Scorecard (BRL-06)",
  },
  {
    id: "REJECTED",
    title: "Từ chối (Rejected)",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    headerBg: "bg-rose-50/70 border-b border-rose-100",
    dotColor: "bg-rose-500",
    description: "Email hoãn 12-24h (BRL-05)",
  },
];

export default function KanbanBoard() {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [columns, setColumns] = useState<Record<string, any[]>>({
    NEW: [],
    SCREENING: [],
    INTERVIEW: [],
    HIRED: [],
    REJECTED: [],
  });
  const [stats, setStats] = useState<any>({
    total: 0,
    new: 0,
    screening: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  });

  // Drawer state
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

  // Error / Notification alert banner
  const [alertError, setAlertError] = useState<string | null>(null);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Pipeline Data
  const fetchPipeline = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedJobId && selectedJobId !== "ALL") {
        params.append("jobId", selectedJobId);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/pipeline?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs || []);
        setColumns(data.columns || {
          NEW: [],
          SCREENING: [],
          INTERVIEW: [],
          HIRED: [],
          REJECTED: [],
        });
        setStats(data.stats || {});
      } else {
        setAlertError(data.error || "Không thể tải dữ liệu tuyển dụng.");
      }
    } catch (err) {
      console.error("Error fetching pipeline:", err);
      setAlertError("Lỗi kết nối khi tải pipeline ứng viên.");
    } finally {
      setLoading(false);
    }
  }, [selectedJobId, searchQuery]);

  useEffect(() => {
    if (isMounted) {
      fetchPipeline();
    }
  }, [isMounted, fetchPipeline]);

  // Stage change logic (used both by Drag-Drop and CandidateDrawer)
  const handleMoveStage = async (
    applicationId: number,
    toStage: string
  ): Promise<boolean | string> => {
    try {
      const res = await fetch("/api/pipeline/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, toStage }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        const errorMsg = result.error || "Không thể chuyển giai đoạn hồ sơ.";
        setAlertError(errorMsg);
        return errorMsg;
      }

      // Thông báo thành công nếu có hẹn giờ email
      if (toStage === "REJECTED") {
        setAlertSuccess(
          "Đã chuyển sang Từ chối. Email thông báo từ chối đã được lên lịch hoãn 12 tiếng theo quy tắc BRL-05."
        );
      } else if (toStage === "HIRED") {
        setAlertSuccess("Chúc mừng! Ứng viên đã được chuyển sang Tuyển chọn (HIRED) thành công.");
      }

      // Tự tắt alert sau 6 giây
      setTimeout(() => {
        setAlertSuccess(null);
      }, 6000);

      // Re-fetch để đồng bộ lại toàn bộ thống kê và SLA
      await fetchPipeline();
      return true;
    } catch (err: any) {
      const msg = err.message || "Lỗi hệ thống khi cập nhật trạng thái.";
      setAlertError(msg);
      return msg;
    }
  };

  // Drag and Drop Handler
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Kéo vào cùng vị trí cũ
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;
    const appId = Number(draggableId);

    // Lưu lại trạng thái ban đầu để rollback nếu có lỗi
    const prevColumns = { ...columns };

    // Thực hiện Optimistic Update trên UI ngay lập tức
    const sourceItems = Array.from(columns[sourceColId] || []);
    const destItems =
      sourceColId === destColId
        ? sourceItems
        : Array.from(columns[destColId] || []);

    const [movedItem] = sourceItems.splice(source.index, 1);
    if (!movedItem) return;

    // Cập nhật tạm thời stage của item
    const optimisticMovedItem = {
      ...movedItem,
      currentStage: destColId,
    };

    if (sourceColId === destColId) {
      sourceItems.splice(destination.index, 0, optimisticMovedItem);
      setColumns({
        ...columns,
        [sourceColId]: sourceItems,
      });
      return;
    } else {
      destItems.splice(destination.index, 0, optimisticMovedItem);
      setColumns({
        ...columns,
        [sourceColId]: sourceItems,
        [destColId]: destItems,
      });
    }

    // Xóa alert lỗi cũ trước khi gọi API
    setAlertError(null);

    // Gửi request API đến server
    const moveResult = await handleMoveStage(appId, destColId);
    if (typeof moveResult === "string") {
      // Rollback về trạng thái cũ vì vi phạm Business Rule hoặc lỗi
      setColumns(prevColumns);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-sm font-medium">Đang khởi tạo Pipeline tuyển dụng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* 1. Header Toolbar & Bộ lọc */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-brand-600" />
              Pipeline Tuyển Dụng (Kanban 5 Cột)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Quy trình chuẩn hóa 5 giai đoạn theo BPMN 2.0 & kiểm soát ràng buộc BRL-05, BRL-06, BRL-07.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchPipeline()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
              title="Làm mới bảng"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin text-brand-600" : ""}`}
              />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        {/* Bộ lọc Job & Ô tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          {/* Lọc theo Vị trí tuyển dụng */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              Vị trí tuyển dụng (Job)
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            >
              <option value="ALL">Tất cả vị trí tuyển dụng ({jobs.length} jobs)</option>
              {jobs.map((job) => (
                <option key={job.id} value={String(job.id)}>
                  {job.title} — {job.department} ({job._count.applications} ứng viên)
                </option>
              ))}
            </select>
          </div>

          {/* Ô tìm kiếm ứng viên */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              Tìm ứng viên (Họ tên, email, kỹ năng)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập tên ứng viên, email hoặc kỹ năng (VD: React, Python)..."
                className="w-full text-xs rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-8 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Thống kê nhanh tổng quan */}
          <div className="md:col-span-2 flex items-end">
            <div className="w-full bg-brand-50/70 border border-brand-100 rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                Tổng hồ sơ
              </div>
              <div className="text-xl font-black text-brand-900 leading-tight">
                {stats.total || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Banner Thông báo Vi phạm Business Rules (Nếu có lỗi từ chối chuyển trạng thái) */}
      {alertError && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-900 shadow-sm flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                Chặn chuyển trạng thái (Quy tắc Nghiệp vụ ATS)
              </h4>
              <p className="text-xs font-medium text-red-800 mt-0.5 leading-relaxed">
                {alertError}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertError(null)}
            className="text-red-400 hover:text-red-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Thành công */}
      {alertSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-900 shadow-sm flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Thành công
              </h4>
              <p className="text-xs font-medium text-emerald-800 mt-0.5 leading-relaxed">
                {alertSuccess}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertSuccess(null)}
            className="text-emerald-400 hover:text-emerald-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Bảng 5 Cột Kanban Kéo thả */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start pb-6">
          {COLUMNS_CONFIG.map((col) => {
            const columnItems = columns[col.id] || [];
            const count = columnItems.length;

            return (
              <div
                key={col.id}
                className="flex flex-col bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden min-h-[580px] max-h-[82vh]"
              >
                {/* Header Cột */}
                <div className={`p-3.5 ${col.headerBg}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                      <h3 className="font-bold text-xs text-slate-800 tracking-tight">
                        {col.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-black border ${col.badgeColor}`}
                    >
                      {count}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    {col.description}
                  </p>
                </div>

                {/* Vùng thả Droppable */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 overflow-y-auto transition-colors ${
                        snapshot.isDraggingOver
                          ? "bg-brand-50/50 ring-2 ring-brand-400/50 ring-inset"
                          : ""
                      }`}
                    >
                      {columnItems.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                          <Users className="w-6 h-6 text-slate-300 mb-1" />
                          <p className="text-xs font-semibold text-slate-400">
                            Chưa có hồ sơ
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Kéo thả ứng viên vào đây
                          </p>
                        </div>
                      ) : (
                        columnItems.map((app, index) => (
                          <CandidateCard
                            key={app.id}
                            application={app}
                            index={index}
                            onOpenDrawer={(id) => setSelectedAppId(id)}
                          />
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* 4. Slide-over Candidate Drawer khi click vào thẻ ứng viên */}
      <CandidateDrawer
        applicationId={selectedAppId}
        onClose={() => setSelectedAppId(null)}
        onStageChange={async (appId, toStage) => {
          const res = await handleMoveStage(appId, toStage);
          return res;
        }}
      />
    </div>
  );
}
