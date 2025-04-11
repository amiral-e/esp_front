import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import ConversationHeader from "../chat/_components/conversation-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="w-4/5 overflow-y-hidden">
          <ConversationHeader />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
