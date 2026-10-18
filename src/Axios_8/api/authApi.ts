import api from "./axios";
import type { AuthResponse, LoginCredentials, UserProfile} from "../types/auth"


export async function login(credentials: LoginCredentials): Promise<AuthResponse> {

    const response = await api.post<AuthResponse>("/auth/login", credentials)
    return response.data
}

export async function getCurrentUser(signal?: AbortSignal): Promise<UserProfile> {

    const response = await api.get<UserProfile>("/auth/me", { 
        signal
    });

    return response.data;
}