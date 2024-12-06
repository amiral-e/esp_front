"use client";
import { useEffect, useState } from "react";
import { Conversation, fetchConversations, fetchConversationsByConvId, deleteConversation } from "./conversation_action";

export default function ConversationHistory() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listeConvs = await fetchConversations();
        if (listeConvs.error) {
          setError(listeConvs.error);
        }
        if (listeConvs.conversation) {
          setConversation(listeConvs.conversation);
        } else {
          setError("No conversations found");
        }
      } catch (err) {
        setError("Failed to fetch conversationsss");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Chargement des conversations...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (!conversation) return <p>Aucune conversation trouvée.</p>;

  const showConversation = async (convId: string) => {
    try {
      const fetchedConv = await fetchConversationsByConvId(convId);
      if (fetchedConv.error) {
        console.error(fetchedConv.error);
      }
      if (fetchedConv.conversation) {
        setCurrentConversation(fetchedConv.conversation);
      }
    } catch (error) {
    }
  };

  const deleteConv = async (convId: string) => {
    try {
      const fetchedConv = await deleteConversation(convId);
      if (fetchedConv.error) {
        console.error(fetchedConv.error);
      }
      if (fetchedConv.conversation) {
        console.log(fetchedConv.conversation);
        setCurrentConversation(null);
      }
    } catch (error) {
    }
  };

  return (
    <div>
      <h1>Historique des conversations</h1>
      <ConversationItem conversation={conversation} showConversation={showConversation} currentConversation={currentConversation} deleteConv={deleteConv} />
    </div>
  );
}

function ConversationItem({ conversation, showConversation, currentConversation, deleteConv }: Readonly<{ conversation: any, showConversation: (convId: string) => void, currentConversation: Conversation | null, deleteConv: (convId: string) => void }>) {
  return (
    <div className="chat-container">
      <div className="conversations-list">
        <ul>
          {conversation.convs.map((conv: Conversation) => (
            <li key={conv.id} className="flex items-center justify-between">
              <button onClick={() => showConversation(conv.id)} className="conv-button">
                {conv.name}
              </button>

              <button onClick={() => deleteConv(conv.id)} className="delete-button">
                <i className="fas fa-trash-alt text-red-500">delete</i>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <div className="messages">
          {currentConversation && (
            <div>
              <h3>{currentConversation.name}</h3>
              <ul>
                {currentConversation.conv.map((message, index) => (
                  <li key={index} className="message">
                    <strong>{message.sender}</strong>: {message.message}
                    <br />
                    <small>{new Date(message.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
