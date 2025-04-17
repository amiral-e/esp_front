"use server";

import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

// === INTERFACES ===
export interface Users {
  users: User[];
}

export interface User {
  email: string;
  uid: string;
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
    throw new Error(
      error.response?.data?.error || error.message || "Erreur lors de la requête"
    );
  }
};

// === QUESTIONS ===

export const getPredifinedQuestions = async () => {
  try {
    const data = await authRequest<{ questions: string[] }>({
      method: "GET",
      url: "questions",
    });
    return data.questions || [];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("Aucune question trouvée.");
      return [];
    }
    throw error;
  }
};

export const createPredifinedQuestion = async (question: string, level: string) => {
  const data = await authRequest<{ message: string }>({
    method: "POST",
    url: "admins/questions",
    data: { question, level },
  });
  return data.message;
};

export const deletePredifinedQuestion = async (questionId: number) => {
  const data = await authRequest<{ message: string }>({
    method: "DELETE",
    url: `admins/questions/${questionId}`,
  });
  return data.message;
};

export const modifyPredifinedQuestions = async (
  question: string,
  level: string,
  questionId: number
) => {
  return await authRequest<any>({
    method: "PUT",
    url: `admins/questions/${questionId}`,
    data: { question, level },
  });
};