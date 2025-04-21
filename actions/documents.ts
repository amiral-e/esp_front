"use server";

import axios from "axios";
import { cookies } from "next/headers";

export interface Doc {
    documents: Document[];
}

export interface Document {
    doc_id: string;
    doc_file: string;
}

export interface Response {
    message: string;
}

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value ?? null;
};

// Function to get all the documents by collection name
export const getDocumentsByCollectionName = async (collection_name: string) => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.get<Doc>(
            `${API_URL}collections/${collection_name}/documents`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            }
        );
        return data.documents || [];
    } catch (error: any) {
        if (error.response.status === 404) {
            return [];
        }
        if (error.response) {
            console.error("Détails de l'erreur:", {
                status: error.response.status,
                data: error.response.data,
            });
        }
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Erreur lors de la récupération des documents"
        );
    }
}

// Function to get all the documents by collection name for admin, all the global documents
export const getDocumentsByCollectionGlobal = async (collection_name: string) => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.get<Doc>(
            `${API_URL}admins/collections/${collection_name}/documents`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            }
        );
        return data.documents || [];
    } catch (error: any) {
        if (error.response.status === 404) {
            return [];
        }
        if (error.response) {
            console.error("Détails de l'erreur:", {
                status: error.response.status,
                data: error.response.data,
            });
        }
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Erreur lors de la récupération des documents"
        );
    }
}

// Function to delete a document by its ID
export const deleteDocumentByDocId = async (collection_name: string, doc_id: string) => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.delete<Response>(
            `${API_URL}collections/${collection_name}/documents/${doc_id}`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            }
        );
        return data.message;
    }
    catch (error: any) {
        console.error("Error deleting document:", error);
        if (error.response) {
            console.error("Détails de l'erreur:", {
                status: error.response.status,
                data: error.response.data,
            });
        }
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Erreur lors de la suppression du document"
        );
    }
}

// Delete global document by its ID for admin.
export const deleteDocumenGlobaltByDocId = async (collection_name: string, doc_id: string) => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.delete<Response>(
            `${API_URL}admins/collections/${collection_name}/documents/${doc_id}`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            }
        );
        return data.message;
    }
    catch (error: any) {
        console.error("Error deleting document:", error);
        if (error.response) {
            console.error("Détails de l'erreur:", {
                status: error.response.status,
                data: error.response.data,
            });
        }
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Erreur lors de la suppression du document"
        );
    }
}
