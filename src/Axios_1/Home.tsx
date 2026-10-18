import { useEffect, useState, type SubmitEvent } from "react";
import "./style.css"
import type { User } from "./types";
import axios from "axios";


const API_URL = "https://jsonplaceholder.typicode.com/users"

function Home() {

    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);


    // POST
    const createUser = async (event: SubmitEvent<HTMLFormElement>) => {

        event.preventDefault();

        try {
            
            const response = await axios.post(API_URL, {
                name, 
                email,
                username: name.toLowerCase().replace(" ", ""),
            })

            setUsers((currUsers) => [...currUsers, response.data])
            setName("")
            setEmail("")
            
        } catch (error) {
            
            console.error("Failed to create user:", error);
        }
    }

    // PUT
    const updateUser = async (id: number) => {

        try {
            
            const response = await axios.put<User>(`${API_URL}/${id}`, {

                name: "Updated Name",
                email: "updated Email",
                username: "updated Username",
            })

            setUsers((currUsers) => currUsers.map((user) => user.id === id ? response.data : user))

        } catch (error) {
            
            console.error("Failed to update user:", error);
        }
    }

    // PATCH
    const updateUserName = async (id: number) => {

        try {
            
            const response = await axios.patch<User>(`${API_URL}/${id}`, { 
                name: "Partially Updated"
            })

            setUsers((currUsers) => currUsers.map((user) => user.id === id ? {...user ,...response.data} : user))

            
        } catch (error) {
            
            console.error("Failed to update user:", error);
        }
    }

    // DELETE
    const deleteUser = async (id: number) => {

        try {
            
            await axios.delete(`${API_URL}/${id}`)

            setUsers((currUsers) => currUsers.filter((user) => user.id !== id))

        } catch (error) {
            
            console.error("Failed to delete user:", error);
        }
    }


    useEffect(() => {

        // GET
        const fetchUsers = async () => {

            try {
                
                const response = await axios.get<User[]>(API_URL)
                setUsers(response.data)

            } catch (error) {
                
                console.error("Failed to fetch users:", error)

            } finally {

                setLoading(false);
            }
        }

        fetchUsers()

    }, [])

    
    return (

        <div className="app">

            <h1>Axios CRUD Example</h1>
    
            <form onSubmit={createUser} className="form">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
        
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
        
                <button type="submit">Create User</button>
            </form>
    
            {loading ? (

                <p>Loading users...</p>

            ) : (

                <div className="users">

                    {users.map((user) => (

                        <div className="user-card" key={user.id}>
                            <h2>{user.name}</h2>
                
                            <p>{user.email}</p>
            
                            <div className="actions">

                                <button onClick={() => updateUser(user.id)}>PUT</button>
                                <button onClick={() => updateUserName(user.id)}>PATCH</button>
                                <button onClick={() => deleteUser(user.id)}>DELETE</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home;