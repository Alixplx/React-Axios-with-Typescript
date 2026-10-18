export interface Product {

    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
}
  
export interface CreateProductInput {

    title: string;
    description: string;
    price: number;
    category: string;
}
  
export type UpdateProductInput = Partial<CreateProductInput>
  
export interface ProductsResponse {
    
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}