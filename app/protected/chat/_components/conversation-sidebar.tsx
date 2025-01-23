"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConversationButton from "./conversation-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  // AlertDialog,
  // AlertDialogAction,
  // AlertDialogCancel,
  // AlertDialogContent,
  // AlertDialogDescription,
  // AlertDialogFooter,
  // AlertDialogHeader,
  // AlertDialogTitle,
  // AlertDialogTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Conversation, createConversation, deleteConversation, fetchConversations, updateConversation } from "../conversation-action";
import { toast } from "@/hooks/use-toast";

interface ConversationSidebarProps {
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
}

const ConversationSidebar = ({ activeConversation, setActiveConversation }: ConversationSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      const listeConvs = await fetchConversations();
      if (listeConvs.error) {
        console.log(listeConvs.error);
      }
      if (listeConvs.conversation?.conversations) {
        setConversations(listeConvs.conversation);
      } else {
        console.log("No conversations found");
      }
    } catch (err) {
      console.log("Failed to fetch conversations");
      setConversations(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateConversation = async () => {
    if (newTitle.trim()) {
      const newConv = await createConversation(newTitle.trim());
      if(newConv.message) {
        const msg = newConv.message.split(' ');
        const newId = msg[msg.length - 1];
        setActiveConversation(newId);
        fetchData();
        setNewTitle("");
        setIsDialogOpen(false);
        toast({
          title: "Conversation created",
          description: JSON.stringify(newConv.message),
          variant: "default",
        });
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const deletedConv = await deleteConversation(id);
      if (deletedConv.error) {
        console.error(deletedConv.error);
      }
      setActiveConversation(null);
      fetchData();
      toast({
        title: "Conversation deleted",
        description: JSON.stringify(deletedConv.message),
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error deleting conversation",
        description: JSON.stringify(error),
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, title: string) => {
    if (id) {
      await updateConversation(id, title);
    }
    setActiveConversation(id);
    fetchData()
  };

  return (
    <div className="flex flex-col gap-4 border-r p-4 max-w-96 min-h-screen">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Nouvelle conversation
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nommez votre conversation</DialogTitle>
            <DialogDescription>
              Entrez un titre pour la nouvelle conversation.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Entrez le titre de la conversation"
            className="my-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateConversation}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
          {conversations?.conversations
            ?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((conversation: any) => (
              <ConversationButton
                key={conversation.id}
                title={conversation.name}
                createdAt={conversation.created_at}
                isActive={activeConversation === conversation.id}
                onSelect={() => setActiveConversation(conversation.id)}
                onDelete={() => handleDelete(conversation.id)}
                onUpdate={(updatedTitle) => handleUpdate(conversation.id, updatedTitle)}
              />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;
