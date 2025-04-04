"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export interface PaymentSession {
  url: string;
}

// Créer une session de paiement Stripe
export const createPaymentSession = async (priceId: string) => {
  const auth_token = await getAuthToken();
  const response = await axios.post<PaymentSession>(
    `${API_URL}/payments/create-checkout-session`,
    { price_id: priceId },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Récupérer les prix disponibles
export const getPrices = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/payments/prices`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Récupérer l'historique des paiements
export const getPaymentHistory = async () => {
  const auth_token = await getAuthToken();
  const response = await axios.get(`${API_URL}/payments/history`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
