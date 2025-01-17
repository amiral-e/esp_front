"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "";

export const fetchCollections = async () => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const data = [];
		const response_user = await axios.get<any>(API_URL.concat('collections'),{
			headers: {
				access_token,
				refresh_token
			},
		});
		if(response_user.data.response.length > 0){
			data.push(response_user.data.response);
		}
		return { collection: data };
	} catch (err: any) {
		console.error('Error fetching conversations:', err);
		return { error: err };
	}
};

export const createCollection = async (name: string, files: File|File[]) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const data = await axios.request<any>({
			method: 'POST',
			url: API_URL.concat('documents/').concat(name),
			headers: {
				'content-Type': 'multipart/form-data',
				'access_Token': access_token,
				'refresh_Token': refresh_token,
			},
			data: {
				'files': files,
			},
		});
		console.log('data',data.data.response);
		return { response: data.data.response };
	} catch (err: any) {
		console.error('Error creating conversation:', err);
		return { error: err };
	}
}