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
		const { data } = await axios.get<any>(API_URL.concat('collections'),{});
		return { collection: data.data };
	} catch (err: any) {
		console.error('Error fetching conversations:', err);
		return { error: err };
	}
};