"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { getConversationByUser } from "./conversations";


const NEXT_PUBLIC_API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const getAuthToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value ?? null;
};

export interface Knowledges {
    levels: string[];
}
export interface KnowledgeLevel {
    id: number;
    name: string;
}

export interface Profile {
    id: string;
    credits: number;
    level: string;
    created_at: string | Date;
}

export interface User {
    profile: Profile;
}

export interface UsageData {
    usage: ProfileUsage[];
}

export interface ProfileUsage {
    month: string;
    total_docs: number;
    total_messages: number;
    total_reports: number;
    used_credits: number;
    total_conversations: number;
}

export interface Message {
    message: string;
}

// To get the list of knowledge levels
export const getKnowledges = async (): Promise<KnowledgeLevel[]> => {
    const auth_token = await getAuthToken();
    try {
        const { data } = await axios.get<Knowledges>(
            `${NEXT_PUBLIC_API_URL}config/levels`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return data.levels.map((level, index) => ({
            id: index + 1,
            name: level,
        }));
    } catch (error) {
        return [];
    }
};


// To get the profile of the user, particularly the credits and level
export const getProfile = async (): Promise<User | null> => {
    const auth_token = await getAuthToken();
    if (!auth_token) {
        console.warn("No authentication token found.");
        return null;
    }

    try {
        const { data } = await axios.get<User>(
            `${NEXT_PUBLIC_API_URL}profile`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return {
            ...data,
        };
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
};

// This is to update the level of the user
// The level is used to determinate of the bot should be more or less verbose
export const updateProfile = async (level: string): Promise<Message> => {
    const auth_token = await getAuthToken();
    try {
        const response = await axios.put<Message>(
            `${NEXT_PUBLIC_API_URL}profile/level`,
            {
                level: level
            },
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        return { message: "An error occurred while updating the profile." };
    }
}

// This is to get the usage data of the user, number of messages, number of reports, number of documents, and number of conversations
export const getProfileUsageData = async (): Promise<UsageData | null> => {
    const auth_token = await getAuthToken();
    try {
        const response = await axios.get(
            `${NEXT_PUBLIC_API_URL}profile/usage`,
            {
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const conversations = await getConversationByUser();
        // Group conversations by month
        const conversationsByMonth: Record<string, number> = conversations.reduce((acc: Record<string,number>, conversation) => {
            const month = new Date(conversation.created_at).toISOString().slice(0, 7);
            if (acc[month]) {
                acc[month] += 1;
            } else {
                acc[month] = 1;
            }
            return acc;
        }, {});
        
        // Add total_conversations by month to each profile usage
        const usageWithConversations = response.data.usage.map((usage: ProfileUsage) => {
            const month = new Date(usage.month).toISOString().slice(0, 7);
            return {
                ...usage,
                total_conversations: conversationsByMonth[month] || 0,
            };
        });

        return { usage: usageWithConversations };
    } catch (error) {
        console.error("Error fetching usage data:", error);
        return null;
    }
};