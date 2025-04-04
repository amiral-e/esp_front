"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Créer une nouvelle collection
export const createCollection = async (name: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/collections`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Ajouter un document à une collection
export const addDocumentToCollection = async (
  collectionName: string,
  document: File
) => {
  const auth_token = await getAuthToken();
  const formData = new FormData();
  formData.append("document", document);

  const response = await axios.post(
    `${API_URL}/collections/${collectionName}/documents`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return response.data;
};

// Récupérer toutes les collections
export const getCollections = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/collections`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Récupérer une collection par son nom
export const getCollectionByName = async (collectionName: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.get(
    `${API_URL}/collections/${collectionName}/documents`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Supprimer une collection
export const deleteCollection = async (collectionName: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.delete(
    `${API_URL}/collections/${collectionName}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Supprimer un document d'une collection
export const deleteDocumentFromCollection = async (
  collectionName: string,
  documentId: string
) => {
  const auth_token = await getAuthToken();
  const response = await axios.delete(
    `${API_URL}/collections/${collectionName}/documents/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
