"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { FileUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createReport } from "@/actions/report"
import dynamic from "next/dynamic"
import { Collection, getCollections, getGlobalCollection } from "@/actions/collections"
import { isAdministrator } from "@/actions/admin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PdfUploader = dynamic(() => import("./pdf-uploader"), {
  ssr: false,
})

export default function CreateReportForm() {
  const [title, setTitle] = useState("")
  const [prompt, setPrompt] = useState("")
  const [collectionName, setCollectionName] = useState("")
  const [documents, setDocuments] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [collection, setCollection] = useState<Collection[]>([])

  const router = useRouter()

  // Use effect to show toast after state update
  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false)
      setTimeout(() => {
        router.push("/protected/report")
      }, 1000)
    }
  }, [isSuccess, toast, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (title === "" || prompt === "" || documents.length === 0) {
      toast.error("Veuillez remplir tous les champs et télécharger au moins un document")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createReport(title, documents, prompt, collectionName)
      if(result === "Erreur lors de la création du rapport"){
        toast.error("Crédits insuffisants pour créer le rapport")
        setIsSubmitting(false)
        setIsSuccess(false)
        return
      }
      toast.success(result)
      // Set success state to trigger the useEffect
      setIsSuccess(true)

      // Clear form after successful submission
      setTitle("")
      setPrompt("")
      setCollectionName("")
      setDocuments([])
      setUploadedFiles([])
    } catch (error) {
      toast.error("Erreur lors de la création du rapport")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDocumentsUpdate = (extractedTexts: string[], fileNames: string[]) => {
    setDocuments(extractedTexts)
    setUploadedFiles(fileNames)
  }

  const collections = async () => {
    const isAdmin = await isAdministrator();
    return isAdmin ? await getGlobalCollection() : await getCollections()
  }

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await collections()
        setCollection(collectionsData)
      } catch (error) {
        console.error("Erreur lors de la récupération des collections:", error)
      }
    }
    fetchCollections()
  }, [])

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Générer votre rapport</CardTitle>
        <CardDescription>Téléchargez des documents et créez un rapport financier</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rapport</Label>
            <Input
              id="title"
              placeholder="Analyse financière du T1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection">Nom de la collection</Label>
            <Select value={collectionName} onValueChange={setCollectionName}>
              <SelectTrigger id="collection">
                <SelectValue placeholder="Sélectionnez une collection" />
              </SelectTrigger>
              <SelectContent>
                {collection.map((item) => (
                  <SelectItem key={item.collection} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Description de l'analyse</Label>
            <Textarea
              id="prompt"
              placeholder="Analysez les données financières et fournissez des insights sur..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Télécharger des documents</Label>
            <PdfUploader onDocumentsUpdate={handleDocumentsUpdate} />

            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Documents téléchargés :</h4>
                <ul className="text-sm space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FileUp className="h-4 w-4 text-muted-foreground" />
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du rapport...
              </>
            ) : (
              "Créer le rapport"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}