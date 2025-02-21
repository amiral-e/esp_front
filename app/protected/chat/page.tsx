"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchConversationsByConvId, Message, sendMessage } from "./conversation-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, Plus } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Collections, fetchCollections } from "@/app/actions/collection-action";

const ChatPage = ({ activeConversation }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [collections, setCollections] = useState<Collections[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: "user", content: input.trim() };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseChat = await sendMessage(activeConversation, input, selectedCollection ?? "");

      let docFiles = null;
      console.log('responseChat', responseChat.sources);
      if (responseChat.sources) {
        docFiles = responseChat.sources
          .flatMap((item: { documents: { metadata: { doc_file: string } }[] }) =>
            item.documents.map(doc => doc.metadata.doc_file)
          )
          .join(", ");
      }
      const messageContent = docFiles
        ? `${responseChat.content}\nSources: ${docFiles}`
        : responseChat.content;

      if (responseChat) {
        setMessages((prev) => [
          ...prev,
          {
            role: responseChat.role ?? "",
            content: messageContent,
          },
        ]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCollections = async () => {
    try {
      const fetchedCollection = await fetchCollections();
      if ((fetchedCollection.collections ?? []).length > 0) {
        const formattedCollections = (fetchedCollection.collections ?? []).map((collection) => ({
          ...collection,
          status: collection.status as "global" | "normal",
        }));
        setCollections(formattedCollections);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
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
    <div className="flex flex-col w-full min-h-screen p-4">
      <Card className="flex-1 p-4 mb-4 overflow-hidden">
        <ScrollArea
          className="h-full pr-4 overflow-y-auto"
          ref={scrollAreaRef}
        >
          {messages?.map((message, i) => (
            <div
              key={i}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`p-4 rounded-xl rounded-br-none max-w-[80%] text-sm ${message.role === "user"
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
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        {/* Input de saisie */}
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-1"
          disabled={isLoading}
        />

        {/* Bouton "+" avec menu déroulant */}
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
                {collections.find(c => c.collection === selectedCollection)?.name}
              </span>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
              <ul className="py-2">
                {collections.map((option, index) => (
                  <li key={option.collection} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <button
                      onClick={() => {
                        setSelectedCollection(option.collection);
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
      </form>
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
