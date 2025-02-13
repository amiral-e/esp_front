"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchConversationsByConvId,
  Message,
  sendMessage,
} from "../conversation-action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collections, fetchCollections } from "@/app/actions/collection-action";
import ChatForm from "./chat-form";
import UserChat from "./user-chat";
import { AlertCircle } from "lucide-react";

interface ChatContainerProps {
  activeConversation: string | null;
}

const ChatContainer = ({ activeConversation }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [collections, setCollections] = useState<Collections[]>([]);

  const showConversation = async (convId: string) => {
    if (!convId) return;
    try {
      const fetchedConv = await fetchConversationsByConvId(convId);
      if (fetchedConv.error) {
        console.error(fetchedConv.error);
        setError(fetchedConv.error);
      }
      if (fetchedConv.conversation) {
        setMessages(fetchedConv.conversation.history);
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const getCollections = async () => {
    try {
      const fetchedCollection = await fetchCollections();
      if (fetchedCollection.error) {
        console.error(fetchedCollection.error);
      }
      if (fetchedCollection.collections) {
        const formattedCollections = fetchedCollection.collections.map(
          (collection) => ({
            ...collection,
            status: collection.status as "global" | "normal",
          })
        );
        setCollections(formattedCollections);
      }
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    setIsLoading(true);
  };

  const handleMessageResponse = (response: Message) => {
    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeConversation) {
      showConversation(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div className="flex flex-col min-w-full p-4 h-screen">
      <Card className="flex-1 p-4 mb-4 overflow-hidden w-full">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          {messages?.map((message, i) => (
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
      <ChatForm
        convId={activeConversation ?? ""}
        collections={collections}
        isLoading={isLoading}
        onMessageSubmit={handleNewMessage}
        onMessageResponse={handleMessageResponse}
        sendMessage={sendMessage}
      />
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ChatContainer;
