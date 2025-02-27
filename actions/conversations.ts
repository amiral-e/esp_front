"use server";

import { createClient } from "@/utils/supabase/server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token interceptor
api.interceptors.request.use(async (config) => {
  const auth_token = await getAuthToken();
  if (!auth_token) {
    throw new Error("Tokens are missing");
  }
  config.headers.Authorization = `Bearer ${auth_token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});

export interface Message {
  role: string;
  content: string;
}

export interface Conversation {
  id: string;
  name: string;
  history: Message[];
  createdAt: string;
}

export interface Message {
  role: string;
  content: string;
}
export interface Conversation {
  id: string;
  name: string;
  history: Message[];
  user_id: string;
  created_at: string;
}

export const fetchConversations = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getConversationById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id);
  return data;
};

export const getConversationByUser = async (
  userId: string
): Promise<Conversation[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
  return data || [];
};

export const createConversation = async (title: string, userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("conversations").insert({
    user_id: userId,
    name: title,
    history: [],
  });

  if (error) {
    throw error;
  }
  return data;
};

export const updateConversation = async (id: string, name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .update({ name: name })
    .eq("id", id);
  return data;
};

export const deleteConversation = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id);
  return data;
};

export const sendMessage = async (
  convId: string,
  message: string,
  collection?: string
) => {
  try {
    if (collection !== "") {
      const { data } = await api.post<any>(`conversations/${convId}`, {
        message: message,
        collection: collection,
      });
      return {
        role: data.role,
        content: data.content,
        sources: data.sources,
      };
    } else {
      const { data } = await api.post<Message>(`conversations/${convId}`, {
        message: message,
      });
      return { role: data.role, content: data.content };
    }
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const sendMessageWithCollection = async (
  convId: string,
  message: string,
  collections: string[]
) => {
  try {
    const { data } = await api.post(`conversations/${convId}/collections`, {
      message: message,
      collections: collections,
    });
    return data;
  } catch (err: any) {
    console.error("Error sending message with collections:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};
