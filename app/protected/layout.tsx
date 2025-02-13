import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import HeaderDashboard from "./_components/header-dashboard";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default ProtectedLayout;
