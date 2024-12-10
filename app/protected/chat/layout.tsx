"use client";

import { ReactNode, useState } from "react";
import ConversationSidebar from "./_components/conversation-sidebar";
import ChatPage from "./page";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  return (
    <div className="flex items-start space-x-4">
      <ConversationSidebar
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
      />
      <div className="w-full h-[95vh]">
        <ChatPage activeConversation={activeConversation} />
      </div>
    </div>
  );
};

export default ChatLayout;
