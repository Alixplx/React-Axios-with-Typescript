import { useState } from "react";
import "./style.css"
import type { User } from "./types/user";
import { api } from "./axios";
import type { ApiError } from "./types/apiError";
import axios from "axios";



function Home() {

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const fetchUser = async (id: number) => {

        try {

            setLoading(true);
            setErrorMessage("");
            setUser(null);
        
            const response = await api.get<User>(`/users/${id}`)
            setUser(response.data)

        } catch (error) {

            if (axios.isAxiosError<ApiError>(error)) {

                const status = error.response?.status
        
                if (status === 404) {

                    setErrorMessage("User not found.")

                } else if (status === 500) {

                    setErrorMessage("The server encountered an error.")

                } else if (error.request && !error.response) {

                    setErrorMessage("Could not connect to the server.")

                } else {

                    setErrorMessage(error.response?.data?.message ??"Something went wrong.")
                }

            } else {

                setErrorMessage("An unexpected error occurred.")
            }

        } finally {

            setLoading(false);
        }
    }


    return (

        <div className="app">

            <h1>Axios Error Handling</h1>
        
            <div className="buttons">

                <button onClick={() => fetchUser(1)}>Load User 1</button>
                <button onClick={() => fetchUser(9999)}>Load Invalid User</button>
            </div>
        
            {loading && (

                <p className="loading">Loading...</p>
            )}
        
            {errorMessage && (

                <p className="error">{errorMessage}</p>
            )}
        
            {user && (

                <div className="user-card">
                    
                    <h2>{user.name}</h2>
                    <p>@{user.username}</p>
                    <p>{user.email}</p>
                </div>
            )}
        </div>
    )

}

export default Home