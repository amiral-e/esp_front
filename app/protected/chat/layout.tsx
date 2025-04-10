import { getUserInfo } from "@/actions/auth.actions";
import { getConversations } from "@/actions/conversation.action";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ConversationHeader from "./_components/conversation-header";
const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
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

export default ChatLayout;
