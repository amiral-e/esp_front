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
  price: string,
  description: string,
  value: number
}

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Merci de vous être inscrit ! Veuillez vérifier votre e-mail pour obtenir un lien de vérification"
    );
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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  if (data) {
    const payload = {
      uid: data.user.id,
    };
    const token = jwt.sign(payload, secret);
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: true,
    });

    return redirect("/protected/chat");
  }
  return encodedRedirect("error", "/sign-in", "Une erreur s'est produite");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Un email est requis");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Impossible de réinitialiser le mot de passe"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Vérifiez votre email pour réinitialiser votre mot de passe"
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

export const getUserInfo = async () => {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  return user;
};


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


export const getPlatformPrices = async () => {
  const auth_token = await getAuthToken();
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


export const updateCreditsAdmin = async (credits: number) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.post<any>(
    `${NEXT_PUBLIC_API_URL}update-credits`,
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