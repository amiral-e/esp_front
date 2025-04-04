"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  sendMessage,
  sendMessageWithCollection,
} from "@/actions/conversations";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getUserInfo } from "@/app/actions";
import { getCollectionByUserId } from "@/actions/collections";
import {
  getKnowledges,
  KnowledgeLevel,
  getProfile,
  updateProfile,
} from "@/actions/profile";
import type { Collection } from "@/app/protected/collections/_components/columns";
import { useChatContext } from "./chat-context";
import { toast } from "@/hooks/use-toast";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputAction,
  PromptInputActions,
} from "@/components/ui/prompt-input";
import { ArrowUp, BookOpen, Paperclip, Square, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  message: z.string().min(2).max(50),
  collections: z.array(z.string()).optional().default([]),
  knowledgeLevel: z.string().default("intermediate"),
});

export default function ChatForm() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoading, setIsLoading } = useChatContext();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [knowledgeLevels, setKnowledgeLevels] = useState<KnowledgeLevel[]>([]);
  const [selectedKnowledgeLevel, setSelectedKnowledgeLevel] =
    useState("intermediate");
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      collections: [],
      knowledgeLevel: "intermediate",
    },
  });

  async function onSubmit() {
    if (input.trim() || files.length > 0) {
      setIsLoading(true);
      try {
        if (selectedCollections.length > 0) {
          for (const collection of selectedCollections) {
            await sendMessageWithCollection(id?.toString() || "", input, [
              collection,
            ]);
          }
        } else {
          await sendMessage(id?.toString() || "", input);
        }
        setInput("");
        setFiles([]);
        router.refresh();
        setSelectedCollections([]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      setIsLoading(false);
    }
  }

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

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const collections = await getCollectionByUserId(user?.id || "");
      const uniqueCollections = collections.reduce(
        (acc: Collection[], current) => {
          if (!acc.find((item) => item.collection === current.collection)) {
            acc.push(current);
          }
          return acc;
        },
        []
      );

      setCollections(uniqueCollections);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchKnowledgeLevels = async () => {
      const levels = await getKnowledges();
      if (levels.length > 0) {
        setKnowledgeLevels(levels);
      }
    };
    fetchKnowledgeLevels();
  }, []);

  useEffect(() => {
    const fetchUserLevel = async () => {
      const profile = await getProfile();
      if (profile && profile.profile) {
        setSelectedKnowledgeLevel(profile.profile.level);
        form.setValue("knowledgeLevel", profile.profile.level);
      }
    };
    fetchUserLevel();
  }, []);

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <PromptInput
            value={input}
            onValueChange={setInput}
            isLoading={isLoading}
            onSubmit={onSubmit}
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
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <PromptInputTextarea placeholder="Posez une question..." />

            <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
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
                    />
                    <Paperclip className="text-primary size-5" />
                  </label>
                </PromptInputAction>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 py-1 px-2"
                      >
                        <BookOpen className="size-3" />
                        <span className="text-xs">
                          {selectedKnowledgeLevel}
                        </span>
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {knowledgeLevels.map((level: any) => (
                      <Badge
                        key={level.id}
                        onClick={() => {
                          setSelectedKnowledgeLevel(level.level);
                          form.setValue("knowledgeLevel", level.level);
                          updateProfile(level.level);
                        }}
                        className={
                          selectedKnowledgeLevel === level.level
                            ? "bg-secondary"
                            : ""
                        }
                      >
                        {level.level}
                      </Badge>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <PromptInputAction
                tooltip={
                  isLoading ? "Arrêter la génération" : "Envoyer le message"
                }
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={onSubmit}
                  disabled={isLoading}
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
        </form>
      </Form>
    </div>
  );
}
