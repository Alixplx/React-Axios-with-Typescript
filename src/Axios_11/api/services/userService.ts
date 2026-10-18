import api from "../axios";
import type { CreateUserInput, UpdateUserInput, User} from "../../types/user";


export const userService = {

    async getAll(signal?: AbortSignal): Promise<User[]> {

        const response = await api.get<User[]>("/users", {
        
            signal,
        });

        return response.data;
    },

    async getById(id: number): Promise<User> {

        const response = await api.get<User>(`/users/${id}`);

        return response.data;
    },

    async create(input: CreateUserInput): Promise<User> {

        const response = await api.post<User>("/users", input);

        return response.data;
    },

    async update(id: number, input: UpdateUserInput): Promise<User> {

        const response = await api.patch<User>(`/users/${id}`, input)   

        return response.data;
    },

    async remove(id: number): Promise<void> {
        
        await api.delete(`/users/${id}`);
    },
};