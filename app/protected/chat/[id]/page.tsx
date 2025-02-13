import React from "react";
import ChatForm from "./_components/chat-form";
import ChatArea from "./_components/chat-area";
import { getConversationById } from "@/actions/conversations";

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const conversations = await getConversationById(id || "");
  return (
    <div className="flex flex-col w-full h-screen">
      {conversations ? (
        <div className="flex flex-col h-screen m-4 gap-4">
          <ChatArea conversation={conversations[0]} />
          <ChatForm />
        </div>
      ) : (
        <div>Conversation non trouvée</div>
      )}
    </div>
  );
};

export default ChatPage;
