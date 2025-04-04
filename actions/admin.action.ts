"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Récupérer les statistiques globales
export const getGlobalStats = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/admin/stats`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Récupérer la liste des utilisateurs
export const getUsers = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Mettre à jour les crédits d'un utilisateur
export const updateUserCredits = async (userId: string, credits: number) => {
  const auth_token = await getAuthToken();
  const response = await axios.put(
    `${API_URL}/admin/users/${userId}/credits`,
    { credits },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
