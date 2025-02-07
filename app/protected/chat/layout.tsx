"use client";

import { ReactNode, useState } from "react";
import ConversationSidebar from "./_components/conversation-sidebar";
import ChatPage from "./page";

const ChatLayout = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  return (
    <div className="flex items-start">
      <div className="w-1/5">
        <ConversationSidebar
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
        />
      </div>
      <div className="relative w-full">
        <ChatPage activeConversation={activeConversation} />
      </div>
    </div>
  );
};

export default ChatLayout;
