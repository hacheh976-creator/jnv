import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth";
import { AdminSidebar, AdminTabBar, AdminTopBar } from "@/components/admin/AdminNav";
import { Toaster } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminTopBar />
        <div className="mx-auto max-w-6xl overflow-x-clip px-4 pb-28 pt-6 lg:px-8 lg:pb-12">{children}</div>
      </div>
      <AdminTabBar />
      <Toaster />
    </div>
  );
}
