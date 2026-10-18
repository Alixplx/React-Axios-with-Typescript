import axios from "axios";



const api = axios.create({

    baseURL: "https://dummyjson.com",
    timeout: 10000,
    headers: {

        Accept: "application/json",
    },
});

// Keep the access token in memory for this demo.
let accessToken: string | null = null


export function setAccessToken(token: string | null) {

    accessToken = token;
}

api.interceptors.request.use((config) => {

    if (accessToken) {

        config.headers.set("Authorization", `Bearer ${accessToken}`);

    } else {

        config.headers.delete("Authorization");
    }

    return config;

    }, (error: unknown) => Promise.reject(error)
);


export default api