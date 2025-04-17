"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import axios, { AxiosRequestConfig } from "axios";
import { isAdministrator } from "./admin";

// === INTERFACES ===
export interface Prices {
  prices: Price[];
}

export interface Price {
  price: string;
  description: string;
  value: number;
}

// === CONSTANTES ===
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const defaultPrices: Prices = {
  prices: [
    {
      price: "search",
      description: "defined price of 0.05$ / retrieve search",
      value: 2.05,
    },
    {
      price: "groq_input",
      description: "original price of 0.59$ / 1M tokens; new price for 10k chars",
      value: 0.9,
    },
    {
      price: "groq_output",
      description: "original price of 0.79$ / 1M tokens; new price for 10k chars",
      value: 1.1,
    },
    {
      price: "openai_embedding",
      description: "original price of 0.1$ / 1M tokens; new price for 10k chars",
      value: 0.3,
    },
  ],
};

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

// === PRIX DE PLATEFORME ===
export const getPlatformPrices = async (): Promise<Price[]> => {
  const isAdmin = await isAdministrator();
  if (!isAdmin) return defaultPrices.prices;

  const data = await authRequest<Prices>({
    method: "GET",
    url: "admins/config",
  });

  return data.prices || defaultPrices.prices;
};

export const updatePlatformPrice = async (
  price_name: string,
  price: number
): Promise<string> => {
  const data = await authRequest<{ message: string }>({
    method: "PUT",
    url: `admins/config/${price_name}`,
    data: { value: price },
  });
  return data.message;
};

// === CRÉDITS UTILISATEUR ===
export const updateMontantForUser = async (
  userId: string,
  amountToAdd: number
): Promise<any> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("increment_credits", {
      new_credits: amountToAdd,
      user_id: userId,
    });

    if (error) {
      console.error("Erreur lors de l'incrémentation des crédits :", error);
      throw new Error(error.message || "Erreur Supabase");
    }

    console.log(`✅ Crédits +${amountToAdd} pour ${userId}`);
    return data;
  } catch (error: any) {
    console.error("Erreur Supabase (try-catch) :", error);
    throw new Error("Erreur lors de la mise à jour des crédits");
  }
};
