import { Metadata } from "next";
import KanbanBoard from "@/components/kanban/KanbanBoard";

export const metadata: Metadata = {
  title: "Pipeline Tuyển Dụng (Kanban) | ReCoverX Career ATS",
  description: "Bảng theo dõi quy trình tuyển dụng ứng viên 5 giai đoạn theo chuẩn BPMN 2.0",
};

export default function AdminPipelinePage() {
  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <KanbanBoard />
    </div>
  );
}

