import { useEffect, useState } from "react";
import "./style.css"
import type { User } from "./type";
import { api } from "./api";



function Home() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const fetchUsers = async () => {

            try {
                
                setLoading(true)

                const response = await api.get<User[]>("/users")

                setUsers(response.data)

            } catch (error) {
                
                console.error(error)

            } finally {

                setLoading(false)
            }
        }

        fetchUsers()

    }, [])


    return (

        <div className="app">

            <h1>Axios Configuration</h1>
        
            {loading ? (

                <p>Loading...</p>
                ) : (

                <div className="users">
                    {users.map((user) => (
                        <article className="user-card" key={user.id}>

                            <h2>{user.name}</h2>
                            <p>Username: {user.username}</p>
                            <p>{user.email}</p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );

}

export default Home