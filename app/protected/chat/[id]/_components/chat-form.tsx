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
import {
  sendMessage,
  sendMessageWithCollection,
} from "@/actions/conversations";
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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/app/actions";
import { getCollectionByUserId } from "@/actions/collections";
import { Collection } from "@/app/protected/collections/_components/columns";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  message: z.string().min(2).max(50),
  collections: z.array(z.string()).optional().default([]),
});

export default function ChatForm() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

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
      if (selectedCollections.length > 0) {
        // Envoyer le message avec toutes les collections sélectionnées
        for (const collection of selectedCollections) {
          const response = await sendMessageWithCollection(
            id?.toString() || "",
            values.message,
            [collection]
          );
          console.log(response);
        }
      } else {
        const response = await sendMessage(
          id?.toString() || "",
          values.message
        );
        console.log(response);
      }
      form.reset();
      router.refresh();
      setIsLoading(false);
      setSelectedCollections([]);
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

  const handleCollectionToggle = (collection: string) => {
    setSelectedCollections((prev) => {
      // Si la collection est déjà sélectionnée, la retirer
      if (prev.includes(collection)) {
        return prev.filter((c) => c !== collection);
      }
      // Sinon, l'ajouter
      return [...prev, collection];
    });

    // Mettre à jour le formulaire
    form.setValue("collections", selectedCollections);
  };

  const handleRemoveCollection = (collection: string) => {
    setSelectedCollections((prev) => prev.filter((c) => c !== collection));
    form.setValue(
      "collections",
      selectedCollections.filter((c) => c !== collection)
    );
  };

  return (
    <div>
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
              <DropdownMenuLabel>Ajouter des documents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {collections.map((collection) => (
                <DropdownMenuCheckboxItem
                  key={collection.id}
                  checked={selectedCollections.includes(collection.collection)}
                  onCheckedChange={() =>
                    handleCollectionToggle(collection.collection)
                  }
                >
                  {collection.metadata.doc_file}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                {selectedCollections.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCollections.map((collection) => (
                      <Badge key={collection} className="inline-flex">
                        {collection}
                        <Button
                          onClick={() => handleRemoveCollection(collection)}
                          variant="ghost"
                          className="h-5 w-5 hover:bg-transparent"
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      placeholder="Posez une question"
                      className="h-12"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {isLoading && <Loader2 className="w-6 h-6 animate-spin" />}
          <Button type="submit" className="h-12" disabled={isLoading}>
            <SendIcon />
          </Button>
        </form>
      </Form>
    </div>
  );
}
