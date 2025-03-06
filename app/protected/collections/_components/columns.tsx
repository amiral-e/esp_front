"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CellAction } from "./cell-action";
import ModalAddDocuments from "./modal-add-documents";
import { Accordion } from "@/components/ui/accordion";

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
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          {...{
            className: "size-7 shadow-none text-muted-foreground",
            onClick: row.getToggleExpandedHandler(),
            "aria-expanded": row.getIsExpanded(),
            "aria-label": row.getIsExpanded()
              ? `Collapse details for ${row.original.collection}`
              : `Expand details for ${row.original.collection}`,
            size: "icon",
            variant: "ghost",
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronUpIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="opacity-60"
              size={16}
              aria-hidden="true"
            />
          )}
        </Button>
      ) : undefined;
    },
  },
  {
    accessorKey: "collection",
    header: "Collection",
    cell: ({ row }) => {
      const collectionName = row.original.collection;
      const displayName = collectionName.includes("_")
        ? collectionName.split("_").slice(1).join("_")
        : collectionName;

      return <span>{displayName}</span>;
    },
  },
  {
    accessorKey: "metadata.doc_file",
    header: "Nombre de fichiers",
    cell: ({ row }) => {
      // Récupérer le nombre de documents dans cette collection
      const documentsCount = (row.original as any).documents?.length || 0;

      return (
        <span>
          {documentsCount} {documentsCount > 1 ? "fichiers" : "fichier"}
        </span>
      );
    },
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
      return (
        <div className="flex items-center gap-2">
          <ModalAddDocuments
            collection={row.original}
            userId={row.original.metadata.user}
          />
          {/* <CellAction data={row.original} /> */}
        </div>
      );
    },
  },
];
