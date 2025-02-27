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
import { PlusIcon, PaperclipIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { createConversation } from "@/actions/conversations";
import { useRouter } from "next/navigation";
import {
  createCollection,
  addDocumentsToCollection,
} from "@/actions/collections";

const ModalCollection = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim() || files.length === 0) return;

    try {
      // Convertir les fichiers en texte
      const fileContents = await Promise.all(
        files.map(async (file) => {
          return new Promise<{ content: string; fileName: string }>(
            (resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve({
                  content: e.target?.result as string,
                  fileName: file.name,
                });
              };
              reader.readAsText(file);
            }
          );
        })
      );

      // Créer la collection avec le premier document
      await createCollection(
        name, // Utiliser le nom de collection saisi par l'utilisateur
        userId,
        fileContents[0].content,
        fileContents[0].fileName
      );

      // Si il y a plus d'un document, les ajouter à la collection
      if (fileContents.length > 1) {
        const remainingDocuments = fileContents.slice(1);

        // Ajouter chaque document individuellement
        for (let i = 0; i < remainingDocuments.length; i++) {
          await addDocumentsToCollection(
            name, // Utiliser le même nom de collection pour tous les documents
            userId,
            [remainingDocuments[i].content],
            remainingDocuments[i].fileName
          );
        }
      }

      router.refresh();
      setName("");
      setFiles([]);
    } catch (error) {
      console.error("Erreur lors de la création de la collection:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Créer une collection</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Nom de la collection"
            />
            <div className="space-y-2">
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
                <div className="text-sm text-muted-foreground">
                  {files.length} fichier(s) sélectionné(s)
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setName("");
              setFiles([]);
            }}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Créer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalCollection;
