import { getUserInfo } from "@/app/actions";
import ConversationSidebar from "./_components/conversation-sidebar";
import { getConversations } from "@/actions/conversation.action";

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const user = await getUserInfo();

    // Utiliser apiClient pour récupérer les conversations
    const response = await getConversations();
    // Récupérer le tableau de conversations
    const conversations = response.conversations || [];

    // Transform conversations to match ConversationData structure
    const formattedConversations = conversations.map((conv: any) => ({
      id: conv.id,
      name: conv.name,
      created_at: conv.created_at || new Date().toISOString(),
      history: conv.history || [],
      user_id: conv.user_id || user?.id || "",
    }));
    console.log("formattedConversations", formattedConversations);

    return (
      <div className="flex items-start">
        <ConversationSidebar conversations={formattedConversations} />
        <div className="w-full">{children}</div>
      </div>
    );
  } catch (error: any) {
    console.error("Error fetching conversations:", error);
    // En cas d'erreur, afficher une interface minimale
    return (
      <div className="flex items-start">
        <ConversationSidebar conversations={[]} />
        <div className="w-full">{children}</div>
      </div>
    );
  }
};

export default ChatLayout;
