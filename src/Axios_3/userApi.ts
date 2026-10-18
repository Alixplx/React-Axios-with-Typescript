import { api } from "./api";
import type { CreateUser, User } from "./type";



export const getUsers = async (): Promise<User[]> => {

    const response = await api.get<User[]>("/users")
  
    return response.data
}


export const getUser = async (id: number): Promise<User> => {

    const response = await api.get<User>(`/users/${id}`)
  
    return response.data
}

export const createUser = async (user: CreateUser): Promise<User> => {

    const response = await api.post<User>("/users", user)
  
    return response.data
}

export const deleteUser = async (id: number): Promise<void> => {

    await api.delete(`/users/${id}`)
};