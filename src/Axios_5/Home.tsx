import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "./types/user";
import { getUsers } from "./api/userApi";



function Home() {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {

        const controller = new AbortController();

        const fetchUsers = async () => {

            try {

                setLoading(true);
                setError(null);
        
                const data = await getUsers(controller.signal);
                setUsers(data)

            } catch (error: unknown) {

                if (controller.signal.aborted) return

                if (axios.isAxiosError(error)) {

                    setError( error.response?.status === 404 ? "Users were not found." : error.response ? 
                        "The server returned an error." : "Unable to connect to the server."
                    )

                } else {

                    setError("An unexpected error occurred.");
                }

            } finally {

                if (!controller.signal.aborted) {

                    setLoading(false);
                }
            }
        };
    
        fetchUsers()

        return () => {
            
            controller.abort();
        }

    }, [])


    return (
        
        <main className="app">

            <header className="page-header">

                <p className="eyebrow">AXIOS + REACT</p>
                <h1>User Dashboard</h1>
                <p className="subtitle">Fetch and display users from an API.</p>
            </header>
    
          {loading && (

            <p className="status" role="status">Loading users...</p>
          )}
    
          {!loading && error && (

            <div className="error-box" role="alert">

                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reload page</button>
            </div>
          )}
    
          {!loading && !error && (

            <>

              <p className="result-count">{users.length} users loaded</p>
    
              <section className="user-grid">

                {users.map((user) => (

                    <article className="user-card" key={user.id}>

                        <div className="avatar">{user.name.charAt(0)}</div>
        
                            <h2>{user.name}</h2>
                            <p className="username">@{user.username}</p>
                        <div className="user-details">
                            
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p>{user.website}</p>
                        </div>
                    </article>
                ))}
              </section>
            </>
          )}
        </main>
    );

}


export default Home