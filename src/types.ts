export interface User {
  id: number;
  username: string;
  token: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
}