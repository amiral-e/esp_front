import {
  fetchConversations,
  getConversationByUser,
} from "@/actions/conversations";
import ChatContainer from "./_components/chat-container";
import ConversationSidebar from "./_components/conversation-sidebar";
import { fetchConversationsByConvId } from "./conversation-action";
import { getUserInfo } from "@/app/actions";

interface ConversationPageProps {
  activeConversation: string | null;
}

const ConversationPage = async ({
  activeConversation,
}: ConversationPageProps) => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <h1 className="text-2xl font-bold">Commencer une conversation !</h1>
    </div>
    // <div className="flex h-screen">
    //   <ChatContainer activeConversation={activeConversation} />
    // </div>
  );
};

export default ConversationPage;
