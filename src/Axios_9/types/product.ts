export interface Product {

    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
}
  
export interface ProductSearchResponse {
    
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}