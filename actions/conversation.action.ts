"use server";

import { apiClient } from "@/lib/api";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export interface Message {
  role: string;
  content: string;
  sources?: any[];
}

export interface Conversation {
  id: string;
  name: string;
  history: Message[];
  user_id: string;
  created_at: string;
}

// Créer une nouvelle conversation
export const createConversation = async (name: string) => {
  const auth_token = await getAuthToken();
  const response = await apiClient.post("/conversations", { name });
  return response.data;
};

// Envoyer un message dans une conversation
export const sendMessage = async (conversationId: string, message: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Envoyer un message avec des collections
export const sendMessageWithCollections = async (
  conversationId: string,
  message: string,
  collections: string[]
) => {
  const auth_token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/conversations/${conversationId}/collections`,
    { message, collections },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Récupérer toutes les conversations
export const getConversations = async () => {
  const auth_token = await getAuthToken();
  try {
    const response = await axios.get(`${API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

// Récupérer une conversation par son ID
export const getConversationById = async (id: string) => {
  try {
    // Vérifier que l'ID est valide
    if (!id) {
      throw new Error("ID de conversation manquant");
    }

    // Essayer d'abord avec l'endpoint /conversations/{id}
    try {
      const response = await apiClient.get(`/conversations/${id}`);
      return [response.data]; // Retourner sous forme de tableau pour compatibilité
    } catch (error: any) {
      // Si 404, essayer un autre format d'endpoint
      if (error.response && error.response.status === 404) {
        // Essayer avec /conversation/{id}
        const altResponse = await apiClient.get(`/conversation/${id}`);
        return [altResponse.data];
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

// Supprimer une conversation
export const deleteConversation = async (conversationId: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.delete(
    `${API_URL}/conversations/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
