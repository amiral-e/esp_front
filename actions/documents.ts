"use server";

import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

// === INTERFACES ===
export interface Doc {
  documents: Document[];
}

export interface Document {
  doc_id: string;
  doc_file: string;
}

export interface Response {
  message: string;
}

// === CONSTANTES ===
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

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
    console.error("Erreur Axios :", error);
    if (error.response) {
      console.error("Détails de l'erreur :", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error || error.message || "Erreur lors de la requête"
    );
  }
};

// === FONCTIONS ===

export const getDocumentsByCollectionName = async (
  collection_name: string
): Promise<Document[]> => {
  const data = await authRequest<Doc>({
    method: "GET",
    url: `collections/${collection_name}/documents`,
  });
  return data.documents || [];
};

export const getDocumentsByCollectionGlobal = async (
  collection_name: string
): Promise<Document[]> => {
  const data = await authRequest<Doc>({
    method: "GET",
    url: `admins/collections/${collection_name}/documents`,
  });
  return data.documents || [];
};

export const deleteDocumentByDocId = async (
  collection_name: string,
  doc_id: string
): Promise<string> => {
  const data = await authRequest<Response>({
    method: "DELETE",
    url: `collections/${collection_name}/documents/${doc_id}`,
  });
  return data.message;
};

export const deleteDocumentGlobalByDocId = async (
  collection_name: string,
  doc_id: string
): Promise<string> => {
  const data = await authRequest<Response>({
    method: "DELETE",
    url: `admins/collections/${collection_name}/documents/${doc_id}`,
  });
  return data.message;
};
