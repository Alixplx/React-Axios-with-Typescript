import type { User } from "../types/user";


interface UserListProps {

    users: User[];
    loading: boolean;
    onDelete: (id: number) => Promise<void>;
    deletingId: number | null;
}

function UserList({ users, loading, onDelete, deletingId}: UserListProps) {

    if (loading) {

        return <p className="status">Loading users...</p>;
    }

    if (users.length === 0) {

        return <p className="status">No users found.</p>;
    }


    return (

        <div className="user-grid">

            {users.map((user) => (

                <article className="user-card" key={user.id}>

                    <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>

                    <div className="user-info">

                        <h3>{user.name}</h3>
                        <p>@{user.username}</p>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                        {user.website && <p>{user.website}</p>}
                    </div>

                    <button type="button" className="delete-button" onClick={() => void onDelete(user.id)} disabled={deletingId === user.id}>
                        {deletingId === user.id ? "Deleting..." : "Delete"}
                    </button>
                </article>
            ))}
        </div>
    )
}

export default UserList;