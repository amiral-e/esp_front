"use server";

import { cookies } from "next/headers";
import axios from "axios";

export interface Users {
  users: User[];
}


export interface User {
  email: string;
  uid: string;
}

const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value ?? null;
};

// Function to create a predefined question, admin only
// Question and level are required
export const createPredifinedQuestion = async (question: string, level: string) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.post<any>(
    `${NEXT_PUBLIC_API_URL}admins/questions`,
    {
      question: question,
      level: level,
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.message;
}

// Function to delete a predefined question, admin only
export const deletePredifinedQuestion = async (questionId: number) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.delete<any>(
    `${NEXT_PUBLIC_API_URL}admins/questions/${questionId}`,
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data.message;
}

// Function to modify a predefined question, admin only
export const modifyPredifinedQuestions = async (question: string, level: string, questionId: number) => {
  const auth_token = await getAuthToken();
  const { data } = await axios.put<any>(
    `${NEXT_PUBLIC_API_URL}admins/questions/${questionId}`,
    {
      question: question,
      level: level,
    },
    {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    }
  );
  return data;
}

// Function to get all the predefined questions
export const getPredifinedQuestions = async () => {
  const auth_token = await getAuthToken();

  try {
    const { data } = await axios.get(`${NEXT_PUBLIC_API_URL}questions`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    return data.questions || [];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    console.error("Erreur lors de la récupération des questions :", error);
    throw error;
  }
};


export const getAllQuestionsForAdmin = async () => {
  const auth_token = await getAuthToken();

  try {
    const { data } = await axios.get(`${NEXT_PUBLIC_API_URL}admins/questions`, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    return data.questions || [];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    console.error("Erreur lors de la récupération des questions :", error);
    throw error;
  }
};