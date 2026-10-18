import api from "./axios";
import type { ProductSearchResponse } from "../types/product";


export async function searchProducts(query: string, signal: AbortSignal): Promise<ProductSearchResponse> {

    const response = await api.get<ProductSearchResponse>("/products/search", {

        params: {q: query,limit: 12 }, signal}
    )

    return response.data;
}