import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { userService } from "./api/services/userService";
import UserList from "./components/UserList";
import type { CreateUserInput, User } from "./types/user";
import UserForm from "./components/UserForm";



function Home() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {

        const controller = new AbortController()
    
        async function loadUsers() {

            setLoading(true);
            setError("");
    
            try {

                const result = await userService.getAll(controller.signal);
        
                if (!controller.signal.aborted) {
                
                    setUsers(result);
                }

            } catch (error: unknown) {

                if (controller.signal.aborted) return;
        
                if (axios.isAxiosError(error)) {

                    setError(error.response ? `Unable to load users (${error.response.status}).` : "Could not connect to the server.");

                } else {

                    setError("An unexpected error occurred.")
                }

            } finally {

                if (!controller.signal.aborted) {
                
                    setLoading(false);
                }
            }
        }
    
        loadUsers();
    
        return () => controller.abort()

    }, []);
    
    async function handleCreate(input: CreateUserInput): Promise<void> {

        setCreating(true);
        setError("");
        setSuccess("");
    
        try {

            const newUser = await userService.create(input);
        
            setUsers((current) => [newUser, ...current]);
            setSuccess(`Created "${newUser.name}" successfully.`);

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                setError(error.response ? `Could not create user (${error.response.status}).` : "Could not connect to the server.");

            } else {

                setError("An unexpected error occurred.");
            }
        
            // Re-throw so UserForm knows the operation failed
            // and doesn't clear the user's input.
            throw error;

        } finally {

            setCreating(false);
        }
    }

    async function handleDelete(id: number): Promise<void> {

        setDeletingId(id);
        setError("");
        setSuccess("");
    
        try {

            await userService.remove(id);
        
            setUsers((current) => current.filter((user) => user.id !== id));
            setSuccess("User deleted successfully.");

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                setError( error.response ? `Could not delete user (${error.response.status}).` : "Could not connect to the server.");

            } else {

                setError("An unexpected error occurred.");
            }
        
            throw error;

        } finally {
          
            setDeletingId(null);
        }
    }

    return (

        <main className="container">

            <header className="page-header">

                <p className="eyebrow">REACT + TYPESCRIPT + AXIOS</p>
                <h1>User Management</h1>
                <p className="subtitle">A service-layer example with reusable API operations.</p>
            </header>
    
          <section className="panel">

            <h2>Create a user</h2>
            <UserForm onCreate={handleCreate} loading={creating} />
          </section>
    
          {error && (

            <div className="alert-error" role="alert">
              {error}
            </div>
          )}
    
          {success && (

            <div className="alert-success" role="status">
              {success}
            </div>
          )}
    
          <section className="users-section">
            
            <div className="section-heading">
              <h2>Users</h2>
              <span>{users.length} users</span>
            </div>
    
            <UserList
              users={users}
              loading={loading}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </section>
    
          <p className="demo-note">
            JSONPlaceholder simulates create and delete operations.
            Changes are not permanently saved on its server.
          </p>
        </main>
    )
}


export default Home