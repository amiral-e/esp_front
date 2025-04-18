import { ToastContainer } from "react-toastify";
import ConversationSidebar from "./_components/conversation-sidebar";
import { getConversationByUser } from "@/actions/conversations";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const conversations = await getConversationByUser();
  return (
    <div className="flex items-start w-full">
      <ConversationSidebar conversations={conversations || []} />
      <ToastContainer></ToastContainer>
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default ChatLayout;
