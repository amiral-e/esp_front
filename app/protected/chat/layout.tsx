import { getUserInfo } from "@/app/actions";
import ConversationSidebar from "./_components/conversation-sidebar";
import { getConversationByUser } from "@/actions/conversations";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserInfo();
  console.log("USER", user?.id);
  const conversations = await getConversationByUser(user?.id || "");
  console.log("CONVERSATIONS", conversations);
  return (
    <div className="flex items-start">
      <ConversationSidebar conversations={conversations || []} />
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChatLayout;
