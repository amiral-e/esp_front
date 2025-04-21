"use client"

import { useEffect, useRef } from "react"
import { useChatContext } from "./chat-context"
import type { Conv } from "@/actions/conversations"
import UserChat from "../../_components/user-chat"
import MessageBubble from "./message-bubble"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface Message {
  role: string
  content: string
  sources?: {
    collection: string
    documents: string[]
  }[]
}

interface ChatAreaProps {
  conversation: Conv
}

const ChatArea = ({ conversation }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isLoading } = useChatContext()

  let messages: Message[] = []
  if (conversation.history && conversation.history.length !== 0) {
    messages = conversation.history
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom()
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full px-4">
        <div className="w-full max-w-6xl mx-auto py-6 px-6 space-y-6">
          {/* Conversation title */}
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4 text-muted-foreground">{conversation.name}</h1>
          </div>

          {/* Messages */}
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "user" ? (
                <UserChat message={message.content} userAvatar="https://github.com/shadcn.png" />
              ) : (
                <MessageBubble message={message} />
              )}
            </div>
          ))}

          {/* Skeleton loading bubble */}
          {isLoading && (
            <div className="flex items-start space-x-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[400px]" />
                <Skeleton className="h-4 w-[300px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  )
}

export default ChatArea