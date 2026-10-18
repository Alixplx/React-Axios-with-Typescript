export interface User {

    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
  }
  
export interface CreateUserInput {

    name: string;
    username: string;
    email: string;
}
  
export type UpdateUserInput = Partial<CreateUserInput>