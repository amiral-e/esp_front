import { getUserInfo } from "@/app/actions";
import ConversationSidebar from "./_components/conversation-sidebar";
import { getConversationByUser } from "@/actions/conversations";
import { number } from "zod";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const conversations = await getConversationByUser();
  return (
    <div className="flex items-start w-full">
      <ConversationSidebar conversations={conversations || []} />
      <div className="w-full h-full">{children}</div>
    </div>

  );
};

export default ChatLayout;
