"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface ChatContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  return <ChatContext.Provider value={{ isLoading, setIsLoading }}>{children}</ChatContext.Provider>
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}