"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import axios from "axios";
import { Response } from "./collections";

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

export const isAdministrator = async () => {
  let isAdministrator = false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  if (user) {
    try {
      let { data, error } = await supabase
        .rpc('is_admin_uid', {
          user_id: user.id,
        })
      if (error) console.error(error)
      else isAdministrator = data;
    } catch (error) {
      console.error("Error verifying admin status:", (error as Error).message);
    }
  }
  return isAdministrator;
}

export const getAllUsers = async () => {
  const auth_token = await getAuthToken();
  const { data } = await axios.get<Users>(
    `${NEXT_PUBLIC_API_URL}admins/users`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.users;
}

export const getAdmins = async () => {
  const auth_token = await getAuthToken();
  const { data } = await axios.get<Admins>(
    `${NEXT_PUBLIC_API_URL}admins`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.admins;
}

export const addAdmin = async (user_id: string) => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.post<any>(
      `${NEXT_PUBLIC_API_URL}admins`,
      {
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
}

export const removeAdmin = async (user_id: string) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.delete<any>(
    `${NEXT_PUBLIC_API_URL}admins`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
      data: {
        user_id: user_id,
      },
    }
  );
  return data;
}


export async function grantCreditsToUser(userId: string, amount: number): Promise<string> {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.post<Response>(
      `${NEXT_PUBLIC_API_URL}admins/users/${userId}/grant`,
      {
        credits: amount,
      },
      {
        headers: {
          Authorization: `Bearer ${auth_token}`,
        }
      }
    );
    return data.message;
  }catch (error) {
    return "Une erreur s'est produite lors de l'octroi de crédits.";
  }
}
