import axios from "axios";

const api = axios.create({

    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
    headers: {

        Accept: "application/json",
    },
});

// Request interceptor
api.interceptors.request.use((config) => {

    config.headers.set("X-App-Name", "ReactUserDashboard");

    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);

    return config;

}, (error: unknown) => {

    console.error("[Request interceptor error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use((response) => {

    console.log(`[Response] ${response.status} ${response.config.url}`);

    return response;

}, (error: unknown) => {

    if (axios.isAxiosError(error)) {

        const status = error.response?.status;

        if (status === 401) {

            console.error("Authentication is required.");

        } else if (status === 403) {

            console.error("You do not have permission.");

        } else if (status === 404) {

            console.error("The requested resource was not found.");

        } else if (status && status >= 500) {

            console.error("The server encountered an error.");

        } else if (!error.response) {

            console.error("No HTTP response received.");

        } else {

            console.error("Request failed:", error.message);
        }
        
    } else {

        console.error("Unexpected request error:", error);
    }

    return Promise.reject(error);
  }
)

export default api;