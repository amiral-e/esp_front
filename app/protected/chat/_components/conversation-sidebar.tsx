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
import { Conversation, createConversation, deleteConversation, fetchConversations, updateConversation } from "../conversation-action";

interface ConversationSidebarProps {
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
}

const ConversationSidebar = ({ activeConversation, setActiveConversation }: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    console.log("Fetching conversations");
    try {
      const listeConvs = await fetchConversations();
      if (listeConvs.error) {
        console.log(listeConvs.error);
      }
      if (listeConvs.conversation?.convs) {
        setConversations(listeConvs.conversation);
        console.log('listeConvs',conversations);
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

  const handleCreateConversation = async () => {
    console.log("Creating conversation with title:");
    if (newTitle.trim()) {
      const newConv = await createConversation(newTitle.trim());
      if (newConv?.conv) {
        const res = await updateConversation(newConv.conv.id, newTitle);
        console.log(res)
        setActiveConversation(newConv.conv.id);
        fetchData();
        setNewTitle("");
        setIsDialogOpen(false);
      }
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
    <div className="flex flex-col gap-4 border-r p-4 max-w-96 h-screen">
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
            ?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
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
