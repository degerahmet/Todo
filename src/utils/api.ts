import { User, Todo } from '../types';

const API_URL = 'http://localhost:3000';

// Cookie helper functions
export const setAuthToken = (token: string) => {
  document.cookie = `authToken=${token};path=/;max-age=86400`;
};

export const getAuthToken = (): string | null => {
  const match = document.cookie.match(/authToken=([^;]+)/);
  return match ? match[1] : null;
};

export const clearAuthToken = () => {
  document.cookie = 'authToken=;path=/;max-age=0';
};

// API calls
export const register = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Username already exists');
  }

  const user = await response.json();
  setAuthToken(user.token);
  return user;
};

export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const user = await response.json();
  setAuthToken(user.token);
  return user;
};

export const logout = async () => {
  const token = getAuthToken();
  if (!token) return;

  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  clearAuthToken();
};

export const getTodos = async (): Promise<Todo[]> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return response.json();
};

export const createTodo = async (title: string, description: string): Promise<Todo> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  return response.json();
};

export const updateTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};