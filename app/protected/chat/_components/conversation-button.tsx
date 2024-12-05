"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircleIcon, EllipsisIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ConversationButtonProps {
  title: string;
  isActive?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  createdAt?: string;
}

const ConversationButton = ({
  title,
  isActive = false,
  onSelect,
  onDelete,
  createdAt,
}: ConversationButtonProps) => {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className={cn(
          "w-64 justify-start gap-2 rounded-lg px-3 py-2 text-left",
          isActive && "bg-accent",
          "group-hover:bg-accent/50"
        )}
        onClick={onSelect}
      >
        <MessageCircleIcon className="h-4 w-4 shrink-0" />
        <div className="flex-1 truncate w-52">{title}</div>
        <div className="text-xs text-muted-foreground">
          {createdAt && new Date(createdAt).toLocaleDateString()}
        </div>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-background">
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDelete}
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConversationButton;
