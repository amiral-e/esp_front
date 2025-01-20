"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { isAdministrator } from "../actions";
import { is } from "cypress/types/bluebird";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
	const cookieStore = await cookies();
	return cookieStore.get('auth_token')?.value ?? null;
};

export interface Collection {
	collections: Collections[];
}

export interface Collections {
	table_name: string;
	name: string;
}

export const fetchCollections = async () => {
	try {
		const isAdmin = await isAdministrator()
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}
		let globalCollections: Collections[] = [];
		if (isAdmin) {
			const globalResponse = await axios.get<Collection>(API_URL.concat('global/collections'), {
				headers: {
					Authorization: `Bearer ${auth_token}`,
				},
			});
			globalCollections = globalResponse.data.collections;
		}
		const collectionsResponse = await axios.get<Collection>(API_URL.concat('collections'), {
			headers: {
				Authorization: `Bearer ${auth_token}`,
			},
		});
		const normalCollections = collectionsResponse.data.collections;
		const combinedCollections = [...globalCollections, ...normalCollections];
		return { collections: combinedCollections };
	} catch (err: any) {
		console.error('Error fetching conversations:', err);
		return { error: err };
	}
};

export const createCollection = async (name: string, files: File | File[]) => {
	try {
		const isAdmin = await isAdministrator()
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}
		const url_api = !isAdmin
			? API_URL.concat('collections/').concat(name)
			: API_URL.concat('global/collections/').concat(name);
		const formData = new FormData();
		if (Array.isArray(files)) {
			files.forEach((file) => formData.append("files", file));
		} else {
			formData.append("files", files);
		}

		const data = await axios.request<any>({
			method: 'POST',
			url: url_api,
			headers: {
				'content-Type': 'multipart/form-data',
				Authorization: `Bearer ${auth_token}`,
			},
			data: formData,
		});
		console.log('data', data);
		return { response: data.data.response };
	} catch (err: any) {
		console.error('Error creating conversation:', err);
		return { error: err };
	}
}


export const deleteCollection = async (name: string) => {
	try {
		const isAdmin = await isAdministrator()
		const url_api = !isAdmin
			? API_URL.concat('collections/').concat(name).concat('/documents')
			: API_URL.concat('global/collections/').concat(name);
		const auth_token = await getAuthToken();
		if (!auth_token) {
			throw new Error('Tokens are missing');
		}
		const data = await axios.request<any>({
			method: 'DELETE',
			url: url_api,
			headers: {
				Authorization: `Bearer ${auth_token}`,
			},
		});
		return { response: data.data.response };
	} catch (err: any) {
		console.error('Error deleting conversation:', err);
		return { error: err };
	}
}