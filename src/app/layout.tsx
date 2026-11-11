import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReCoverX Career — Hệ thống Quản lý Tuyển dụng (ATS)",
  description: "Hệ thống ATS thông minh tự động hóa nộp đơn, bóc tách AI, lọc theo JD và quản lý Kanban.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
