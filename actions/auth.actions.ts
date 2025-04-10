"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import axios from "axios";

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

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const decodeAuthToken = async (): Promise<string | null> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    // Try to decode without verification first to extract payload
    const decoded = jwt.decode(token) as { uid: string } | null;
    if (!decoded || !decoded.uid) {
      console.log("Could not decode token or no uid in payload");
      return null;
    }

    return decoded.uid;
  } catch (error) {
    console.error("Error decoding auth token:", error);
    return null;
  }
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const name = formData.get("name")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const cookieStore = await cookies();

  if (!email || !password) {
    return { error: "Email et mot de passe sont requis" };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        name: name || "",
      },
    },
  });

  if (data.user?.id) {
    try {
      const response = await axios.post(`${apiUrl}/test`, {
        uid: data.user.id,
      });
      if (response.status === 200) {
        cookieStore.set("auth_token", response.data.token);
        return {
          success:
            "Merci pour votre inscription ! Veuillez vérifier votre email pour un lien de validation.",
          data: data,
          redirect: "/protected/chat",
        };
      } else {
        return {
          error:
            "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
        };
      }
    } catch (error) {
      console.error("API authentication error:", error);
    }
  }
  if (error) {
    console.error(error.code + " " + error.message);
    return { error: error.message };
  } else {
    return {
      success:
        "Merci pour votre inscription ! Veuillez vérifier votre email pour un lien de validation.",
      data: data,
      redirect: "/protected/chat",
    };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  // Authentification Supabase
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (authData) {
    try {
      // Appel à votre API avec l'ID utilisateur de Supabase
      const response = await axios.post(
        `${apiUrl}/test`,
        { uid: authData.user.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Stockage du token retourné par votre API
      const cookieStore = await cookies();
      cookieStore.set("auth_token", response.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return redirect("/protected/chat");
    } catch (apiError: any) {
      console.error("API authentication error:", apiError);
      return encodedRedirect(
        "error",
        "/sign-in",
        "Error during API authentication"
      );
    }
  }

  return encodedRedirect("error", "/sign-in", "Unexpected error occurred.");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = cookies();
  (await cookieStore).delete("auth_token");
  return redirect("/sign-in");
};

export const isAdministrator = async () => {
  let isAdministrator = false;
  const supabase = await createClient();
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  if (user) {
    try {
      let { data, error } = await supabase.rpc("is_admin_uid", {
        user_id: user.id,
      });
      if (error) console.error(error);
      else isAdministrator = data;
    } catch (err) {
      let { data, error } = await supabase.rpc("is_admin_uid", {
        user_id: user.id,
      });
      if (error) console.error(error);
      else isAdministrator = data;
    }
  }
  return isAdministrator;
};

export const getUserInfo = async () => {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  console.log("USER INFO", user);
  return user;
};

export const getAllUsers = async () => {
  const auth_token = await getAuthToken();
  const { data } = await axios.get<Users>(`${apiUrl}admins/users`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  return data.users;
};

export const getAdmins = async () => {
  const auth_token = await getAuthToken();
  const { data } = await axios.get<Admins>(`${apiUrl}admins`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  return data.admins;
};

export const addAdmin = async (user_id: string) => {
  const auth_token = await getAuthToken();
  try {
    const { data } = await axios.post<any>(
      `${apiUrl}admins`,
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
};

export const removeAdmin = async (user_id: string) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.delete<any>(`${apiUrl}admins`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
    data: {
      user_id: user_id,
    },
  });
  return data;
};

export const getPlatformPrices = async () => {
  const auth_token = await getAuthToken();
  const { data } = await axios.get<Prices>(`${apiUrl}admins/config`, {
    headers: {
      Authorization: `Bearer ${auth_token}`,
    },
  });
  return data.prices;
};

export const updateCreditsAdmin = async (credits: number) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.post<any>(
    `${apiUrl}update-credits`,
    {
      credits: credits,
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data;
};

export async function updateMontantForUser(
  userId: string,
  amountToAdd: number
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("increment_credits", {
      new_credits: amountToAdd,
      user_id: userId,
    });
    if (error) {
      console.error("Erreur lors de l'incrémentation des crédits :", error);
    } else {
      console.log(
        `Crédits incrémentés de ${amountToAdd} avec succès pour l'utilisateur ${userId}!`
      );
      return data;
    }
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des crédits :", error);
  }
}

export const getCurrentUser = async () => {
  try {
    const supabase = await createClient();

    // First try to get user from auth token
    const userId = await decodeAuthToken();
    // Fallback to session-based auth if token doesn't work
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Error fetching current user:", error.message);
      return null;
    }

    if (!user) {
      return null;
    }

    // Get additional user data from your database if needed
    const { data: userData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    console.log("USER DATA", userData);

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching user profile:", profileError.message);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || userData?.name || "Utilisateur",
      avatar: userData?.avatar_url || null,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      role: userData?.role || "user",
    };
  } catch (error) {
    // Handle the "Auth session missing" error specifically
    if (
      error instanceof Error &&
      error.message.includes("Auth session missing")
    ) {
      console.log("No active session found");
    } else {
      console.error("Unexpected error fetching current user:", error);
    }
    return null;
  }
};
