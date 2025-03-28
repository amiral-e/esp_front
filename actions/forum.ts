"use server";

import { getUserInfo } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const auth_token = await getAuthToken();
  if (!auth_token) {
    throw new Error("Tokens are missing");
  }
  config.headers.Authorization = `Bearer ${auth_token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});

export interface Message {
  id: string;
  thread_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Thread {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export const fetchThreads = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("threads").select("*").order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getThreadById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("threads").select("*").eq("id", id);
  if (error) {
    throw error;
  }
  return data;
};

export const createThread = async (title: string, userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("threads").insert({
    title,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
  return data;
};

export const fetchMessagesByThread = async (threadId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("messages").select("*").eq("thread_id", threadId).order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

export const sendMessage = async (threadId: string, userId: string, content: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("messages").insert({
    thread_id: threadId,
    user_id: userId,
    content,
  });

  if (error) {
    throw error;
  }
  return data;
};
