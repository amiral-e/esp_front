"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, PaperclipIcon, SendIcon, XIcon } from "lucide-react";
import {
  sendMessage,
  sendMessageWithCollection,
} from "@/actions/conversations";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/app/actions";
import { getCollectionByUserId } from "@/actions/collections";
import {
  getKnowledges,
  KnowledgeLevel,
  Profile,
  getProfile,
  User,
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      collections: [],
      knowledgeLevel: "intermediate",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (selectedCollections.length > 0) {
        for (const collection of selectedCollections) {
          await sendMessageWithCollection(
            id?.toString() || "",
            values.message,
            [collection]
          );
        }
      } else {
        await sendMessage(id?.toString() || "", values.message);
      }
      form.reset();
      router.refresh();
      setSelectedCollections([]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const collections = await getCollectionByUserId(user?.id || "");
      console.log(collections);
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

  const handleCollectionToggle = (collection: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collection)
        ? prev.filter((c) => c !== collection)
        : [...prev, collection]
    );
  };

  const handleRemoveCollection = (collection: string) => {
    setSelectedCollections((prev) => prev.filter((c) => c !== collection));
  };

  const handleKnowledgeLevelChange = async (level: string) => {
    setSelectedKnowledgeLevel(level);
    form.setValue("knowledgeLevel", level);
    // update user level
    const response = await updateProfile(level);
    if (response) {
      toast({ description: response.message });
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <PromptInput>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <PromptInputTextarea
                  placeholder="Posez une question"
                  {...field}
                />
              )}
            />
            <PromptInputActions>
              <PromptInputAction tooltip="Collections">
                <Button
                  variant="secondary"
                  onClick={() => {
                    /* Handle collections dropdown */
                  }}
                >
                  Collections
                </Button>
              </PromptInputAction>

              <PromptInputAction tooltip="Niveau">
                <Button
                  variant="outline"
                  onClick={() => {
                    /* Handle knowledge level dropdown */
                  }}
                >
                  {selectedKnowledgeLevel.charAt(0).toUpperCase() +
                    selectedKnowledgeLevel.slice(1)}
                </Button>
              </PromptInputAction>

              <PromptInputAction tooltip="Envoyer">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Envoyer"
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
