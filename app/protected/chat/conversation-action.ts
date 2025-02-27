"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = "http://localhost:3000";

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

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export const fetchConversations = async () => {
  try {
    const { data } = await api.get<Conversation>("conversations");
    console.log(data);
    return data;
  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return { error: err };
  }
};

export const fetchConversationsByConvId = async (conv_id: string) => {
  try {
    const auth_token = await getAuthToken();
    const { data } = await axios.get(`${API_URL}/conversations/${conv_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    });
    console.log(data);
    return { conversation: data };
  } catch (err: any) {
    console.error("Error fetching conversations by id:", err);
    return { error: err };
  }
};

export const deleteConversation = async (convId: string) => {
  try {
    const { data } = await api.delete<{ message: string }>(
      `conversations/${convId}`,
      {
        data: { conv_id: String(convId) },
      }
    );
    return { message: data.message };
  } catch (err: any) {
    console.error("Error deleting conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const createConversation = async (title: string) => {
  try {
    const { data } = await api.post<{ message: string }>(
      `conversations/${title}`,
      {
        message: String(title),
      }
    );
    return { message: data.message };
  } catch (err: any) {
    console.error("Error creating conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const updateConversation = async (convId: string, title: string) => {
  try {
    const { data } = await api.put<Conversation>(`conversations/${convId}`, {
      name: String(title),
    });
    return { conversation: data };
  } catch (err: any) {
    console.error("Error updating conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const sendMessage = async (convId: string, message: string) => {
  try {
    //   const { data } = await api.post<any>(`conversations/${convId}`, {
    //     message: message,
    //   });
    //   return {
    //     role: data.role,
    //     content: data.content,
    //     sources: data.sources,
    //   };
    // } else {
    const { data } = await api.post<Message>(`conversations/${convId}`, {
      message: message,
    });
    return { role: data.role, content: data.content };
    // }
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};
