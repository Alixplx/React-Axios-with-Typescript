import "./style.css"
import { useState, type SubmitEvent } from "react";
import axios from "axios";
import { createPost } from "./api/postApi";
import type { CreatePostInput, Post } from "./types/post";


interface FormErrors {

    title?: string;
    body?: string;
    userId?: string;
}
  
  const initialForm: CreatePostInput = {

    title: "",
    body: "",
    userId: 1,
}

function validateForm(form: CreatePostInput): FormErrors {

    const errors: FormErrors = {};
  
    if (!form.title.trim()) {

        errors.title = "Please enter a title."

    } else if (form.title.trim().length < 3) {

        errors.title = "The title must contain at least 3 characters.";
    }
  
    if (!form.body.trim()) {

        errors.body = "Please enter the post content.";

    } else if (form.body.trim().length < 10) {

        errors.body = "The content must contain at least 10 characters.";
    }
  
    if (!Number.isInteger(form.userId) || form.userId < 1) {

        errors.userId = "User ID must be a positive whole number.";
    }
  
    return errors;
}


function Home() {

    const [form, setForm] = useState<CreatePostInput>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createdPost, setCreatedPost] = useState<Post | null>(null);
  
    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

        const { name, value } = event.target;

        setForm((current) => ({...current,
            [name]: name === "userId" ? Number(value) : value,
        }))

        // Clear the error for the field being edited.
        setErrors((current) => ({...current,
            [name]: undefined,
        }));
      
        setErrorMessage("")
        setCreatedPost(null)
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault()

        // Validate before sending the request.
        const validationErrors = validateForm(form);
        setErrors(validationErrors);
        setErrorMessage("");
        setCreatedPost(null);

        if (Object.keys(validationErrors).length > 0) {
        
            return;
        }

        setLoading(true);

        try {

            const result = await createPost({

                title: form.title.trim(),
                body: form.body.trim(),
                userId: form.userId,
            });
      
            setCreatedPost(result)
            setForm(initialForm)
            setErrors({})

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                if (error.response) {

                    setErrorMessage(`The server returned status ${error.response.status}. Please try again.`);

                } else if (error.request) {

                    setErrorMessage("No response received. Check your internet connection.");
                } else {

                    setErrorMessage(error.message);
                }

            } else {

                setErrorMessage("An unexpected error occurred.");
            }

        } finally {

            setLoading(false);
        }
    }

    return (

        <main className="page">

            <section className="form-card">

                <header className="page-header">

                    <p className="eyebrow">AXIOS + REACT + TYPESCRIPT</p>
                    <h1>Create a post</h1>
                    <p>Submit a post to a demo API and inspect the response.</p>
                </header>
        
                <form onSubmit={handleSubmit} noValidate>

                    <div className="field">

                        <label htmlFor="title">Post title</label>
            
                        <input
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter a title"
                            aria-invalid={Boolean(errors.title)}
                            aria-describedby={errors.title ? "title-error" : undefined}
                            disabled={loading}
                        />
            
                        {errors.title && (
                            <p className="field-error" id="title-error">
                                {errors.title}
                            </p>
                        )}
                    </div>
            
                    <div className="field">

                        <label htmlFor="body">Post content</label>
            
                        <textarea
                            id="body"
                            name="body"
                            value={form.body}
                            onChange={handleChange}
                            placeholder="Write your post..."
                            rows={5}
                            aria-invalid={Boolean(errors.body)}
                            aria-describedby={errors.body ? "body-error" : undefined}
                            disabled={loading}
                        />
            
                        {errors.body && (
                            <p className="field-error" id="body-error">
                                {errors.body}
                            </p>
                        )}
                    </div>
            
                    <div className="field">

                        <label htmlFor="userId">User ID</label>
            
                        <input
                            id="userId"
                            name="userId"
                            type="number"
                            min="1"
                            step="1"
                            value={form.userId}
                            onChange={handleChange}
                            aria-invalid={Boolean(errors.userId)}
                            aria-describedby={errors.userId ? "userId-error" : undefined}
                            disabled={loading}
                        />
            
                        {errors.userId && (
                            <p className="field-error" id="userId-error">
                                {errors.userId}
                            </p>
                        )}
                    </div>
        
                    {errorMessage && (

                        <div className="error-banner" role="alert">{errorMessage}</div>
                    )}
            
                    <button className="submit-button" type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Create post"}
                    </button>
                </form>
        
                {createdPost && (

                    <section className="success-card" aria-live="polite">

                        <h2>Post created successfully!</h2>
                        <p><strong>ID:</strong> {createdPost.id}</p>
                        <p><strong>Title:</strong> {createdPost.title}</p>
                        <p><strong>Content:</strong> {createdPost.body}</p>
                        <p><strong>User ID:</strong> {createdPost.userId}</p>
                        <p className="demo-note">This is a simulated creation response. JSONPlaceholderdoes not permanently save this post.</p>
                    </section>
                )}
            </section>
        </main>
    );

}

export default Home