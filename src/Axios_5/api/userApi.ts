import { api } from "./axios";
import type { User } from "../types/user"


export const getUsers = async (signal?: AbortSignal): Promise<User[]> => {

    const response = await api.get<User[]>("/users", {

        signal
    });

    return response.data;
}

export const getUser = async (id: number): Promise<User> => {

    const response = await api.get<User>(`/users/${id}`);

    return response.data;
}

/*
    We add : signal?: AbortSignal becasue
    Imagine the user navigates away while the request is still running. We can use AbortController to cancel the request.
*/