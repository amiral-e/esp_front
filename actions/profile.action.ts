"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export interface Profile {
  id: string;
  credits: number;
  level: string;
  created_at: string;
}

export interface ProfileUsage {
  month: string;
  total_docs: number;
  total_messages: number;
  total_reports: number;
  used_credits: number;
}

// Obtenir le profil utilisateur
export const getProfile = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Mettre à jour le niveau du profil
export const updateProfileLevel = async (level: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.put(
    `${API_URL}/profile/level`,
    { level },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Obtenir les statistiques d'utilisation
export const getProfileUsage = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/profile/usage`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
