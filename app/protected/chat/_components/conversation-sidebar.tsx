"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import { PlusIcon, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NavUser } from "@/components/nav-user"
import Modal from "./modal"
import ConversationButton from "./conversation-button"
import { usePathname, useRouter } from "next/navigation"
import PageSwitcher from "@/components/page-switcher"
import { Conversation } from "@/actions/conversations"

interface ConversationSidebarProps {
  conversations: Conversation[]
}

export default function ConversationSidebar({ conversations }: ConversationSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleSelectConversation = (id: number) => {
    router.push(`/protected/chat/${id}`)
  }

  return (
    <SidebarProvider defaultOpen className="w-auto">
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 space-y-4">
          <PageSwitcher />
          <Modal userId={conversations[0]?.user_id || ""}>
            <Button className="w-full gap-2">
              <PlusIcon className="h-4 w-4" />
              Nouvelle conversation
            </Button>
          </Modal>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {search ? "Aucun résultat" : "Aucune conversation"}
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const isActive = pathname === `/conversation/${conversation.id}`
                  return (
                    <ConversationButton
                      key={conversation.id}
                      title={conversation.name}
                      isActive={isActive}
                      created_at={conversation.created_at}
                      onSelect={() => handleSelectConversation(conversation.id)}
                    />
                  )
                })
              )}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <NavUser
            user={{
              name: "Utilisateur",
              email: "user@example.com",
              avatar: "",
            }}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}