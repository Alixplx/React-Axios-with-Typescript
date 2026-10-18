import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { searchProducts } from "./api/productApi";
import type { Product } from "./types/product";




function Home() {

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const query = search.trim()

        const controller = new AbortController();

        async function loadProducts() {

            setLoading(true);
            setError("");
      
            try {

                const result = await searchProducts(query, controller.signal);
        
                // Only use results if this request is still active.
                if (!controller.signal.aborted) {

                    setProducts(result.products);
                }

            } catch (error: unknown) {

                // Cancellation is expected when the search changes.
                if (controller.signal.aborted || axios.isCancel(error)) {

                    return;
                }
        
                if (axios.isAxiosError(error)) {

                    setError(error.response?.data?.message ?? error.message ??"Unable to search products.");

                } else {

                    setError("An unexpected error occurred.");
                }

            } finally {

                if (!controller.signal.aborted) {

                    setLoading(false);
                }
            }
        }
      
        loadProducts();
    
        // Runs when the search changes or the component unmounts.
        return () => {

            controller.abort();
        };


    }, [search])


    return (

        <main className="container">

            <header className="page-header">

                <p className="eyebrow">AXIOS + REACT + TYPESCRIPT</p>
                <h1>Product Search</h1>
                <p className="subtitle">Search products while canceling outdated requests.</p>
            </header>
    
            <label className="search-field">

                <span>Search products</span>
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Try phone, laptop, or perfume..."
                />
            </label>
    
            <section className="results-area">

                {loading && (

                    <p className="status" role="status">Searching...</p>
                )}
        
                {!loading && error && (

                    <p className="error-message" role="alert">{error}</p>
                )}
        
                {!loading && !error && !search.trim() && (

                    <p className="status">Type something to search for products.</p>
                )}
        
                {!loading && !error && search.trim() && products.length === 0 && (

                    <p className="status">No products found.</p>
                )}
        
                {!loading && !error && products.length > 0 && (

                    <>
                        <p className="result-count">Showing {products.length} matching products</p>
            
                        <section className="product-grid">

                            {products.map((product) => (

                                <article className="product-card" key={product.id}>

                                    <img src={product.thumbnail} alt={product.title} loading="lazy"/>
                    
                                    <div className="product-content">
                                        
                                        <h2>{product.title}</h2>
                                        <p>{product.description}</p>
                                        <strong>${product.price.toFixed(2)}</strong>
                                    </div>
                                </article>
                            ))}
                        </section>
                    </>
                )}
            </section>
        </main>
    );

}

export default Home