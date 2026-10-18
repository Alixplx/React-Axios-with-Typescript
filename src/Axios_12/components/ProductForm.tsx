import { useEffect, useState, type SubmitEvent } from "react";
import type { CreateProductInput, Product} from "../types/product";


interface ProductFormProps {

    initialProduct?: Product | null;
    isSaving: boolean;
    onSubmit: (input: CreateProductInput) => Promise<void>;
    onCancelEdit: () => void;
}

const emptyForm: CreateProductInput = {

    title: "",
    description: "",
    price: 0,
    category: "beauty",
}

export default function ProductForm({initialProduct, isSaving, onSubmit, onCancelEdit}: ProductFormProps) {

    const [form, setForm] = useState<CreateProductInput>(emptyForm)
    const [error, setError] = useState("");

    useEffect(() => {

        if (initialProduct) {

            setForm({

                title: initialProduct.title,
                description: initialProduct.description,
                price: initialProduct.price,
                category: initialProduct.category,
            });

        } else {

            setForm(emptyForm);
        }
    
        setError("");

    }, [initialProduct]);

    function handleChange( event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {

        const { name, value } = event.target;
    
        setForm((current) => ({...current,

          [name]: name === "price" ? Number(value) : value
        }));
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {

        event.preventDefault();
    
        if (!form.title.trim()) {
          
            setError("Product title is required.");
            return;
        }
    
        if (!form.description.trim()) {

            setError("Description is required.");
            return;
        }
    
        if (!Number.isFinite(form.price) || form.price <= 0) {

            setError("Price must be greater than zero.");
            return;
        }
    
        if (!form.category.trim()) {

            setError("Category is required.");
            return;
        }
    
        setError("");
    
        try {

            await onSubmit({...form,

                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category.trim(),
            });
        
            if (!initialProduct) {
                setForm(emptyForm);
            }
        } catch {

            // App displays the API error.
        }
    }


    return (

        <form className="product-form" onSubmit={handleSubmit}>

            <h2>{initialProduct ? "Edit Product" : "Add Product"}</h2>
    
            <label htmlFor="title">Title</label>
            <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product title"
                disabled={isSaving}
            />
    
            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={3}
                disabled={isSaving}
            />
    
            <label htmlFor="price">Price ($)</label>
            <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={form.price || ""}
                onChange={handleChange}
                disabled={isSaving}
            />
    
            <label htmlFor="category">Category</label>
            <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. beauty"
                disabled={isSaving}
            />
    
            {error && <p className="error">{error}</p>}
    
            <div className="form-actions">

                <button type="submit" disabled={isSaving}>
                    {isSaving
                    ? "Saving..."
                    : initialProduct
                    ? "Save Changes"
                    : "Create Product"}
                </button>
        
                {initialProduct && ( 
                    <button type="button" className="secondary" onClick={onCancelEdit}disabled={isSaving}>Cancel</button>
                )}
            </div>
        </form>
    );
}