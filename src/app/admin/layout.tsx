import AdminNavbar from "@/components/admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
