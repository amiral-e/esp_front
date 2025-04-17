"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// === UTILS ===
const getOrigin = async () => (await headers()).get("origin") || "";
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  return secret;
};

const setAuthCookie = async (uid: string) => {
  const token = jwt.sign({ uid }, getJWTSecret(), { expiresIn: "7d" });
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: true,
  });
};

// === ACTIONS ===

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const origin = await getOrigin();
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email et mot de passe sont requis" };
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.message);
    return { error: signUpError.message };
  }

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !data?.user) {
    return { error: signInError?.message || "Échec de la connexion" };
  }

  await setAuthCookie(data.user.id);
  return redirect("/");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect("error", "/sign-in", "Email et mot de passe requis");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return encodedRedirect("error", "/sign-in", error?.message || "Erreur inconnue");
  }

  await setAuthCookie(data.user.id);
  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const callbackUrl = formData.get("callbackUrl")?.toString();
  const origin = await getOrigin();
  const supabase = await createClient();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email requis");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Impossible d'envoyer le lien");
  }

  if (callbackUrl) return redirect(callbackUrl);

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Un lien de réinitialisation a été envoyé par email"
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Les deux champs sont requis"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Les mots de passe ne correspondent pas"
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "La mise à jour a échoué"
    );
  }

  return encodedRedirect(
    "success",
    "/protected/reset-password",
    "Mot de passe mis à jour"
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = cookies();
  (await cookieStore).delete("auth_token");
  return redirect("/sign-in");
};