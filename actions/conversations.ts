"use server";

import axios from "axios";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
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

export const getConversationById = async (conv_id: number) => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.get<Conv>(
      `${NEXT_PUBLIC_API_URL}conversations/${conv_id}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    console.error("Erreur lors de la récupération de la conversation :", error);
    throw error;
  }
};

export const getConversationByUser = async (): Promise<Conversation[]> => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.get<Conversations>(
      `${NEXT_PUBLIC_API_URL}conversations`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
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
  const auth_token = await getAuthToken();
  const { data } = await axios.post<Conversations>(
    `${NEXT_PUBLIC_API_URL}conversations`,
    {
      name: title
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data;
};

export const updateConversation = async (id: number, name: string) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.put<Conversations>(
    `${NEXT_PUBLIC_API_URL}conversations/${id}`,
    {
      name: name
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data;
};

export const deleteConversation = async (id: string) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.delete<Conversations>(
    `${NEXT_PUBLIC_API_URL}conversations/${id}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data;
};

export const sendMessage = async (
  convId: number,
  message: string,
  collection?: string
) => {
  try {
    if (collection !== "") {
      const auth_token = await getAuthToken();
      const { data } = await axios.post<any>(
        `${NEXT_PUBLIC_API_URL}conversations/${convId}`,
        {
          message: message,
          collection: collection,
        },
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
          },
        }
      );
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
  convId: number,
  message: string,
  collections: string[]
) => {
  try {
    if (collections.length > 0) {
      const auth_token = await getAuthToken();
      const { data } = await axios.post<any>(
        `${NEXT_PUBLIC_API_URL}conversations/${convId}/collections`,
        {
          message: message,
          collections: collections,
        },
        {
          headers: {
            Authorization: `Bearer ${auth_token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
