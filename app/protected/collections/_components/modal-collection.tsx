"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCollection } from "@/actions/collections"
import { useRouter } from "next/navigation"
import { Upload, X, FileText } from "lucide-react"

interface ModalCollectionProps {
  children: React.ReactNode
  userId: string
  isAdmin?: boolean
}

export default function ModalCollection({ children, userId, isAdmin = false }: ModalCollectionProps) {
  const [open, setOpen] = useState(false)
  const [collectionName, setCollectionName] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!collectionName.trim()) {
      setError("Le nom de la collection est requis.")
      return
    }

    if (files.length === 0) {
      setError("Au moins un fichier est requis.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      await createCollection(collectionName, files)

      setOpen(false)
      setCollectionName("")
      setFiles([])
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la création de la collection :", error)
      setError("La création de la collection a échoué. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isAdmin ? "Créer une collection globale" : "Créer une collection"}</DialogTitle>
            <DialogDescription>
              Créez une nouvelle collection et ajoutez-y des documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="col-span-3"
                placeholder="Entrez le nom de la collection"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="files" className="text-right">
                Fichiers
              </Label>
              <div className="col-span-3">
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50"
                  onMouseOver={() => fileInputRef.current?.click()}
                  role="button"
                >
                  <Upload className="h-6 w-6 mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cliquez pour téléverser ou glissez-déposez</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="files"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {error && <div className="col-span-4 text-destructive text-sm">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création en cours..." : "Créer la collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}