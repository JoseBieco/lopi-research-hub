import { AdminSidebar } from "@/components/admin-sidebar";
import { ReactNode } from "react";
import { Toaster } from "sonner"; // Assuming sonner is installed as seen in package.json

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <AdminSidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 overflow-y-auto relative">
        <div className="min-h-full pb-12">
          {children}
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
