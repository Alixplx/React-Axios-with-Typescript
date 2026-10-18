import api from "./axios";
import type { ProductQuery, ProductsResponse} from "../types/product";



export async function getProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductsResponse> {

    const endpoint = query.category
    ? `/products/category/${encodeURIComponent(query.category)}`
    : query.search.trim()
      ? "/products/search"
    : "/products";


    const params: Record<string, string | number> = {

        limit: query.limit,
        skip: query.skip,
        sortBy: query.sortBy,
        order: query.order,
    }

    if (query.search.trim() && !query.category) {

        params.q = query.search.trim();
    }
    
    const response = await api.get<ProductsResponse>( endpoint, {
        params,
        signal,
    })
    
    return response.data;
}


export async function getCategories(signal?: AbortSignal): Promise<string[]> {

    const response = await api.get<string[]>("/products/category-list", {
        
        signal 
    });
  
    return response.data;
}