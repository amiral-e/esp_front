"use server"

import axios from "axios";
import { cookies } from "next/headers";

const NEXT_PUBLIC_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value ?? null;
};

export interface Report {
    id: number,
    title: string,
}

export interface Response {
    title: string,
    text: string
}

export interface Message {
    message: string
}

// Function to get all the reports of the user
export const getReports = async (): Promise<Report[]> => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.get<Report[]>(
            `${NEXT_PUBLIC_API_URL}reports`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return data || [];
    } catch (error) {
        return [];
    }
}

// Function to create a report
// title, docs, prompt and collection_name are required
export const createReport = async (title: string, docs: string[], prompt: string, collection_name: string): Promise<string> => {
    const auth_token = await getAuthToken();
    try {
        const {data} = await axios.post<Response>(
            `${NEXT_PUBLIC_API_URL}reports`,
            {
                title: title,
                documents: docs,
                prompt: prompt,
                collection_name: collection_name
            },
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const message = "Le rapport "+ data.title + " a été créé avec succès";
        return message;
    } catch (error) {
        console.error("Erreur lors de la création du rapport:", error);
        return "Erreur lors de la création du rapport";
    }
};


// Function to get a report by ID, it returns the report details
export const getReportById = async (id: number): Promise<Response | null> => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.get<Response>(
            `${NEXT_PUBLIC_API_URL}reports/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return data;
    }
    catch (error) {
        console.error("Error fetching report by ID:", error);
        return null;
    }
}

// Function to delete a report by ID
export const deleteReport = async (id: number): Promise<Message> => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.delete<Message>(
            `${NEXT_PUBLIC_API_URL}reports/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return data;
    } catch (error) {
        console.error("Error deleting report:", error);
        return { message: "Failed to delete report" };
    }
}