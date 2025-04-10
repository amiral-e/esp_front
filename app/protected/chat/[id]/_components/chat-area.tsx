"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useChatContext } from "./chat-context";
import { ChatContainer } from "@/components/ui/chat-container";
import { Markdown } from "@/components/ui/markdown";
import {
  Message as MessageComponent,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";

export interface Message {
  role: string;
  content: string;
}

export interface Conversation {
  id: string;
  name: string;
  history: Message[];
  createdAt: string;
}

interface ChatAreaProps {
  conversation: Conversation;
}

const ChatArea = ({ conversation }: ChatAreaProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useChatContext();
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const messages = conversation.history;

  const handleCopy = (content: string, messageId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="flex w-full flex-col overflow-hidden max-h-[80vh]">
      <div className="flex items-center justify-between border-b p-3">
        <div className="text-sm font-medium">{conversation.name}</div>
      </div>

      <ChatContainer
        className="flex-1 space-y-4 p-4"
        autoScroll={autoScroll}
        ref={chatContainerRef}
      >
        {messages?.map((message, i) => {
          const isAssistant = message.role === "assistant";

          return (
            <MessageComponent
              key={i}
              className={
                message.role === "user" ? "justify-end" : "justify-start"
              }
            >
              {isAssistant && (
                <MessageAvatar
                  src="/avatars/ai.png"
                  alt="Assistant IA"
                  fallback="AI"
                />
              )}
              <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                {isAssistant ? (
                  <div className="bg-secondary text-foreground prose relative rounded-lg p-3">
                    <Markdown>{message.content}</Markdown>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1"
                      onClick={() => handleCopy(message.content, i)}
                    >
                      {copiedId === i ? (
                        <Check className="h-4 w-4" color="green" />
                      ) : (
                        <Copy className="h-4 w-4" color="gray" />
                      )}
                    </Button>
                  </div>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground">
                    {message.content}
                  </MessageContent>
                )}
              </div>
              {!isAssistant && (
                <MessageAvatar
                  src="https://github.com/shadcn.png"
                  alt="Utilisateur"
                  fallback="User"
                />
              )}
            </MessageComponent>
          );
        })}

        {isLoading && (
          <MessageComponent className="justify-start">
            <MessageAvatar
              src="/avatars/ai.png"
              alt="Assistant IA"
              fallback="AI"
            />
            <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
              <div className="bg-secondary text-foreground prose rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                </div>
              </div>
            </div>
          </MessageComponent>
        )}
      </ChatContainer>
    </div>
  );
};

export default ChatArea;
