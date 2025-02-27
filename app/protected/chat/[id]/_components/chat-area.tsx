"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserChat from "../../_components/user-chat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Inverser l'ordre des messages pour afficher les plus récents en bas
  const messages = conversation?.history
    ? [...conversation.history].reverse()
    : [];
  console.log(messages);
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleCopy = (content: string, messageId: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const formatMessage = (content: string) => {
    // Format code blocks
    let formattedContent = content.replace(
      /```([a-z]*)\n([\s\S]*?)```/g,
      '<pre class="bg-muted p-4 rounded-lg my-2"><code>$2</code></pre>'
    );

    // Format inline code
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1 rounded-md">$1</code>'
    );

    // Format bold text
    formattedContent = formattedContent.replace(
      /\*\*([^*]+)\*\*/g,
      "<strong>$1</strong>"
    );

    // Format lists
    formattedContent = formattedContent.replace(
      /^\- (.+)$/gm,
      '<li class="ml-4">• $1</li>'
    );

    // Format paragraphs
    formattedContent = formattedContent
      .split("\n\n")
      .map((p) => `<p class="my-2">${p}</p>`)
      .join("");

    return formattedContent;
  };

  useEffect(() => {
    if (conversation) {
      setIsLoading(false);
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.history]);

  return (
    <Card className="flex-1 p-4">
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-200px)]">
        <div className="pr-4">
          {messages.map((message, i) => (
            <div key={i} className={"flex justify-start mx-32 mt-8"}>
              {message.role === "user" ? (
                <UserChat
                  message={message.content}
                  userAvatar={"https://github.com/shadcn.png"}
                />
              ) : (
                <div className="w-full">
                  <h1 className="text-sm font-semibold">Compta</h1>
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content),
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
            <div className="flex justify-center items-center">
              <div className="">En train d'écrire...</div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatArea;
