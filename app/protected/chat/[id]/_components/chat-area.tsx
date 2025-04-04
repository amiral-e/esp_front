"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserChat from "../../_components/user-chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "./loader";
import { formatMarkdown } from "@/lib/formatMarkdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatContext } from "./chat-context";
import { Conv } from "@/actions/conversations";

export interface Message {
  role: string;
  content: string;
}

interface ChatAreaProps {
  conversation: Conv;
}

const ChatArea = ({ conversation }: ChatAreaProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useChatContext();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  let messages: Message[] = [];
  if (conversation.history.length !== 0) {
    messages = conversation.history;
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopy = (content: string, messageId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Scroll when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Scroll when loading state changes
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <Card className="flex-1 p-4">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="pr-4">
          {messages?.map((message, i) => (
            <div key={i} className={"flex justify-start mx-32 mt-8"}>
              {message.role === "user" ? (
                <UserChat
                  message={message.content}
                  userAvatar={"https://github.com/shadcn.png"}
                />
              ) : (
                <div className="w-full">
                  <h1 className="text-sm font-semibold">Assistant</h1>
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(message.content),
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(message.content, i)}
                  >
                    {copiedId === i ? (
                      <Check color="green" />
                    ) : (
                      <Copy color="gray" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center space-x-4 mb-8 mx-32 mt-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[400px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatArea;
