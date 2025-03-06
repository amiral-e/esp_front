"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { getUserInfo, isAdministrator } from "../actions";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
	const cookieStore = await cookies();
	return cookieStore.get('auth_token')?.value ?? null;
};

export interface Collection {
	collections: Collections[];
}

export interface Collections {
	collection: string;
	name: string;
	status: string;
}

export interface ResponseMessage {
	message: string;
}

export const fetchCollections = async () => {
	try {
		// const isAdmin = await isAdministrator();
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error("Tokens are missing");
		}
		let globalCollections: Collections[] = [];
		let userCollections: Collections[] = [];
			try {
				console.log("Fetching global collections...");
				const globalResponse = await axios.get<{ collections: Collections[] }>(
					API_URL.concat("admins/collections"),
					{
						headers: { Authorization: `Bearer ${auth_token}` },
					}
				);
				globalCollections = globalResponse.data.collections?.map((collection) => ({
					...collection,
					status: "global",
				})) || [];
			} catch (error: any) {
				console.warn("Error fetching global collections:", error.response?.data || error.message);
			}
		try {
			const collectionsResponse = await axios.get<{ collections: Collections[] }>(
				API_URL.concat("collections"),
				{
					headers: { Authorization: `Bearer ${auth_token}` },
				}
			);
			userCollections = collectionsResponse.data.collections?.map((collection) => ({
				...collection,
				status: "normal",
			})) || [];
		} catch (error: any) {
			console.warn("User collections not found:", error.response?.data || error.message);
		}
		const finalCollections = [...globalCollections, ...userCollections];
		return { collections: finalCollections };
	} catch (err: any) {
		console.error("Error fetching collections:", err);
		return { error: err };
	}
};

export const createCollection = async (name: string, files: File | File[]) => {
	try {
		const isAdmin = await isAdministrator();
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}

		const MAX_FILE_SIZE = 25 * 1024 * 1024;
		const url_api = !isAdmin
			? API_URL.concat('collections/').concat(name).concat('/documents')
			: API_URL.concat('admins/collections/').concat(name).concat('/documents');

		const formData = new FormData();
		const fileList = Array.isArray(files) ? files : [files];

		for (const file of fileList) {
			if (file.size > MAX_FILE_SIZE) {
				console.error(`File too large: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
				return { error: `The file "${file.name}" exceeds the 25MB limit.` };
			}
			formData.append("files", file);
		}

		const response = await axios.post<ResponseMessage>(url_api, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${auth_token}`,
			},
		});

		return { response: response.data.message };
	} catch (err: any) {
		console.error('Error creating collection:', err.response?.data.error);
		return { error: err.response?.data.error };
	}
};



export const deleteCollection = async (name: string) => {
	try {
		const isAdmin = await isAdministrator()
		const url_api = !isAdmin
			? API_URL.concat('collections/').concat(name)
			: API_URL.concat('admins/collections/').concat(name);
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}
		const data = await axios.request<ResponseMessage>({
			method: 'DELETE',
			url: url_api,
			headers: {
				Authorization: `Bearer ${auth_token}`,
			},
		});
		return { response: data.data.message };
	} catch (err: any) {
		console.error('Error deleting conversation:', err);
		return { error: err };
	}
}