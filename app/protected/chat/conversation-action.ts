"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? 'http://esp_back:3000/';

export interface Message {
	message_id: number;
	sender: string;
	message: string;
	timestamp: string;
}

export interface Conversation {
	id: string;
	name: string;
	conv: Message[];
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
		const { data } = await axios.get<Conversation>(API_URL.concat('convs'), {
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
		const { data } = await axios.get<Conversation>(API_URL.concat('convs/').concat(conv_id), {
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
        const { data } = await axios.request<Conversation>({
            method: 'DELETE',
            url: API_URL.concat('convs'),
            headers: {
                'content-Type': 'application/json',
                'access_Token': access_token,
                'refresh_Token': refresh_token,
            },
            data: {
                'conv_id':String(convId),
            },
        });
        return { conversation: data };
    } catch (err: any) {
        console.error('Error deleting conversation:', err);
        return { error: err.message || 'An unexpected error occurred' };
    }
};

