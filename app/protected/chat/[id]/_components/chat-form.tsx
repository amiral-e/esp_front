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
  collection: z.string().optional(),
});

export default function ChatForm() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      collection: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    try {
      await sendMessage(
        id?.toString() || "",
        values.message,
        values.collection || ""
      );
      if (values.collection) {
        await sendMessageWithCollection(id?.toString() || "", values.message, [
          values.collection,
        ]);
      }
      form.reset();
      router.refresh();
      setIsLoading(false);
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
                onValueChange={(value) => form.setValue("collection", value)}
              >
                <DropdownMenuRadioItem
                  key={collection.id}
                  onClick={() =>
                    form.setValue("collection", collection.collection)
                  }
                  value={collection.collection}
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
              {form.watch("collection") && (
                <Badge className="inline-flex">
                  {form.watch("collection")}
                  <Button
                    onClick={() => form.reset({ collection: "" })}
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
