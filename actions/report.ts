"use server";

import axios, { AxiosRequestConfig } from "axios";
import { error } from "console";
import { cookies } from "next/headers";

// === CONFIG ===
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

// === TYPES ===
export interface Report {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  text: string;
}

export interface Response {
  title: string;
  text: string;
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
  try{
    const response = await api.request<T>(config);
    return response.data;
  }
  catch (error: any) {
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

export const getReports = async (): Promise<Report[]> => {
    const data =  await authRequest<Report[]>({
      method: "GET",
      url: "reports",
    });
    return data || [];
};

export const getReportById = async (id: number): Promise<Response | null> => {
  try {
    return await authRequest<Response>({
      method: "GET",
      url: `reports/${id}`,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du rapport :", error);
    return null;
  }
};

export const createReport = async (
  title: string,
  docs: string[],
  prompt: string,
  collection_name: string
): Promise<string> => {
  try {
    const data = await authRequest<Response>({
      method: "POST",
      url: "reports",
      data: {
        title,
        documents: docs,
        prompt,
        collection_name,
      },
    });

    return `Le rapport "${data.title}" a été créé avec succès`;
  } catch (error) {
    console.error("Erreur lors de la création du rapport :", error);
    return "Erreur lors de la création du rapport";
  }
};

export const deleteReport = async (id: number): Promise<Message> => {
  try {
    return await authRequest<Message>({
      method: "DELETE",
      url: `reports/${id}`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du rapport :", error);
    return { message: "Erreur lors de la suppression du rapport" };
  }
};
