"use client"

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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import type React from "react"
import { useState } from "react"
import { createConversation } from "@/actions/conversations"
import { useRouter } from "next/navigation"

const Modal = ({
  children,
  userId,
  asChild = true,
}: {
  children: React.ReactNode
  userId: string
  asChild?: boolean
}) => {
  const [name, setName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      const conversation = await createConversation(name)
      router.refresh()
      setName("")
      setIsOpen(false)
    } catch (error) {
      console.error("Error creating conversation:", error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Nommez votre conversation</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Entrez un nom pour votre conversation"
              className="mt-2"
              autoFocus
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={!name.trim()}>
            Continuer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Modal