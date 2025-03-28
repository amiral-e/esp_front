import axios from "axios";
import { cookies } from "next/headers";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const axiosInstance = async (endpoint: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.concat(endpoint),
    headers: {
      Authorization: `Bearer ${await getAuthToken()}`,
    },
  });
