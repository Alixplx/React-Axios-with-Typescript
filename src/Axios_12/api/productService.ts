import axios from "axios";
import api from "./axios";
import type { Product, CreateProductInput, UpdateProductInput, ProductsResponse} from "../types/product";


export const productService = {

    async getAll(limit = 12, skip = 0, signal?: AbortSignal): Promise<ProductsResponse> {

        const response = await api.get<ProductsResponse>("/products", {

            params: { limit, skip },
            signal,
        });

        return response.data;
    },

    async search(query: string, limit = 12, skip = 0, signal?: AbortSignal): Promise<ProductsResponse> {
        
        const response = await api.get<ProductsResponse>("/products/search", {

            params: { q: query, limit, skip },
            signal,
        });

        return response.data;
    },

    async getById(id: number): Promise<Product> {

        const response = await api.get<Product>(`/products/${id}`)

        return response.data
    },

    async create(input: CreateProductInput): Promise<Product> {

        const response = await api.post<Product>("/products/add", input);

        return response.data;
    },

    async update(id: number, input: UpdateProductInput): Promise<Product> {

        const response = await api.patch<Product>(`/products/${id}`, input);

        return response.data;
    },

    async remove(id: number): Promise<void> {

        await api.delete(`/products/${id}`);
    },

    async getCategories(signal?: AbortSignal): Promise<string[]> {

        const response = await api.get<string[]>("/products/category-list", { 

            signal 
        });

        return response.data;
    },
};


// Reusable error message helper
export function getErrorMessage(error: unknown): string {

    if (axios.isAxiosError(error)) {

        return ( error.response?.data?.message ?? error.message ??"An API error occurred.");
    }

    if (error instanceof Error) {
        
        return error.message;
    }

    return "An unexpected error occurred.";
}