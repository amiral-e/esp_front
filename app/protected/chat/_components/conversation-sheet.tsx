import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HistoryIcon } from "lucide-react";
import { Conversation } from "@/actions/conversations";
import { CellAction } from "@/components/cell-action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
interface ConversationSheetProps {
  conversations: Conversation[];
}

const ConversationSheet = ({ conversations }: ConversationSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <HistoryIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Conversations</SheetTitle>
          <div className="space-y-4 p-2">
            {conversations?.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between w-full rounded-md hover:bg-muted transition-colors duration-200 p-2"
              >
                <Link
                  className="w-full"
                  href={`/protected/chat/${conversation.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{conversation.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(conversation.created_at).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </Link>
                <CellAction
                  data={{
                    id: Number(conversation.id),
                    name: conversation.name,
                  }}
                />
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ConversationSheet;
