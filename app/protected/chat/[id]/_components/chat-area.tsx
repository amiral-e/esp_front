"use client";

import React, { useEffect, useRef, useState } from "react";
import { Conversation } from "../../conversation-action";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserChat from "../../_components/user-chat";
import { Card } from "@/components/ui/card";

interface ChatAreaProps {
  conversation: Conversation;
}

const ChatArea = ({ conversation }: ChatAreaProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (conversation) {
      setIsLoading(false);
    }
  }, [conversation]);
  return (
    <Card className="flex-1 p-4 overflow-hidden">
      <ScrollArea ref={scrollAreaRef}>
        {conversation?.history?.map((message, i) => (
          <div key={i} className={"flex justify-start mx-32 mt-8"}>
            {message.role === "user" ? (
              <UserChat
                message={message.content}
                userAvatar={"https://github.com/shadcn.png"}
              />
            ) : (
              <h2>{message.content}</h2>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="">En train d'écrire...</div>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ChatArea;
