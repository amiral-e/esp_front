"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// This function is used to sign up a new user and log them in
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

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

  if (signInError) {
    return { error: signInError.message };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ uid: data.user.id }, secret, { expiresIn: "7d" });
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: true,
  });

  return redirect("/");
};

// This function is used to sign in an existing user
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
    const token = jwt.sign({ uid: payload.uid }, secret);
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: true,
    });

    return redirect("/");
  }
  return encodedRedirect("error", "/sign-in", "Unexpected error occurred.");
};

// This function is used for forgot password functionality
// It sends a password reset email to the user
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

// This function is used to reset the password after the user clicks the link in the email
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

// This function is used to sign out the user, it deletes the auth token from cookies
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = cookies();
  (await cookieStore).delete("auth_token");
  return redirect("/sign-in");
};

// This function is used to get the user information
export const getUserInfo = async () => {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  return user;
};

// This function is used to get the auth token from cookies
export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// This function is used to get the user UID from the auth token
export const deleteUser = async (user_uid: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc('delete_user', {
      user_uid
    })
  const cookieStore = cookies();
  (await cookieStore).delete("auth_token");
  return redirect("/sign-in");
}

// To update the user information, particularly the email
export const updateUser = async (user_uid: string, email: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .update({ email })
    .eq('user_uid', user_uid)
  if (error) console.error(error)
  else console.log(data)
  return data
}