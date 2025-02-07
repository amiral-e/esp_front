"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";

export interface Message {
  role: string;
  content: string;
}

export interface Conversation {
  id: string;
  name: string;
  conversations: Message[];
  createAt: string;
}

export interface Conversations {
  id: string;
  name: string;
  history: Message[];
  createAt: string;
}

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export const fetchConversations = async () => {
  try {
    const auth_token = await getAuthToken();
    if (!auth_token) {
      throw new Error("Tokens are missing");
    }
    const { data } = await axios.get<Conversation>(
      API_URL.concat("conversations"),
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    console.log("data", data);
    return { conversation: data };
  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return { error: err };
  }
};

export const fetchConversationsByConvId = async (conv_id: string) => {
  try {
    const auth_token = await getAuthToken();
    if (!auth_token) {
      throw new Error("Tokens are missing");
    }
    const { data } = await axios.get<Conversations>(
      API_URL.concat(`conversations/${conv_id}`),
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return { conversation: data };
  } catch (err: any) {
    console.error("Error fetching conversations:", err);
    return { error: err };
  }
};

export const deleteConversation = async (convId: string) => {
  try {
    const auth_token = await getAuthToken();
    if (!auth_token) {
      throw new Error("Tokens are missing");
    }
    const { data } = await axios.request<{ message: string }>({
      method: "DELETE",
      url: API_URL.concat("conversations/").concat(convId),
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      data: {
        conv_id: String(convId),
      },
    });
    return { message: data.message };
  } catch (err: any) {
    console.error("Error deleting conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const createConversation = async (title: string) => {
  try {
    const auth_token = await getAuthToken();
    if (!auth_token) {
      throw new Error("Tokens are missing");
    }
    const { data } = await axios.request<{ message: string }>({
      method: "POST",
      url: API_URL.concat("conversations/").concat(title),
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      data: {
        message: String(title),
      },
    });
    return { message: data.message };
  } catch (err: any) {
    console.error("Error deleting conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const updateConversation = async (convId: string, title: string) => {
  try {
    const auth_token = await getAuthToken();
    const data = await axios.request<Conversations>({
      method: "PUT",
      url: API_URL.concat("conversations/").concat(convId),
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      data: {
        name: String(title),
      },
    });
    return { conversation: data.data };
  } catch (err: any) {
    console.error("Error updating conversation:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};

export const sendMessage = async (
  convId: string,
  message: string,
  collection: string
) => {
  try {
    const auth_token = await getAuthToken();
    if (collection != "") {
      const data = await axios.request<any>({
        method: "POST",
        url: API_URL.concat("chat/conversations/")
          .concat(convId)
          .concat("/collections/")
          .concat(collection),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        data: {
          message: String(message),
        },
      });
      return {
        role: data.data.role,
        content: data.data.content,
        sources: data.data.sources,
      };
    } else {
      const data = await axios.request<Message>({
        method: "POST",
        url: API_URL.concat("chat/conversations/").concat(convId),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        data: {
          message: String(message),
        },
      });
      return { role: data.data.role, content: data.data.content };
    }
  } catch (err: any) {
    console.error("Error sending message:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
};
