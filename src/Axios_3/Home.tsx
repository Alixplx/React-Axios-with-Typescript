import { useEffect, useState } from "react";
import "./style.css"
import type { User } from "./type";
import { getUsers } from "./userApi";



function Home() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {

        const loadUsers = async () => {

            try {

                setLoading(true);
                const users = await getUsers()
                setUsers(users)

            } catch (error) {

                console.error(error)

            } finally {

                setLoading(false);
            }
        }
      
        loadUsers()

    }, [])
    

    return (

        <div className="app">

            <h1>Users</h1>

            {loading && <p>Loading...</p>}

            <div className="users">

                {users.map((user) => (

                    <article className="user-card" key={user.id}>

                        <h2>{user.name}</h2>
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default Home