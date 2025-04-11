"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { sendMessage, createConversation } from "@/actions/conversations";
import { toast } from "@/hooks/use-toast";
import { getUserInfo } from "@/actions/auth.actions";
import { sendDocuments } from "@/actions/collection.action";

export function ConversationInput() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (input.trim() || files.length > 0) {
      setIsLoading(true);
      try {
        // Create a new conversation and get its ID
        const conversation = await createConversation(
          input.substring(0, 30) || "Nouvelle conversation"
        );

        if (!conversation || !conversation.id) {
          throw new Error("Impossible de créer une nouvelle conversation");
        }

        // If there are files, process them
        if (files.length > 0) {
          const user = await getUserInfo();

          if (!user) {
            throw new Error("Utilisateur non authentifié");
          }

          // Convert files to text content
          const fileContents = await Promise.all(
            files.map(async (file) => {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve(e.target?.result as string);
                };
                reader.readAsText(file);
              });
            })
          );

          // Add documents to a temporary collection for this conversation
          const collectionName = `conversation_${conversation.id}`;

          // Process each file individually
          for (const file of files) {
            const response = await sendDocuments(collectionName, file);
            console.log("SEND", response);
          }

          // Add a note about the uploaded files to the message
          const fileNames = files.map((f) => f.name).join(", ");
          const fileMessage = `J'ai joint les fichiers suivants: ${fileNames}.\n\n${input}`;
          await sendMessage(conversation.id.toString(), fileMessage);
        } else {
          // Send the regular message
          await sendMessage(conversation.id.toString(), input);
        }

        // Redirect to the new conversation
        router.push(`/protected/chat/${conversation.id}`);

        // Clear the input and files
        setInput("");
        setFiles([]);

        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès.",
        });
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors de l'envoi du message.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadInputRef?.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <PromptInput
        value={input}
        onValueChange={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className="w-full"
      >
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="bg-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              >
                <Paperclip className="size-4" />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="hover:bg-secondary/50 rounded-full p-1"
                  type="button"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <PromptInputTextarea
          placeholder="Posez votre question..."
          spellCheck={false}
        />

        <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
          <PromptInputAction tooltip="Joindre des fichiers">
            <label
              htmlFor="file-upload"
              className="hover:bg-secondary-foreground/10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl"
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                ref={uploadInputRef}
                accept=".txt,.pdf,.doc,.docx"
              />
              <Paperclip className="text-primary size-5" />
            </label>
          </PromptInputAction>

          <PromptInputAction
            tooltip={isLoading ? "Arrêter la génération" : "Envoyer le message"}
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSubmit}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
                <Square className="size-5 fill-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}
