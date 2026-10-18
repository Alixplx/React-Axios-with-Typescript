export interface Product {

  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}
  
export interface ProductsResponse {

  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
  
export interface ProductQuery {

  search: string;
  category: string;
  sortBy: "title" | "price";
  order: "asc" | "desc";
  limit: number;
  skip: number;
}