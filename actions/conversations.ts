"use server";

import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

// === API SETUP ===
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const api = axios.create({ baseURL: API_URL });

// Interceptor d'authentification
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (!token) throw new Error("Tokens are missing");
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  return config;
});

// Appel générique
const authRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.request<T>(config);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [] as T;
    }
    if (error.response) {
      console.error("Details:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Request error"
    );
  }
};

// === TYPES ===
export interface Message {
  role: string;
  content: string;
}

export interface Conversations {
  conversations: Conversation[];
}

export interface Conversation {
  id: number;
  name: string;
  created_at: string;
  history: Message[];
  user_id: string;
}

export interface Conv {
  name: string;
  history: [];
  id: number;
}

export interface Question {
  questions: string[];
}

// === FONCTIONS ===

export const getConversationById = async (conv_id: number) => {
  try {
    return await authRequest<Conv>({
      method: "GET",
      url: `conversations/${conv_id}`,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Erreur lors de la récupération de la conversation :", error);
    throw error;
  }
};

export const getConversationByUser = async (): Promise<Conversation[]> => {
  try {
    const data = await authRequest<Conversations>({
      method: "GET",
      url: "conversations",
    });
    return data.conversations || [];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error("Erreur lors de la récupération des conversations :", error);
    throw error;
  }
};

export const createConversation = async (title: string) => {
  return await authRequest<Conversations>({
    method: "POST",
    url: "conversations",
    data: { name: title },
  });
};

export const updateConversation = async (id: number, name: string) => {
  return await authRequest<Conversations>({
    method: "PUT",
    url: `conversations/${id}`,
    data: { name },
  });
};

export const deleteConversation = async (id: string) => {
  return await authRequest<Conversations>({
    method: "DELETE",
    url: `conversations/${id}`,
  });
};

export const sendMessage = async (
  convId: number,
  message: string,
  collection?: string
) => {
  try {
    const url = collection !== ""
      ? `conversations/${convId}`
      : `conversations/${convId}`;

    const data = collection !== ""
      ? { message, collection }
      : { message };

    const response = await authRequest<any>({
      method: "POST",
      url,
      data,
    });

    return {
      role: response.role,
      content: response.content,
      sources: response.sources,
    };
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const sendMessageWithCollection = async (
  convId: number,
  message: string,
  collections: string[]
) => {
  try {
    const url = collections.length > 0
      ? `conversations/${convId}/collections`
      : `conversations/${convId}`;

    const data = collections.length > 0
      ? { message, collections }
      : { message };

    const response = await authRequest<any>({
      method: "POST",
      url,
      data,
    });

    return {
      role: response.role,
      content: response.content,
      sources: response.sources,
    };
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};
