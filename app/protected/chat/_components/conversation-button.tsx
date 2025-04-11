"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCircleIcon,
  EllipsisIcon,
  TrashIcon,
  FilePenIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConversationButtonProps {
  title: string;
  isActive?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onUpdate?: (newTitle: string) => void;
  created_at?: string;
}

const ConversationButton = ({
  title,
  isActive = false,
  onSelect,
  onDelete,
  onUpdate,
  created_at,
}: ConversationButtonProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEdit = () => {
    if (onUpdate && editedTitle.trim() !== "") {
      onUpdate(editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className={cn(
          "w-48 justify-start gap-3 rounded-lg px-4 py-3 text-left",
          isActive && "bg-accent",
          "group-hover:bg-accent/50"
        )}
        onClick={onSelect}
      >
        <MessageCircleIcon className="h-4 w-4 shrink-0" />
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
            }}
          />
        ) : (
          <div
            className="flex-1 truncate w-52"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          {created_at && new Date(created_at).toLocaleDateString()}
        </div>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 p-0 hover:bg-background">
          <EllipsisIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <FilePenIcon className="mr-2 h-4 w-4" />
            Editer
          </DropdownMenuItem>
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
