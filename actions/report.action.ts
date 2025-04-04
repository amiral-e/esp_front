"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export interface Report {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

// Créer un nouveau rapport
export const createReport = async (name: string, content: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/reports`,
    { name, content },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Récupérer tous les rapports
export const getReports = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/reports`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Récupérer un rapport par ID
export const getReportById = async (reportId: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Supprimer un rapport
export const deleteReport = async (reportId: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.delete(`${API_URL}/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
