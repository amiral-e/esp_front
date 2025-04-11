"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addDocumentsToCollection } from "@/actions/collection.action";
import { Collection } from "./columns";
import { PlusIcon } from "lucide-react";

const ModalAddDocuments = ({
  collection,
  userId,
}: {
  collection: Collection;
  userId: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleSubmit = async () => {
    if (files.length === 0) return;

    try {
      // Convertir les fichiers en texte
      const fileContents = await Promise.all(
        files.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsText(file);
          });
        })
      );
      // Ajouter les documents à la collection
      await addDocumentsToCollection(
        collection.collection,
        userId,
        fileContents,
        files.map((f: File) => f.name).join(",") // Convert array to comma-separated string
      );

      router.refresh();
      setFiles([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout des documents:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter des documents</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />
            {files.length > 0 && (
              <>
                <b>{files.length} fichier(s) sélectionné(s)</b>
                <br />
                <b>{files.map((file) => file.name).join(", ")}</b>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setFiles([]);
            }}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Ajouter</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalAddDocuments;
