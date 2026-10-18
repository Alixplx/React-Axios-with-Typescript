export interface LoginCredentials {

    username: string;
    password: string;
}

export interface AuthResponse {

    accessToken: string;
    refreshToken: string;
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
}

export interface UserProfile {

    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
}