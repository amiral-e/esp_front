import type React from "react"
import { ToastContainer } from "react-toastify"
import ConversationSidebar from "./_components/conversation-sidebar"
import { getConversationByUser } from "@/actions/conversations"
import "react-toastify/dist/ReactToastify.css"

const ChatLayout = async ({ children }: { children: React.ReactNode }) => {
  const conversations = await getConversationByUser()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ConversationSidebar conversations={conversations || []} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 h-full overflow-hidden">{children}</div>
    </div>
  )
}

export default ChatLayout