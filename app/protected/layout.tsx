import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>;
};

export default ProtectedLayout;
