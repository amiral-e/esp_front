"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, PaperclipIcon, SendIcon, X } from "lucide-react"
import { sendMessage, sendMessageWithCollection } from "@/actions/conversations"
import { useParams, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { getCollections, getGlobalCollection } from "@/actions/collections"
import { getKnowledges, type KnowledgeLevel, updateProfile, getProfile } from "@/actions/profile"
import type { Collection } from "@/actions/collections"
import { useChatContext } from "./chat-context"
import { isAdministrator } from "@/actions/admin"
import { toast } from "react-toastify"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const formSchema = z.object({
  message: z.string().min(2).max(50),
  collections: z.array(z.string()).optional().default([]),
  knowledgeLevel: z.string().default("intermediate"),
})

export default function ChatForm() {
  const { id } = useParams()
  const router = useRouter()
  const { isLoading, setIsLoading } = useChatContext()
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [knowledgeLevels, setKnowledgeLevels] = useState<KnowledgeLevel[]>([])
  const [selectedKnowledgeLevel, setSelectedKnowledgeLevel] = useState("intermediate")
  const [isAdmin, setIsAdmin] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      collections: [],
      knowledgeLevel: "intermediate",
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const adminStatus = await isAdministrator()
      setIsAdmin(adminStatus)
      let collections: Collection[] = []
      if (!adminStatus) {
        collections = await getCollections()
      } else {
        collections = await getGlobalCollection()
      }

      // Remove duplicates
      const uniqueCollections = collections.reduce((acc: Collection[], current) => {
        if (!acc.find((item) => item.collection === current.collection)) {
          acc.push(current)
        }
        return acc
      }, [])

      setCollections(uniqueCollections)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchKnowledgeLevels = async () => {
      const levels = await getKnowledges()
      if (levels.length > 0) {
        setKnowledgeLevels(levels)
      }
    }
    fetchKnowledgeLevels()
  }, [])

  useEffect(() => {
    const fetchUserLevel = async () => {
      const profile = await getProfile()
      if (profile && profile.profile) {
        setSelectedKnowledgeLevel(profile.profile.level)
        form.setValue("knowledgeLevel", profile.profile.level)
      }
    }
    fetchUserLevel()
  }, [form])

  const handleCollectionToggle = (collection: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collection) ? prev.filter((c) => c !== collection) : [...prev, collection],
    )
  }

  const handleRemoveCollection = (collection: string) => {
    setSelectedCollections((prev) => prev.filter((c) => c !== collection))
  }

  const handleKnowledgeLevelChange = async (level: string) => {
    setSelectedKnowledgeLevel(level)
    form.setValue("knowledgeLevel", level)
    // update user level
    const response = await updateProfile(level)
    if (response) {
      toast.success("Le niveau de connaissance a été mis à jour avec succès !")
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.message.trim()) return

    setIsLoading(true)
    try {
      if (selectedCollections.length > 0) {
        for (const collection of selectedCollections) {
          await sendMessageWithCollection(Number(id), values.message, [collection])
        }
      } else {
        const response = await sendMessage(Number(id), values.message)
        if (response.error && response.error === "Request failed with status code 402") {
          toast.error("Crédits insuffisants, veuillez recharger votre compte !")
          return
        }
      }
      form.reset()
      router.refresh()
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Une erreur est survenue lors de l'envoi du message")
    }
    setIsLoading(false)
  }

  return (
    <Card className="mt-2 p-2 border-slate-200 dark:border-slate-800 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* Selected Collections */}
          {selectedCollections.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCollections.map((collection) => (
                <Badge key={collection} variant="secondary" className="px-3 py-1">
                  {collection.split("_")[1]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => handleRemoveCollection(collection)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Collections Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Collections</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {collections.length === 0 ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucune collection disponible</div>
                ) : (
                  collections.map((collection) => (
                    <DropdownMenuCheckboxItem
                      key={collection.collection}
                      checked={selectedCollections.includes(collection.collection)}
                      onCheckedChange={() => handleCollectionToggle(collection.collection)}
                    >
                      {collection.collection.split("_")[1]}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Knowledge Level Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10">
                  {selectedKnowledgeLevel.charAt(0).toUpperCase() + selectedKnowledgeLevel.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Niveau de connaissance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {knowledgeLevels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level.id}
                    checked={selectedKnowledgeLevel === level.name}
                    onCheckedChange={() => handleKnowledgeLevelChange(level.name)}
                  >
                    {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Message Input */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Posez une question..." className="h-10 focus-visible:ring-primary" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10"
              disabled={isLoading || !form.getValues().message.trim()}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}