"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// Login avec username/password
export const login = async (data: LoginData) => {
  const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/token`,
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Stocker le token dans les cookies
  const cookieStore = await cookies();
  cookieStore.set("auth_token", response.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response.data;
};

// Déconnexion
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
};
