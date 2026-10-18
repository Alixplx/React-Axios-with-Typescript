import axios from "axios"


interface ApiError {

    message: string;
}

export const getErrorMessage = (error: unknown): string => {

    if (axios.isAxiosError<ApiError>(error)) {

        if (error.response?.status === 404) {

            return "Resource not found.";
        }

        if (error.response?.status === 401) {

            return "You are not authorized.";
        }

        if (error.response?.status === 403) {

            return "You do not have permission.";
        }

        if (error.response?.status === 500) {

            return "Server error.";
        }

        if (error.request && !error.response) {

            return "Unable to connect to the server.";
        }

        return (error.response?.data?.message ??"Something went wrong.")
    }

    
    return "An unexpected error occurred."
}