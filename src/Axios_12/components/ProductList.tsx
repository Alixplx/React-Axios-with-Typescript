import type { Product } from "../types/product";


interface ProductListProps {

    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    deletingId: number | null;
}


export default function ProductList({products, onEdit, onDelete, deletingId}: ProductListProps) {

    if (products.length === 0) {

        return (
            
            <p className="empty">No products found. Try another search.</p>
        );
    }
  
    return (

        <div className="product-grid">

            {products.map((product) => (

                <article className="product-card" key={product.id}>

                    <img src={product.thumbnail} alt={product.title} loading="lazy"/>
        
                    <div className="product-content">

                        <span className="category">{product.category}</span>
                        <h3>{product.title}</h3>
                        <p className="description">{product.description}</p>
                        <p className="price">${product.price.toFixed(2)}</p>
        
                        <div className="product-actions">

                            <button type="button" className="secondary"onClick={() => onEdit(product)}>Edit</button>
            
                            <button type="button" className="danger" disabled={deletingId === product.id} onClick={() => onDelete(product.id)}>
                                {deletingId === product.id
                                    ? "Deleting..."
                                    : "Delete"
                                }
                            </button>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}