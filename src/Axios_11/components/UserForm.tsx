import { useState, type SubmitEvent } from "react";
import type { CreateUserInput } from "../types/user";


interface UserFormProps {

    onCreate: (input: CreateUserInput) => Promise<void>;
    loading: boolean;
}

const initialForm: CreateUserInput = {

    name: "",
    username: "",
    email: "",
}


function UserForm({ onCreate, loading }: UserFormProps) {

    const [form, setForm] = useState<CreateUserInput>(initialForm);
    const [validationError, setValidationError] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target
        setForm((current) => ({...current, [name]: value}));
        setValidationError("");
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault()
    
        if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {

            setValidationError("Please complete all fields.")
            return
        }
    
        if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {

            setValidationError("Please enter a valid email address.");
            return;
        }
    
        try {

            await onCreate({ name: form.name.trim(), username: form.username.trim(), email: form.email.trim()});
            setForm(initialForm);
            setValidationError("");

        } catch {
          // The parent handles and displays API errors.
          // Keep the form values so the user can try again.
        }
    }


    return (

        <form className="user-form" onSubmit={handleSubmit}>

          <label>

            Full name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ali Nasri"
              disabled={loading}
            />
          </label>
    
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. alin"
              disabled={loading}
            />
          </label>
    
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. ali@example.com"
              disabled={loading}
            />
          </label>
    
          {validationError && (

            <p className="error-message" role="alert">
              {validationError}
            </p>
          )}
    
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create user"}</button>
        </form>
  );
}

export default UserForm;