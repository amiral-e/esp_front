"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { EyeIcon, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CellAction } from "./cell-action";

export interface Collection {
  id: string;
  name: string;
  external_id: string;
  collection: string;
  document: string;
  metadata: {
    user: string;
    doc_id: string;
    doc_file: string;
    create_date: string;
  };
  embeddings: string;
}

export const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => {
      const document = row.original.document;
      const lines = document.split("\n").filter((line) => line.trim() !== "");

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <EyeIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{row.original.metadata.doc_file}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-2 whitespace-pre-wrap">{document}</div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "collection",
    header: "Collection",
  },
  {
    accessorKey: "metadata.doc_file",
    header: "Fichier",
  },
  {
    accessorKey: "metadata.create_date",
    header: "Date de création",
    cell: ({ row }) => {
      const metadata = row.original.metadata;
      const dateStr = metadata?.create_date;

      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return "Date invalide";
        }
        return date.toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        return "Date invalide";
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const document = row.original.document;
      const lines = document.split("\n").filter((line) => line.trim() !== "");

      return <CellAction data={row.original} />;
    },
  },
];
