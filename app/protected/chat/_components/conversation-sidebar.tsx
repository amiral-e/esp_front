import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { PlusIcon } from "lucide-react";
import { getUserInfo } from "@/app/actions";
import { createConversation } from "@/actions/conversations";
import Modal from "./modal";
import { CellAction } from "@/components/cell-action";
import PageSwitcher from "@/components/page-switcher";

interface Conversation {
  id: number;
  created_at: string;
  history: any[];
  user_id: string;
  name: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
}

const ConversationSidebar = async ({
  conversations,
}: ConversationSidebarProps) => {
  const user = await getUserInfo();

  return (
    <SidebarProvider defaultOpen className="w-auto">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <PageSwitcher />
          <Modal userId={user?.id || ""}>
            <Button className="w-full gap-2">
              <PlusIcon className="h-4 w-4" />
              Nouvelle conversation
            </Button>
          </Modal>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-2">
              {conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center justify-between border-md hover:bg-muted p-2"
                >
                  <Link
                    className="w-full "
                    href={`/protected/chat/${conversation.id}`}
                    passHref
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{conversation.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </Link>
                  <CellAction
                    data={{
                      id: conversation.id,
                      name: conversation.name,
                    }}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter>
          <NavUser
            user={{
              name: "Utilisateur",
              email: user?.email ?? "",
              avatar: "",
            }}
          />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default ConversationSidebar;
