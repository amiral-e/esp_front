"use client";

import { ConversationInput } from "./_components/conversation-input";
import { Suggestions } from "./_components/suggestions";

const ConversationPage = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">
        Votre assistant comptable intelligent
      </h1>
      <ConversationInput />
      <p className="text-muted-foreground text-xs mb-8">
        Posez votre question ci-dessous ou sélectionnez une suggestion pour
        démarrer une nouvelle conversation.
      </p>
      <Suggestions />
    </div>
  );
};

export default ConversationPage;
