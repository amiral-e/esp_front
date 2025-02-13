"use server";

import { createClient } from "@/utils/supabase/server";

interface Message {
  role: string;
  content: string;
}

interface Conversations {
  id: string;
  name: string;
  history: Message[];
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  history: Message[];
  user_id: string;
  createdAt: string;
}

export const fetchConversations = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

export const getConversationById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id);
  return data;
};

export const getConversationByUser = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId);
  return data;
};

export const createConversation = async (title: string, userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("conversations").insert({
    user_id: userId,
    name: title,
    history: [],
  });

  if (error) {
    throw error;
  }
  return data;
};

export const updateConversation = async (id: string, name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .update({ name: name })
    .eq("id", id);
  return data;
};

export const deleteConversation = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id);
  return data;
};
