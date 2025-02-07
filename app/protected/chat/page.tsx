"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  fetchConversationsByConvId,
  Message,
  sendMessage,
} from "./conversation-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collections, fetchCollections } from "@/app/actions/collection-action";
import ChatForm from "./_components/chat-form";
import UserChat from "./_components/user-chat";
import TypingEffect from "@/components/typing-effect";

const ChatPage = ({ activeConversation }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
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
    <div className="flex flex-col min-w-full p-4 h-[900px]">
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
        convId={activeConversation}
        collections={collections}
        isLoading={isLoading}
        onMessageSubmit={handleNewMessage}
        onMessageResponse={handleMessageResponse}
        sendMessage={sendMessage}
      />
      {/* <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-1"
          disabled={isLoading}
        />

        <div className="relative">
          <Button
            type="button"
            onClick={() => {
              toggleDropdown();
            }}
            className="p-2 h-12 w-12"
          >
            {selectedCollection ? (
              <span className="truncate text-sm">
                {collections.find(c => c.table_name === selectedCollection)?.name}
              </span>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
              <ul className="py-2">
                {collections.map((option, index) => (
                  <li key={option.table_name} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <button
                      onClick={() => {
                        setSelectedCollection(option.table_name);
                        setIsDropdownOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setIsDropdownOpen(false);
                        }
                      }}
                      className="w-full text-left"
                    >
                      {option.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          size={"icon"}
          className="p-2 h-12 w-12"
        >
          <Send className="h-6 w-6" />
        </Button>
      </form> */}
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

export default ChatPage;
