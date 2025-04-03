"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Obtenir les niveaux de connaissance disponibles
export const getKnowledgeLevels = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/config/levels`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
