import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { getCategories, getProducts } from "./api/productApi";
import type { Product } from "./types/product";


const PAGE_SIZE = 8

function Home() {

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState<"title" | "price">("title");
    const [order, setOrder] = useState<"asc" | "desc">("asc");

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    

    // Load categories once.
    useEffect(() => {

        const controller = new AbortController()

        async function loadCategories() {

            try {

                const result = await getCategories(controller.signal);
                
                if (!controller.signal.aborted) {

                    setCategories(result);
                }

            } catch (error) {

                if (controller.signal.aborted) return;

                console.error("Could not load categories:", error);
            }
        }

        // This request uses its own signal.
        // See the complete cancellation version below.
        loadCategories();

        return () => controller.abort()

    }, []);


    // Fetch products whenever a query value changes.
    useEffect(() => {

        const controller = new AbortController();
    
        async function loadProducts() {

            setLoading(true);
            setError("");
    
            try {

                const result = await getProducts(
                {
                    search,
                    category,
                    sortBy,
                    order,
                    limit: PAGE_SIZE,
                    skip: (page - 1) * PAGE_SIZE,
                },
                controller.signal
                );
        
                if (!controller.signal.aborted) {

                    setProducts(result.products);
                    setTotal(result.total);
                }

            } catch (error: unknown) {

                if (controller.signal.aborted) return;
        
                if (axios.isAxiosError(error)) {

                    setError(error.response?.data?.message ??error.message ?? "Unable to load products.");

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
    
        return () => controller.abort();

    }, [search, category, sortBy, order, page]);


    const totalPages = Math.ceil(total / PAGE_SIZE);

    function handleSearch(value: string) {

        setSearch(value);
        setCategory("");
        setPage(1);
    }
    
    function handleCategory(value: string) {

        setCategory(value);
        setSearch("");
        setPage(1);
    }
    
    function handleSortBy(value: "title" | "price") {

        setSortBy(value);
        setPage(1);
    }
    
    function handleOrder(value: "asc" | "desc") {

        setOrder(value);
        setPage(1);
    }


    return (

        <main className="container">

            <header className="page-header">

                <p className="eyebrow">AXIOS + REACT + TYPESCRIPT</p>
                <h1>Product Explorer</h1>
                <p className="subtitle">Search, filter, sort, and paginate products from an API.</p>
            </header>
    
            <section className="toolbar" aria-label="Product controls">

                <label className="field search-field">
                    <span>Search products</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => handleSearch(event.target.value)}
                        placeholder="Try phone or laptop..."
                    />
                </label>
        
                <label className="field">
                    <span>Category</span>
                    <select value={category} onChange={(event) => handleCategory(event.target.value)}>
                        <option value="">All categories</option>
            
                        {categories.map((item) => (

                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>
        
                <label className="field">
                    <span>Sort by</span>
                    <select value={sortBy} onChange={(event) => handleSortBy(event.target.value as "title" | "price")}>
                        
                        <option value="title">Title</option>
                        <option value="price">Price</option>
                    </select>
                </label>
        
                <label className="field">

                    <span>Order</span>
                    <select value={order} onChange={(event) => handleOrder(event.target.value as "asc" | "desc")}>

                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </section>
    
          <div className="results-bar">

            <p>
              {loading
                ? "Loading products..."
                : `${total} products found`}
            </p>
    
            <p>{total > 0 ? `Page ${page} of ${totalPages}` : ""}</p>
          </div>
    
          {loading && (
            <div className="status" role="status">
              Loading products...
            </div>
          )}
    
          {!loading && error && (
            <div className="error-box" role="alert">
              <p>{error}</p>
              <button type="button" onClick={() => setPage((current) => current)}>Retry</button>
            </div>
          )}
    
          {!loading && !error && products.length === 0 && (
            <div className="status">
              No products found. Try another search or category.
            </div>
          )}
    
          {!loading && !error && products.length > 0 && (
            <>
              <section className="product-grid" aria-label="Products">
                {products.map((product) => (
                  <article className="product-card" key={product.id}>

                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                    />
    
                    <div className="product-content">
                        
                        <p className="category-label">{product.category}</p>
                        <h2>{product.title}</h2>
                        <p className="description">{product.description}</p>
                        <p className="price">${product.price.toFixed(2)}</p>
                    </div>
                  </article>
                ))}
              </section>
    
              <nav className="pagination" aria-label="Pagination">

                <button type="button" disabled={page <= 1 || loading}onClick={() => setPage((current) => current - 1)}>Previous</button>
                <span>Page {page} / {totalPages}</span>
                <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)}>Next</button>
              </nav>
            </>
          )}
        </main>
    );

}

export default Home