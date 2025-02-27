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
  sendDocuments,
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim() || files.length === 0) return;

    setIsLoading(true);

    try {
      // Traiter chaque fichier
      for (const file of files) {
        // Lire le contenu du fichier
        const fileContent = await readFileAsText(file);

        // Créer la collection avec le contenu du fichier
        try {
          await createCollection(name, userId, fileContent, file.name);
        } catch (apiError) {
          console.error("Erreur lors de l'envoi du fichier à l'API:", apiError);
          // Continuer même si l'envoi à l'API échoue
        }
      }

      router.refresh();
      setName("");
      setFiles([]);
    } catch (error) {
      console.error("Erreur lors de la création de la collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour lire le contenu d'un fichier
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Échec de la lecture du fichier"));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
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
              disabled={isLoading}
            />
            <div className="space-y-2">
              <Input
                type="file"
                multiple
                accept=".txt,.md"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
                disabled={isLoading}
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
            disabled={isLoading}
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading || !name.trim() || files.length === 0}
          >
            {isLoading ? "Création en cours..." : "Créer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalCollection;
