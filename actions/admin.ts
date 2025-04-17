"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Response } from "./collections";

// === INTERFACES ===
export interface Users {
  users: User[];
}

export interface Admins {
  admins: User[];
}

export interface User {
  email: string;
  uid: string;
}

export interface Prices {
  prices: Price[];
}

export interface Price {
  price: string;
  description: string;
  value: number;
}

// === CONSTANTES ===
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

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

// === FONCTIONS UTILES ===
const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const authRequest = async (
  method: "get" | "post" | "delete",
  path: string,
  data?: any
) => {
  const token = await getAuthToken();
  try {
    const response = await axios({
      method,
      url: `${NEXT_PUBLIC_API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l’appel à ${path} :`, error);
    throw error;
  }
};

// === FONCTIONS ADMINISTRATION ===
export const isAdministrator = async () => {
  let isAdmin = false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      const { data, error } = await supabase.rpc("is_admin_uid", {
        user_id: user.id,
      });
      if (error) console.error(error);
      else isAdmin = data;
    } catch (error) {
      console.error("Erreur lors de la vérification du statut admin :", (error as Error).message);
    }
  }

  return isAdmin;
};

export const getAllUsers = async () => {
  const data = await authRequest("get", "admins/users");
  return (data as Users).users;
};

export const getAdmins = async () => {
  const data = await authRequest("get", "admins");
  return (data as Admins).admins;
};

export const addAdmin = async (user_id: string) => {
  return await authRequest("post", "admins", { user_id });
};

export const removeAdmin = async (user_id: string) => {
  return await authRequest("delete", "admins", { user_id });
};

export const grantCreditsToUser = async (userId: string, amount: number): Promise<string> => {
  try {
    const data = await authRequest("post", `admins/users/${userId}/grant`, {
      credits: amount,
    });
    return (data as Response).message;
  } catch {
    return "Une erreur s'est produite lors de l'octroi de crédits.";
  }
};