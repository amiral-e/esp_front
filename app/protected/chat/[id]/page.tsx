import ChatForm from "./_components/chat-form"
import ChatArea from "./_components/chat-area"
import { getConversationById } from "@/actions/conversations"
import { ChatProvider } from "./_components/chat-context"

const ChatPage = async ({ params }: any) => {
  const { id } = await params
  const conversations = await getConversationById(id)

  if (!conversations) {
    return <div>Conversation non trouvée</div>
  }

  return (
    <ChatProvider>
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-col h-screen m-4 gap-4">
          <ChatArea conversation={conversations || []} />
          <ChatForm />
        </div>
      </div>
    </ChatProvider>
  )
}

export default ChatPage