import api from "./axios";
import type { User } from "../types/user";


export async function getUsers(signal?: AbortSignal): Promise<User[]> {

    const response = await api.get<User[]>("/users", {
        
        signal,
    });

    return response.data;
}