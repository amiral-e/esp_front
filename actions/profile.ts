"use server";

import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { getConversationByUser } from "./conversations";

// === CONSTANTES ===
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

// === TYPES ===
export interface Knowledges {
  levels: string[];
}

export interface KnowledgeLevel {
  id: number;
  name: string;
}

export interface Profile {
  id: string;
  credits: number;
  level: string;
  created_at: string | Date;
}

export interface User {
  profile: Profile;
}

export interface UsageData {
  usage: ProfileUsage[];
}

export interface ProfileUsage {
  month: string;
  total_docs: number;
  total_messages: number;
  total_reports: number;
  used_credits: number;
  total_conversations: number;
}

export interface Message {
  message: string;
}

// === UTILS ===
const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (!token) throw new Error("Jeton d'authentification manquant");
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  return config;
});

const authRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.request<T>(config);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [] as T;
    }
    if (error.response) {
      console.error("Détails:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Erreur de requête"
    );
  }
};

// === SERVICES ===

export const getKnowledges = async (): Promise<KnowledgeLevel[]> => {
  try {
    const data = await authRequest<Knowledges>({
      method: "GET",
      url: "config/levels",
    });

    return data.levels.map((level, index) => ({
      id: index + 1,
      name: level,
    }));
  } catch (error) {
    return [];
  }
};

export const getProfile = async (): Promise<User | null> => {
  try {
    return await authRequest<User>({
      method: "GET",
      url: "profile",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return null;
  }
};

export const updateProfile = async (level: string): Promise<Message> => {
  try {
    return await authRequest<Message>({
      method: "PUT",
      url: "profile/level",
      data: { level },
    });
  } catch (error) {
    return { message: "Une erreur est survenue lors de la mise à jour du profil." };
  }
};

export const getProfileUsageData = async (): Promise<UsageData | null> => {
  try {
    const usageData = await authRequest<{ usage: ProfileUsage[] }>({
      method: "GET",
      url: "profile/usage",
    });

    const conversations = await getConversationByUser();

    const conversationsByMonth = conversations.reduce((acc: Record<string, number>, conv) => {
      const month = new Date(conv.created_at).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const usageWithConversations = usageData.usage.map((usage) => ({
      ...usage,
      total_conversations: conversationsByMonth[usage.month.slice(0, 7)] || 0,
    }));

    return { usage: usageWithConversations };
  } catch (error) {
    console.error("Erreur lors de la récupération des données d'usage :", error);
    return null;
  }
};