"use server"

import { cookies } from "next/headers";
import { isAdministrator } from "../actions";
import axios from "axios";
import { ResponseMessage } from "./collection-action";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";


export interface Doc {
    response: ResponseData;
    status: string;
    collection_name: string;
}

export interface ResponseData {
    documents: Document[];
}

export interface Document {
    doc_id: string;
    doc_file: string;
}

const getAuthToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value ?? null;
};

export const fetchDocumentByCollection = async (
    collection_name: string,
    status: string
): Promise<{ response?: ResponseData; status?: string; collection_name?: string; error?: any }> => {
    try {
        const auth_token = await getAuthToken();
        if (!auth_token) {
            throw new Error("Tokens are missing");
        }
        const url =
            status === "global"
                ? `${API_URL}admins/collections/${collection_name}/documents`
                : `${API_URL}collections/${collection_name}/documents`;
        const response = await axios.get<ResponseData>(url, {
            headers: {
                Authorization: `Bearer ${auth_token}`,
            },
        });
        return {
            response: response.data,
            status,
            collection_name,
        };
    } catch (err: any) {
        console.error("Error fetching documents:", err);
        if (err.response) {
            // Handle API errors explicitly
            const { status, data } = err.response;
            if (status === 404) {
                console.warn(`Collection "${collection_name}" not found.`);
                return { error: "Collection not found" };
            }
            return { error: data?.message || "Unknown error" };
        }
        return { error: err.message || "Unexpected error" };
    }
};


export const deleteDocument = async (collection: Doc, doc_id: string) => {
    try {
        const auth_token = await getAuthToken();
        if (!auth_token) {
            throw new Error('Tokens are missing');
        }
        const url = collection.status === 'global'
            ? API_URL.concat('admins/collections/').concat(collection.collection_name).concat('/documents/').concat(doc_id)
            : API_URL.concat('collections/').concat(collection.collection_name).concat('/documents/').concat(doc_id);
            const response = await axios.delete<ResponseMessage>(url, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            });
            return response.data.message;
    } catch (err: any) {
        console.error('Error fetching conversations:', err);
        return { error: err };
    }
}