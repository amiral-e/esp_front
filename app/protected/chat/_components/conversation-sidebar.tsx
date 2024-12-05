"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConversationButton from "./conversation-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

const ConversationSidebar = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<
    string | null
  >(null);
  const [newTitle, setNewTitle] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleNewChat = () => {
    setIsDialogOpen(true);
  };

  const handleCreateConversation = () => {
    if (newTitle.trim()) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        createdAt: new Date().toISOString(),
      };
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation.id);
      setNewTitle("");
      setIsDialogOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (activeConversation === id) {
      setActiveConversation(null);
    }
  };

  return (
    <div className="flex h-screen flex-col gap-4 border-r p-4 max-w-96">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button onClick={handleNewChat} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Nouvelle conversation
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nommez votre conversation</AlertDialogTitle>
            <AlertDialogDescription>
              <Input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Entrez le titre de la conversation"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewTitle("")}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateConversation}>
              Créer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <ConversationButton
              key={conversation.id}
              title={conversation.title}
              createdAt={conversation.createdAt}
              isActive={activeConversation === conversation.id}
              onSelect={() => setActiveConversation(conversation.id)}
              onDelete={() => handleDelete(conversation.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;
