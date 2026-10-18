import axios from "axios";


// This is our central Axios client
// export const api = axios.create({

//     baseURL: "https://jsonplaceholder.typicode.com",
//     timeout: 5000,
//     headers: {

//         "Content-Type": "application/json"
//     }
// })


// We can create multiple instane
export const authApi = axios.create({

    baseURL: "https://auth.example.com",
    timeout: 5000,
})



export const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        
        "Content-Type": "application/json",
    },
});