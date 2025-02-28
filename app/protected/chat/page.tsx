"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchConversationsByConvId, type Message, sendMessage } from "./conversation-action"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MultiSelectDemo } from "../_components/multi-select-demo"

const ChatPage = ({ activeConversation }: any) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])

  const showConversation = async (convId: string) => {
    if (!convId) return
    try {
      const fetchedConv = await fetchConversationsByConvId(convId)
      if (fetchedConv.error) {
        console.error(fetchedConv.error)
        setError(fetchedConv.error)
      }
      if (fetchedConv.conversation) {
        setMessages(fetchedConv.conversation.history)
      }
    } catch (error) {
      console.error("Error fetching conversation:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const newMessage: Message = { role: "user", content: input.trim() }

    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const responseChat = await sendMessage(activeConversation, input, selectedCollections)

      let docFiles = null
      if (responseChat.sources) {
        docFiles = responseChat.sources
          .flatMap((item: { documents: { metadata: { doc_file: string } }[] }) =>
            item.documents.map((doc) => doc.metadata.doc_file),
          )
          .join(", ")
      }
      const messageContent = docFiles ? `${responseChat.content}\nSources: ${docFiles}` : responseChat.content

      if (responseChat) {
        setMessages((prev) => [
          ...prev,
          {
            role: responseChat.role ?? "",
            content: messageContent,
          },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeConversation) {
      showConversation(activeConversation)
    }
  }, [activeConversation])

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      <Card className="flex-1 p-4 mb-4 overflow-hidden">
        <ScrollArea className="h-full pr-4 overflow-y-auto" ref={scrollAreaRef}>
          {messages?.map((message, i) => (
            <div key={i} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-4 rounded-xl rounded-br-none max-w-[80%] text-sm ${
                  message.role === "user" ? "bg-orange-500 text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-xl rounded-br-none bg-muted">En train d'écrire...</div>
            </div>
          )}
        </ScrollArea>
      </Card>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-1"
          disabled={isLoading}
        />
        <MultiSelectDemo onSelectCollections={setSelectedCollections} />
        <Button type="submit" disabled={isLoading} size={"icon"} className="p-2 h-12 w-12">
          <Send className="h-6 w-6" />
        </Button>
      </form>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ChatPage

