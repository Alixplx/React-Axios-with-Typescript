import axios from "axios";

const api = axios.create({

    baseURL: "https://dummyjson.com",
    timeout: 10000,
    headers: {

        Accept: "application/json",
        "Content-Type": "application/json",
    },
})

// Request interceptor
api.interceptors.request.use((config) => {

    console.log(`[Axios] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },

  (error: unknown) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use((response) => {

    console.log(`[Axios] Response status: ${response.status}`);

    return response;
  },

  (error: unknown) => Promise.reject(error)
);


export default api;