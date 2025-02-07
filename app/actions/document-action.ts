"use server"

import { cookies } from "next/headers";
import { isAdministrator } from "../actions";
import axios from "axios";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";


export interface ResponseData {
    documents: Document[];
    status: string;
    collection_name: string;
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
): Promise<ResponseData | { error: any }> => {
    try {
        const auth_token = await getAuthToken();
        if (!auth_token) {
            throw new Error('Tokens are missing');
        }

        const url = status === 'global'
            ? API_URL.concat('global/collections/').concat(collection_name).concat('/documents')
            : API_URL.concat('collections/').concat(collection_name).concat('/documents');

        const { data } = await axios.get<ResponseData>(url, {
            headers: {
                Authorization: `Bearer ${auth_token}`,
            },
        });

        return {
            documents: data.documents,
            status: status,
            collection_name: collection_name,
        };
    } catch (err: any) {
        console.error('Error fetching documents:', err);
        return { error: err };
    }
};

export const deleteDocument = async (collection: ResponseData, doc_id: string) => {
    try {
        const auth_token = await getAuthToken();
        if (!auth_token) {
            throw new Error('Tokens are missing');
        }
        const url = collection.status === 'global'
            ? API_URL.concat('global/collections/').concat(collection.collection_name).concat('/documents/').concat(doc_id)
            : API_URL.concat('collections/').concat(collection.collection_name).concat('/documents/').concat(doc_id);
            const response = await axios.delete<{response: string}>(url, {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
            });
            return response.data.response;
    } catch (err: any) {
        console.error('Error fetching conversations:', err);
        return { error: err };
    }
}