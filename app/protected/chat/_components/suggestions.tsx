"use client";

import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { useRouter } from "next/navigation";
import { createConversation, sendMessage } from "@/actions/conversations";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SuggestionsProps {
  onSelectSuggestion?: (suggestion: string) => void;
}

export function Suggestions({ onSelectSuggestion }: SuggestionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggestionClick = async (suggestion: string) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
      return;
    }

    // If no callback is provided, handle the suggestion directly
    setIsLoading(true);
    try {
      // Create a new conversation and get its ID
      const conversation = await createConversation(suggestion);

      if (!conversation || !conversation.id) {
        throw new Error("Impossible de créer une nouvelle conversation");
      }

      // Send the message to the new conversation
      await sendMessage(conversation.id.toString(), suggestion);

      // Redirect to the new conversation
      router.push(`/protected/chat/${conversation.id}`);

      toast({
        title: "Message envoyé",
        description: "Votre question a été envoyée avec succès.",
      });
    } catch (error) {
      console.error("Error sending suggestion:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de l'envoi de la suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {accountingPrompts.map((prompt) => (
            <PromptSuggestion
              key={prompt}
              onClick={() => handleSuggestionClick(prompt)}
              disabled={isLoading}
            >
              {prompt}
            </PromptSuggestion>
          ))}
        </div>
      </div>
    </div>
  );
}

const accountingPrompts = [
  "Comment calculer la TVA déductible sur mes achats ?",
  "Quelles sont les déductions fiscales pour les auto-entrepreneurs ?",
  "Comment comptabiliser une facture d'achat avec plusieurs taux de TVA ?",
  "Quelle est la différence entre un bilan et un compte de résultat ?",
];
