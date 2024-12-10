"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchConversationsByConvId, Message } from "./conversation-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const ChatPage = ({ activeConversation }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const showConversation = async (convId: string) => {
    if (!convId) return;
    try {
      const fetchedConv = await fetchConversationsByConvId(convId);
      if (fetchedConv.error) {
        console.error(fetchedConv.error);
      }
      if (fetchedConv.conversation) {
        setMessages(fetchedConv.conversation.conv);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev: any) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // call API send message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const aiMessage = await response.json();
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    if (activeConversation) {
      showConversation(activeConversation);
    }
  }, [activeConversation]);

  return (
    <div className="container flex flex-col w-full p-4" style={{ height: "80vh" }}>
      <Card className="flex-1 p-4 mb-4">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          {messages?.map((message, i) => (
            <div
              key={i}
              className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`p-4 rounded-xl rounded-br-none max-w-[80%] ${message.sender === "user"
                  ? "bg-orange-500 text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                {message.message}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-xl rounded-br-none bg-muted">
                En train d'écrire...
              </div>
            </div>
          )}
        </ScrollArea>
      </Card>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading}
          size={"icon"}
          className="p-2 h-12 w-12"
        >
          <Send className="h-6 w-6" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;
