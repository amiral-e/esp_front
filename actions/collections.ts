"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { cookies } from "next/headers";
import { isAdministrator } from "./admin";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

// Function to get the auth token from cookies
const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};


// List of all the collections
export const getCollections = async () => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.get<Collections>(
      `${API_URL}collections`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data.collections || [];
  } catch (error: any) {
    if(error.response.status === 404) {
      return [];
    }
    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération des collections"
    );
  }
}

// To delete a collection
export const deleteCollection = async (collection_name: string) => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.delete<Response>(
      `${API_URL}collections/${collection_name}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data.message || "Collection supprimée avec succès";
  } catch (error: any) {
    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la suppression de la collection"
    );
  }
}

// Function to get the global collection, admin privileges required
export const getGlobalCollection = async () => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.get<Collections>(
      `${API_URL}admins/collections`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data.collections || [];
  } catch (error: any) {
    if(error.response.status === 404) {
      return [];
    }
    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la récupération des documents"
    );
  }
}

// Function to delete a global collection, admin privileges required
export const deleteGlobalCollection = async (collection_name: string) => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.delete<Response>(
      `${API_URL}admins/collections/${collection_name}`,
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data.message || "Collection supprimée avec succès";
  } catch (error: any) {
    console.error("Erreur pendant la suppression de la collection:", error);
    if (error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
      });
    }
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Erreur lors de la suppression de la collection"
    );
  }
}

// Function to create a collection, auth token required
export const createCollection = async (collection_name: string, files: File | File[]) => {
	try {
		const isAdmin = await isAdministrator();
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}
		const url_api = isAdmin
			? `${API_URL}admins/collections/${collection_name}/documents`
			: `${API_URL}collections/${collection_name}/documents`;
		const formData = new FormData();
		if (Array.isArray(files)) {
			files.forEach((file) => formData.append("files", file));
		} else {
			formData.append("files", files);
		}

		const data = await axios.request<Response>({
			method: 'POST',
			url: url_api,
			headers: {
				'content-Type': 'multipart/form-data',
				Authorization: `Bearer ${auth_token}`,
			},
			data: formData,
		});
		return data.data.message || "Collection créée avec succès";
	} catch (err: any) {
		console.error('Erreur lors de la création de la collection:', err);
		return err.message || "An unexpected error occurred";
	}
}