"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";


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
			"Thanks for signing up! Please check your email for a verification link.",
		);
	}
};

export const signInAction = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	try {
		const response = await axios.post(`${API_URL}login`, {
			email: email,
			password,
		});
		console.log("response", response);
		const { token } = response.data;
		console.log("Login successful. Token:", token);
		(await
			cookies()).set("auth_token", token, { httpOnly: true, secure: true });
		const supabase = await createClient();
		await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return redirect("/protected/chat");
	} catch (error) {
		return encodedRedirect("error", "/sign-in", (error as Error).message);
	}
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
			"Could not reset password",
		);
	}

	if (callbackUrl) {
		return redirect(callbackUrl);
	}

	return encodedRedirect(
		"success",
		"/forgot-password",
		"Check your email for a link to reset your password.",
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
			"Password and confirm password are required",
		);
	}

	if (password !== confirmPassword) {
		encodedRedirect(
			"error",
			"/protected/reset-password",
			"Passwords do not match",
		);
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		encodedRedirect(
			"error",
			"/protected/reset-password",
			"Password update failed",
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
	const {
		data: { user },
	} = await (await createClient()).auth.getUser();
	if (user) {
		try {
		const response = await (await createClient()).rpc('verify_user_is_admin', { auth_user_id: user.id });
		isAdministrator = response.data;	
	} catch (error) {
			console.error("Error verifying admin status:", (error as Error).message);
		}
	}
	return isAdministrator;
}
