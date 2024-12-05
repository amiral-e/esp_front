import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import ConversationSidebar from "./_components/conversation-sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start space-x-4">
      <ConversationSidebar />
      <div className="w-full h-[95vh]">{children}</div>
    </div>
  );
};

export default ChatLayout;
