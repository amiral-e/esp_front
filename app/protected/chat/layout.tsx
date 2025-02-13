import { getUserInfo } from "@/app/actions";
import ConversationSidebar from "./_components/conversation-sidebar";
import {
  fetchConversations,
  getConversationByUser,
} from "@/actions/conversations";
import { fetchConversationsByConvId } from "./conversation-action";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserInfo();
  const conversations = await getConversationByUser(user?.id || "");
  console.log(conversations);
  return (
    <div className="flex items-start">
      <ConversationSidebar conversations={conversations || []} />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChatLayout;
