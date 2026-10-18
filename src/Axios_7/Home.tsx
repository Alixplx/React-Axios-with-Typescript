import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { getUsers } from "./api/userApi";
import type { User } from "./types/user";



function Home() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);


    useEffect(() => {

        const controller = new AbortController();
    
        async function loadUsers() {

            setLoading(true);
            setError("");
    
            try {

                const data = await getUsers(controller.signal);
        
                if (!controller.signal.aborted) {

                    setUsers(data);
                }

            } catch (error: unknown) {

                if (controller.signal.aborted) return;
        
                if (axios.isAxiosError(error)) {

                    if (error.response) {

                        setError(`Server error: ${error.response.status}`);
                    } else if (error.request) {

                        setError("No response received. Check your network connection.");
                    } else {

                        setError(error.message);
                    }
                } else {

                    setError("An unexpected error occurred.");
                }

            } finally {

                if (!controller.signal.aborted) {
                
                    setLoading(false);
                }
            }
        }
    
        loadUsers();
    
        return () => controller.abort()

    }, [retryCount]);



    return (

        <main className="dashboard">

            <header className="dashboard-header">
                <div>

                    <p className="eyebrow">AXIOS + TYPESCRIPT</p>
                    <h1>User Dashboard</h1>
                    <p className="subtitle">A practical example of request and response interceptors.</p>
                </div>
        
                <button type="button" className="refresh-button" onClick={() => setRetryCount((count) => count + 1)} disabled={loading}>Refresh users</button>
            </header>
    
          {loading && (

            <p className="status" role="status">Loading users...</p>
          )}
    
          {!loading && error && (

            <section className="error-card" role="alert">

                <h2>Could not load users</h2>
                <p>{error}</p>
                <button type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button>
            </section>
          )}
    
          {!loading && !error && (
            <>

              <p className="result-count">{users.length} users loaded</p>
    
              <section className="user-grid">

                {users.map((user) => (

                    <article className="user-card" key={user.id}>

                        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        
                        <div className="user-info">

                            <h2>{user.name}</h2>
                            <p className="username">@{user.username}</p>
                            <a href={`mailto:${user.email}`}>{user.email}</a>
                            <p className="website">{user.website}</p>
                        </div>
                    </article>
                ))}
              </section>
            </>
          )}
        </main>
    )
}


export default Home