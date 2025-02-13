"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { Message } from "../conversation-action";
import { Collections } from "@/app/actions/collection-action";
import { useState } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Le message ne peut pas être vide"),
});

interface ChatFormProps {
  convId: string;
  collections: Collections[];
  isLoading: boolean;
  onMessageSubmit: (message: Message) => void;
  onMessageResponse: (response: any) => void;
  sendMessage: (
    convId: string,
    message: string,
    collection: string
  ) => Promise<any>;
}

const ChatForm = ({
  convId,
  collections,
  isLoading,
  onMessageSubmit,
  onMessageResponse,
  sendMessage,
}: ChatFormProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.message.trim() || isLoading) return;

    const newMessage: Message = {
      role: "user",
      content: values.message.trim(),
    };

    onMessageSubmit(newMessage);
    form.reset();

    try {
      const responseChat = await sendMessage(
        convId,
        values.message,
        selectedCollection ?? ""
      );

      if (responseChat) {
        onMessageResponse({
          role: responseChat.role ?? "",
          content: responseChat.content
            ? `${responseChat.content}\n\n${
                responseChat.sources
                  ? `(Sources:\n${Object.entries(responseChat.sources)
                      .map(([id, details]) => {
                        const detail = details as { filename: string };
                        return `- ${detail.filename} id: ${id}`;
                      })
                      .join("\n")})`
                  : ""
              }`
            : "",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Tapez votre message..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="relative">
          <Button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            size="icon"
          >
            {selectedCollection ? (
              <span className="truncate text-sm">
                {
                  collections.find((c) => c.table_name === selectedCollection)
                    ?.name
                }
              </span>
            ) : (
              <Plus className="h-6 w-6" />
            )}
          </Button>
          {isDropdownOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50">
              <ul className="py-2">
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCollection(null);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Button className="w-full text-left">
                    Aucune collection
                  </Button>
                </li>
                {collections.map((option) => (
                  <li
                    key={option.table_name}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedCollection(option.table_name);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left"
                    >
                      {option.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isLoading} size="icon">
          <Send className="h-6 w-6" />
        </Button>
      </form>
    </Form>
  );
};

export default ChatForm;
