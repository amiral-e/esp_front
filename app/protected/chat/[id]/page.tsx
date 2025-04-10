import ChatForm from "./_components/chat-form";
import ChatArea from "./_components/chat-area";
import { getConversationById } from "@/actions/conversation.action";
import { ChatProvider } from "./_components/chat-context";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  try {
    const conversationId = id;
    const conversation = await getConversationById(conversationId);
    if (!conversation || conversation.length === 0) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p>Conversation non trouvée</p>
        </div>
      );
    }

    return (
      <ChatProvider>
        <div className="flex flex-col w-full">
          <div className="flex flex-col m-4 gap-4">
            <ChatArea conversation={conversation[0] || []} />
            <ChatForm />
          </div>
        </div>
      </ChatProvider>
    );
  } catch (error) {
    console.error("Error loading conversation:", error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Erreur lors du chargement de la conversation</p>
      </div>
    );
  }
};

export default ChatPage;
