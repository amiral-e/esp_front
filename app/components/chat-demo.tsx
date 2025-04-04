"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { SendIcon, Bot } from "lucide-react"

export default function ChatDemo() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant IA financier. Comment puis-je vous aider avec vos documents financiers aujourd'hui ?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [responseIndex, setResponseIndex] = useState(0)

  const demoResponses = [
    "D'après votre facture téléchargée de ABC Corp, le montant total dû est de 1 250,00 € avec paiement prévu pour le 15 avril 2025. Cette dépense est catégorisée comme 'Fournitures de Bureau' dans votre système comptable.",
    "En examinant votre bilan financier du premier trimestre, vos revenus ont augmenté de 12% par rapport au trimestre précédent. Vos principales catégories de dépenses sont les salaires (45%), le marketing (20%) et le loyer des bureaux (15%).",
    "J'ai analysé vos documents fiscaux et trouvé une déduction potentielle que vous avez peut-être manquée. Les 3 500 € dépensés en formations professionnelles peuvent être déclarés comme frais professionnels, vous permettant d'économiser environ 980 € d'impôts.",
  ]

  const handleSend = () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    // Simuler la réponse de l'IA
    setTimeout(() => {
      setIsTyping(false)
      setCurrentResponse("")
      setResponseIndex((responseIndex + 1) % demoResponses.length)

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: demoResponses[responseIndex],
        },
      ])
    }, 2000)
  }

  useEffect(() => {
    if (isTyping) {
      const response = demoResponses[responseIndex]
      let i = 0

      const typingInterval = setInterval(() => {
        if (i < response.length) {
          setCurrentResponse((prev) => prev + response.charAt(i))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 20)

      return () => clearInterval(typingInterval)
    }
  }, [isTyping, responseIndex])

  return (
    <div className="flex flex-col h-[500px] overflow-hidden rounded-md bg-background">
      <div className="flex items-center gap-2 border-b p-3">
        <Bot className="h-5 w-5 text-primary" />
        <span className="font-medium">Assistant ComptaCompanion</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted"}`}>
                {message.role === "user" ? (
                  <span className="text-xs text-primary-foreground">Vous</span>
                ) : (
                  <Bot className="h-4 w-4 text-primary" />
                )}
              </Avatar>
              <div
                className={`rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <Avatar className="h-8 w-8 bg-muted">
                <Bot className="h-4 w-4 text-primary" />
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                {currentResponse}
                <span className="animate-pulse">▋</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Posez une question sur vos documents financiers..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Envoyer message</span>
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Essayez de demander : "Que contient cette facture ?" ou "Résumez mes finances du T1"
        </div>
      </div>
    </div>
  )
}