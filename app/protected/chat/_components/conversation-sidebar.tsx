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
import { Conversation, fetchConversations } from "../conversation-action";



const ConversationSidebar = () => {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<string | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const listeConvs = await fetchConversations();
        if (listeConvs.error) {
          console.log(listeConvs.error);
        }
        if (listeConvs.conversation) {
          // setConversations(listeConvs.conversation);
        } else {
          console.log("No conversations found");
        }
      } catch (err) {
        console.log("Failed to fetch conversationsss");
      }
    };
    fetchData();
  }, []);

  const handleNewChat = () => {
    setIsDialogOpen(true);
  };

  const handleCreateConversation = () => {
    if (newTitle.trim()) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        name: newTitle.trim(),
        createAt: new Date().toISOString(),
        conv: []
      };
      setConversations([newConversation, ...conversations]);
      setActiveConversation(newConversation.id);
      setNewTitle("");
      setIsDialogOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setConversations(conversations.filter((conv: any) => conv.id !== id));
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
          {conversations.map((conversation: Conversation) => (
            <ConversationButton
              key={conversation.id}
              title={conversation.name}
              createdAt={conversation.createAt}
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
