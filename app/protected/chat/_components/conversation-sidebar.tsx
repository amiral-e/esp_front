"use client";

import React, { useEffect, useState } from "react";
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
import { Conversations, deleteConversation, fetchConversations } from "../conversation-action";

interface ConversationSidebarProps {
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
}

const ConversationSidebar = ({ activeConversation, setActiveConversation }: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversations | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const listeConvs = await fetchConversations();
      if (listeConvs.error) {
        console.log(listeConvs.error);
      }
      if (listeConvs.conversation?.convs) {
        setConversations(listeConvs.conversation);
      } else {
        console.log("No conversations found");
      }
    } catch (err) {
      console.log("Failed to fetch conversations");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewChat = () => {
    setIsDialogOpen(true);
  };

  const handleCreateConversation = () => {
    if (newTitle.trim()) {
      const newConversation: Conversations = {
        id: Date.now().toString(),
        name: newTitle.trim(),
        createAt: new Date().toISOString(),
        convs: [],
      };
      // setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation.id);
      setNewTitle("");
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (activeConversation === id) {
      setActiveConversation(null);
    }
    try {
      const fetchedConv = await deleteConversation(id);
      if (fetchedConv.error) {
        console.error(fetchedConv.error);
      }
      if (fetchedConv.conversation) {
        fetchData();
      }
    } catch (error) {
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
          {conversations?.convs
            ?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Sort by 'created_at'
            .map((conversation: any) => (
              <ConversationButton
                key={conversation.id}
                title={conversation.name}
                createdAt={conversation.created_at}
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
