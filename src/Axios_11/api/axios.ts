import axios from "axios"


const api = axios.create({

    baseURL: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
    headers: {

        Accept: "application/json",
    },
})

export default api