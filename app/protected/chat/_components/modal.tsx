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
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { createConversation } from "@/actions/conversations";
import { useRouter } from "next/navigation";

const Modal = ({
  children,
  userId,
  asChild = true,
}: {
  children: React.ReactNode;
  userId: string;
  asChild?: boolean;
}) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      const conversation = await createConversation(name);
      router.refresh();
      setName("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nommez votre conversation</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
