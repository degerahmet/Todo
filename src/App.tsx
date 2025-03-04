import React, { useState, useEffect } from 'react';
import { User } from './types';
import { getAuthToken } from './utils/api';
import AuthForm from './components/AuthForm';
import TodoList from './components/TodoList';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = getAuthToken();
    if (token) {
      // For simplicity, we'll just create a basic user object
      // In a real app, you'd want to validate the token with the server
      setUser({ id: 0, username: 'User', token });
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return user ? (
    <TodoList user={user} onLogout={handleLogout} />
  ) : (
    <AuthForm onAuthSuccess={handleAuthSuccess} />
  );
}

export default App;