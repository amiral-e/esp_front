import { getConversationById } from "@/actions/conversations"
import type { Metadata } from "next"
import ChatArea from "./_components/chat-area"
import { ChatProvider } from "./_components/chat-context"
import ChatForm from "./_components/chat-form"
import React from "react"
import PredefinedQuestions from "./_components/predifined-questions"

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const { id } = await params
  console.log("ID:", id)
  const conversation = await getConversationById(id)

  return {
    title: conversation?.name || "Conversation",
  }
}

const ChatPage = async ({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) => {
  const { id } = await params

  if (isNaN(id)) {
    return null
  }

  try {
    const conversation = await getConversationById(id)

    if (!conversation) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Conversation introuvable</h1>
            <p className="text-muted-foreground">Cette conversation n'existe pas ou a été supprimée.</p>
          </div>
        </div>
      )
    }

    return (
      <ChatProvider>
        <div className="flex flex-col w-full h-screen">
          <div className="flex flex-col h-full p-4">
            <ChatArea conversation={conversation} />
            <ChatForm />
            <PredefinedQuestions />
          </div>
        </div>
      </ChatProvider>
    )
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Erreur</h1>
          <p className="text-muted-foreground">Une erreur est survenue lors du chargement de la conversation.</p>
        </div>
      </div>
    )
  }
}

export default ChatPage