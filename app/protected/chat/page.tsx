"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchConversationsByConvId, Message, sendMessage } from "./conversation-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarTaxiFront, Send } from "lucide-react";

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
        console.log("fetchedConv", fetchedConv.conversation);
        setMessages(fetchedConv.conversation.history);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
  
    const newMessage: Message = { role: "user", content: input.trim() };
  
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      const responseChat = await sendMessage(activeConversation, input);
      console.log("Response from sendMessage:", responseChat);
      if (responseChat) {
        setMessages((prev) => [
          ...prev,
          { role: responseChat.role ?? "", content: responseChat.content ?? "" },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    if (activeConversation) {
      console.log("Appel showConversation avec :", activeConversation);
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
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`p-4 rounded-xl rounded-br-none max-w-[80%] ${message.role === "user"
                  ? "bg-orange-500 text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                {message.content}
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
