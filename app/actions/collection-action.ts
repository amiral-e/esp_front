import axios from "axios";
import { cookies } from "next/headers";

const BACKEND_IA_URL = process.env.BACKEND_IA_URL ?? "";

export const fetchConversations = async () => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const { data } = await axios.get<any>(BACKEND_IA_URL.concat('collections'), {
			headers: {
				access_token,
				refresh_token
			},
		});
		return { conversation: data };
	} catch (err: any) {
		console.error('Error fetching conversations:', err);
		return { error: err };
	}
};