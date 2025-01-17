"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://localhost:3000/";

export interface Message {
	role: string;
	content: string;
}

export interface Conversation {
	id: string;
	name: string;
	convs: Message[];
	createAt: string;
}

export interface Conversations {
	id: string;
	name: string;
	history: Message[];
	createAt: string;
}

export const fetchConversations = async () => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const { data } = await axios.get<Conversation>(API_URL.concat('conversations'), {
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


export const fetchConversationsByConvId = async (conv_id: string) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const { data } = await axios.get<Conversations>(API_URL.concat('conversations/').concat(conv_id), {
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

export const deleteConversation = async (convId: string) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;

		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const { data } = await axios.request<Conversations>({
			method: 'DELETE',
			url: API_URL.concat('conversations/').concat(convId),
			headers: {
				'content-Type': 'application/json',
				'access_Token': access_token,
				'refresh_Token': refresh_token,
			},
			data: {
				'conv_id': String(convId),
			},
		});
		return { conversation: data };
	} catch (err: any) {
		console.error('Error deleting conversation:', err);
		return { error: err.message || 'An unexpected error occurred' };
	}
};

export const createConversation = async (title: string) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if (!access_token || !refresh_token) {
			throw new Error('Tokens are missing');
		}
		const { data } = await axios.request<any>({
			method: 'POST',
			url: API_URL.concat('conversations/').concat(title),
			headers: {
				'content-Type': 'application/json',
				'access_Token': access_token,
				'refresh_Token': refresh_token,
			},
			data: {
				'message': String(title),
			},
		});
		console.log('Conversation created:', data);
		return { conv: data };
	} catch (err: any) {
		console.error('Error deleting conversation:', err);
		return { error: err.message || 'An unexpected error occurred' };
	}
}

export const updateConversation = async (convId: string, title: string) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		const data = await axios.request<Conversations>({
			method: 'PATCH',
			url: API_URL.concat('conversations/').concat(convId),
			headers: {
				'content-Type': 'application/json',
				'access_Token': access_token,
				'refresh_Token': refresh_token,
			},
			data: {
				'name': String(title),
			},
		});
		console.log('Conversation updated:', data);
	} catch (err: any) {
		console.error('Error updating conversation:', err);
		return { error: err.message || 'An unexpected error occurred' };
	}
}

export const sendMessage = async (convId: string, message: string, collection: string) => {
	try {
		const cookieStore = await cookies();
		const access_token = cookieStore.get('access_token')?.value ?? null;
		const refresh_token = cookieStore.get('refresh_token')?.value ?? null;
		if(collection != ""){
			const data = await axios.request<any>({
				method: 'POST',
				url: API_URL.concat('chat/').concat(convId).concat('/').concat(collection),
				headers: {
					'content-Type': 'application/json',
					'access_Token': access_token,
					'refresh_Token': refresh_token,
				},
				data: {
					'message': String(message),
				},
			});
			return { role: data.data.role, content: data.data.content, sources: data.data.sources }; 
		} else {
			const data = await axios.request<Message>({
				method: 'POST',
				url: API_URL.concat('chat/').concat(convId),
				headers: {
					'content-Type': 'application/json',
					'access_Token': access_token,
					'refresh_Token': refresh_token,
				},
				data: {
					'message': String(message),
				},
			});
			return { role: data.data.role, content: data.data.content }; 
		}
	} catch (err: any) {
		console.error('Error sending message:', err);
		return { error: err.message || 'An unexpected error occurred' };
	}
}


