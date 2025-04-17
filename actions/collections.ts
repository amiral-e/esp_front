"use server";

import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { isAdministrator } from "./admin";

// === INTERFACES ===
export interface Collections {
  collections: Collection[];
}

export interface Collection {
  collection: string;
  user: string;
  name: string;
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

const authRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const token = await getAuthToken();
  if (!token) throw new Error("Jeton d'authentification manquant");

  try {
    const response = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(config.headers || {}),
      },
    });
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

// === COLLECTIONS UTILISATEUR ===
export const getCollections = async () => {
  try {
    const data = await authRequest<Collections>({
      method: "GET",
      url: `${API_URL}collections`,
    });

    // Check if collections exist in the response
    if (data && data.collections) {
      return data.collections;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};

export const deleteCollection = async (collection_name: string) => {
  const data = await authRequest<Response>({
    method: "DELETE",
    url: `${API_URL}collections/${collection_name}`,
  });
  return data.message || "Collection supprimée avec succès";
};

// === COLLECTIONS ADMIN ===
export const getGlobalCollection = async () => {
  const data = await authRequest<Collections>({
    method: "GET",
    url: `${API_URL}admins/collections`,
  });
  return data.collections || [];
};

export const deleteGlobalCollection = async (collection_name: string) => {
  const data = await authRequest<Response>({
    method: "DELETE",
    url: `${API_URL}admins/collections/${collection_name}`,
  });
  return data.message || "Collection supprimée avec succès";
};

// === CRÉATION COLLECTION (UPLOAD DE FICHIERS) ===
export const createCollection = async (
  collection_name: string,
  files: File | File[]
): Promise<string> => {
  try {
    const isAdmin = await isAdministrator();
    const token = await getAuthToken();
    if (!token) throw new Error("Jeton d'authentification manquant");

    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append("files", file));
    } else {
      formData.append("files", files);
    }

    const endpoint = isAdmin
      ? `admins/collections/${collection_name}/documents`
      : `collections/${collection_name}/documents`;

    const response = await axios.post<Response>(
      `${API_URL}${endpoint}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.message || "Collection créée avec succès";
  } catch (error: any) {
    console.error("Erreur lors de la création de la collection:", error);
    return (
      error.response?.data?.error ||
      error.message ||
      "Échec de la création de la collection"
    );
  }
};