import "./style.css"
import { useCallback, useEffect, useState } from "react";
import { productService, getErrorMessage } from "./api/productService";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import type { Product, CreateProductInput} from "./types/product";


const PAGE_SIZE = 12;


function Home() {

    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Debounce search input to avoid sending a request
    // for every single keystroke.
    useEffect(() => {
        
        const timer = setTimeout(() => {

            setDebouncedQuery(query.trim());
            setPage(0)

        }, 350)

        return () => clearTimeout(timer)

    }, [query]);

    const loadProducts = useCallback( async (signal: AbortSignal) => {

        setLoading(true);
        setError("");

        try {

            const result = debouncedQuery ? await productService.search(
                debouncedQuery,
                PAGE_SIZE,
                page * PAGE_SIZE,
                signal

            ) : await productService.getAll( PAGE_SIZE, page * PAGE_SIZE, signal);

            setProducts(result.products);
            setTotal(result.total);

        } catch (err: unknown) {

            if (signal.aborted) return;

            setError(getErrorMessage(err));

        } finally {

            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [debouncedQuery, page]);

    useEffect(() => {

        const controller = new AbortController();
    
        void loadProducts(controller.signal);
    
        return () => controller.abort()

    }, [loadProducts]);

    async function handleCreateOrUpdate(input: CreateProductInput) {

        setSaving(true);
        setError("");
        setNotice("");
    
        try {

            if (editingProduct) {

                const updated = await productService.update( editingProduct.id, input);
        
                setProducts((current) =>
                    current.map((product) =>
                        product.id === updated.id
                        ? { ...product, ...updated }
                        : product
                    )
                );
        
                setEditingProduct(null);
                setNotice("Product updated successfully.");

            } else {

                const created = await productService.create(input);
        
                // Add the simulated response to the visible list.
                setProducts((current) => [created, ...current]);
                setTotal((current) => current + 1);
                setNotice("Product created successfully.");
            }

        } catch (err: unknown) {

            const message = getErrorMessage(err);
            setError(message);
            throw err;

        } finally {

            setSaving(false);
        }
    }

    async function handleDelete(id: number) {

        const confirmed = window.confirm("Are you sure you want to delete this product?");
    
        if (!confirmed) return;
    
        setDeletingId(id);
        setError("");
        setNotice("");
    
        try {

            await productService.remove(id);
        
            setProducts((current) => current.filter((product) => product.id !== id))
        
            setTotal((current) => Math.max(0, current - 1));
            setNotice("Product deleted successfully.");

        } catch (err: unknown) {

            setError(getErrorMessage(err));

        } finally {

            setDeletingId(null);
        }
    }

    const totalPages = Math.ceil(total / PAGE_SIZE)

    return (

        <main className="dashboard">

            <header className="page-header">

                <div>
                    <p className="eyebrow">AXIOS FINAL PROJECT</p>
                    <h1>Product Dashboard</h1>
                    <p className="subtitle">Manage products using React, TypeScript, and Axios.</p>
                </div>
        
                <div className="total-badge">
                {total} products
                </div>
            </header>
    
          <section className="toolbar">

            <label className="search-label" htmlFor="search">Search products</label>
    
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product name..."
            />
          </section>
    
          <section className="workspace">

            <aside>
              <ProductForm
                initialProduct={editingProduct}
                isSaving={saving}
                onSubmit={handleCreateOrUpdate}
                onCancelEdit={() => setEditingProduct(null)}
              />
            </aside>
    
            <section className="results">
              <div className="results-header">

                <h2>{debouncedQuery ? "Search Results" : "All Products"}</h2>
    
                <span>Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</span>
              </div>
    
              {error && (
                <div className="message error-message">
                  {error}
                </div>
              )}
    
              {notice && (
                <div className="message success-message">
                  {notice}
                </div>
              )}
    
              {loading ? (
                <p className="status">Loading products...</p>
              ) : (
                <ProductList
                  products={products}
                  onEdit={setEditingProduct}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              )}
    
              <nav className="pagination" aria-label="Product pages">

                <button type="button" className="secondary" disabled={loading || page === 0} onClick={() => setPage((current) => current - 1)}>
                  Previous
                </button>
    
                <button type="button" className="secondary" disabled={ loading || page + 1 >= totalPages || products.length === 0}
                        onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </nav>
            </section>
          </section>
        </main>
    );

}

export default Home