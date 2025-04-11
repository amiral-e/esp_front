import React from "react";
import { getConversations } from "@/actions/conversation.action";
import ConversationSheet from "./conversation-sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ConversationHeader = async () => {
  const conversations = await getConversations();

  if (!conversations) {
    return null;
  }
  return (
    <div className="flex items-center justify-between w-full py-2 border-b">
      <SidebarTrigger />
      <ConversationSheet conversations={conversations.conversations} />
    </div>
  );
};

export default ConversationHeader;
