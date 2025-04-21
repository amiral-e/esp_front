"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/protected/chat/");
  return (
    <SidebarProvider>
      <AppSidebar />
      {!isChatPage && (
        <SidebarTrigger />
      )}
      <ToastContainer />
      <div className="flex flex-1 flex-col" style={{ height: "100vh" }}>{children}</div>
    </SidebarProvider>
  );
};

export default ProtectedLayout;
