"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import axios from "axios";
import { isAdministrator } from "./admin";

export interface Prices {
  prices: Price[];
}

export interface Price {
  price: string,
  description: string,
  value: number
}

const defaultPrices: Prices = {
  prices: [
    {
      price: "search",
      description: "defined price of 0.05$ / retrieve search",
      value: 2.05
    },
    {
      price: "groq_input",
      description: "original price of 0.59$ / 1M tokens; new price for 10k chars",
      value: 0.9
    },
    {
      price: "groq_output",
      description: "original price of 0.79$ / 1M tokens; new price for 10k chars",
      value: 1.1
    },
    {
      price: "openai_embedding",
      description: "original price of 0.1$ / 1M tokens; new price for 10k chars",
      value: 0.3
    }
  ]
};


const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export const getPlatformPrices = async () => {
  const auth_token = await getAuthToken();
  const isAdmin = await isAdministrator();
  if (!isAdmin) {
    return defaultPrices.prices;
  }
  const { data } = await axios.get<Prices>(
    `${NEXT_PUBLIC_API_URL}admins/config`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.prices;
}

export const updatePlatformPrice = async (price_name: string, price: number) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.put<any>(
    `${NEXT_PUBLIC_API_URL}admins/config/${price_name}`,
    {
      value: price,
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.message;
}

export async function updateMontantForUser(userId: string, amountToAdd: number) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('increment_credits', {
      new_credits: amountToAdd,
      user_id: userId
    });
    if (error) {
      console.error("Erreur lors de l'incrémentation des crédits :", error);
    } else {
      console.log(`Crédits incrémentés de ${amountToAdd} avec succès pour l'utilisateur ${userId}!`);
      return data;
    }
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des crédits :", error);
  }
}