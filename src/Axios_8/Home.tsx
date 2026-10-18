import { useState, type SubmitEvent } from "react";
import axios from "axios";
import { setAccessToken } from "./api/axios";
import { getCurrentUser, login } from "./api/authApi";
import type { UserProfile } from "./types/auth";
import "./style.css";



function Home() {

    const [username, setUsername] = useState("emilys");
    const [password, setPassword] = useState("emilyspass");
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault();

        setLoading(true);
        setError("");
        setUser(null);
        setAccessToken(null);

        try {

            // 1. Authenticate with the backend.
            const authData = await login({ username, password });
      
            // 2. Save the access token in memory.
            setAccessToken(authData.accessToken);
      
            // 3. Request the protected profile.
            const profile = await getCurrentUser();
      
            setUser(profile);

        } catch (error: unknown) {

            // Remove a token if authentication or profile loading fails.
            setAccessToken(null);
            setUser(null);

            if (axios.isAxiosError(error)) {
                
                if (error.response?.status === 401) {
                
                    setError("Login failed or your session is no longer valid.");

                } else if (error.response) {
                
                    setError(`The server returned an error: ${error.response.status}`);

                } else if (error.request) {
                
                    setError("No response received. Check your internet connection.");

                } else {
                
                    setError(error.message);
                }

            } else {

                setError("An unexpected error occurred.");
            }

        } finally {
        
            setLoading(false);
        }
    }

    function handleLogout() {

        setAccessToken(null);
        setUser(null);
        setError("");
        setPassword("");
    }



    return (

        <main className="auth-page">

            <section className="auth-card">

                <p className="eyebrow">REACT + AXIOS + TYPESCRIPT</p>
                <h1>{user ? "Your profile" : "Welcome back"}</h1>
        
                {!user ? (
                <>
                    <p className="intro">Sign in to retrieve your protected profile.</p>
        
                    <form onSubmit={handleLogin} className="auth-form">
                        <label> Username

                            <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            required
                            />
                        </label>
        
                        <label> Password
                            <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            required
                            />
                        </label>
        
                        {error && (

                            <p className="error-message" role="alert">{error}</p>
                        )}
        
                        <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
                    </form>
        
                    <p className="demo-note">Demo credentials are prefilled for practice.</p>
                </>
                ) : (

                    <div className="profile">

                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="profile-image"/>
                        <h2>{user.firstName} {user.lastName}</h2>
            
                        <p className="username">@{user.username}</p>
                        <p>{user.email}</p>
            
                        <div className="success-note">

                            <span aria-hidden="true">✓</span>
                            Protected profile loaded successfully
                        </div>
            
                        <button type="button" className="secondary-button" onClick={async () => {

                            setLoading(true);
                            setError("");
            
                            try {

                                const profile = await getCurrentUser();
                                setUser(profile);

                            } catch (error: unknown) {

                                if ( axios.isAxiosError(error) && error.response?.status === 401) {

                                    setAccessToken(null);
                                    setUser(null);
                                    setError("Your session expired. Please sign in again.");

                                } else {

                                    setError("Unable to refresh your profile.");
                                }

                            } finally {

                                setLoading(false);
                            }
                            }}  
                            disabled={loading}>
                            {loading ? "Refreshing..." : "Refresh profile"}
                        </button>
            
                        {error && (

                            <p className="error-message" role="alert">{error}</p>
                        )}
            
                        <button type="button" className="logout-button" onClick={handleLogout}>Log out</button>
                    </div>
                )}
            </section>
        </main>
    )
}


export default Home