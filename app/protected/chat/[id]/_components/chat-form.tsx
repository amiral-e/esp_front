"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  PaperclipIcon,
  SendIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { createConversation, sendMessage } from "../../conversation-action";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { ingestDocument } from "@/app/actions/document-action";
import { getUserInfo } from "@/app/actions";
import { getCollectionByUserId } from "@/actions/collections";
import { Collection } from "@/app/protected/collections/_components/columns";
import { sendMessageWithCollection } from "@/actions/conversations";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  message: z.string().min(2).max(50),
  collections: z.array(z.string()).default([]),
});

export default function ChatForm() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      collections: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    try {
      if (values.collections && values.collections.length > 0) {
        // Assurons-nous que collections est bien un tableau
        const collectionsArray = Array.isArray(values.collections)
          ? values.collections
          : [values.collections];

        const response = await sendMessageWithCollection(
          id?.toString() || "",
          "Décris le document",
          ["Document 02/25"]
        );
        console.log(response);
      } else {
        await sendMessage(id?.toString() || "", values.message);
      }
      form.reset();
      router.refresh();
      setIsLoading(false);
      setSelectedCollection("");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const collections = await getCollectionByUserId(user?.id || "");
      setCollections(collections);
    };
    fetchData();
  }, []);

  const handleCollectionSelect = (collection: string) => {
    setSelectedCollection(collection);
    form.setValue("collections", [collection]);
  };

  const handleRemoveCollection = () => {
    setSelectedCollection("");
    form.setValue("collections", []);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end space-x-4 w-full"
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" className="h-12">
              <PaperclipIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ajouter un document</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {collections.map((collection) => (
              <DropdownMenuRadioGroup
                defaultValue={collections[0].collection}
                onValueChange={(value) => form.setValue("collections", [value])}
              >
                <DropdownMenuRadioItem
                  key={collection.id}
                  onClick={() =>
                    handleCollectionSelect(collection.metadata.doc_file)
                  }
                  value={collection.metadata.doc_file}
                >
                  {collection.metadata.doc_file}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              {selectedCollection && (
                <Badge className="inline-flex">
                  {selectedCollection}
                  <Button
                    onClick={handleRemoveCollection}
                    variant="ghost"
                    className="h-5 w-5 hover:bg-transparent"
                  >
                    <XIcon />
                  </Button>
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    placeholder="Posez une question"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="h-12">
          <SendIcon />
        </Button>
      </form>
    </Form>
  );
}
