import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import HeaderDashboard from "./_components/header-dashboard";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <HeaderDashboard />
      <div className="h-4/5">{children}</div>
    </div>
  );
};

export default ProtectedLayout;
