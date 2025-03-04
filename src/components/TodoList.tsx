import React, { useState, useEffect } from 'react';
import { Todo, User } from '../types';
import { getTodos, createTodo, updateTodo, deleteTodo, logout } from '../utils/api';
import { CheckCircle2, Circle, Trash2, LogOut, Plus, Pencil } from 'lucide-react';

interface TodoListProps {
  user: User;
  onLogout: () => void;
}

export default function TodoList({ user, onLogout }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos();
      setTodos(loadedTodos);
    } catch (err) {
      setError('Failed to load todos');
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTodo = await createTodo(title, description);
      setTodos([...todos, newTodo]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create todo');
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: editingTodo?.title || todo.title,
        description: editingTodo?.description || todo.description,
        completed: todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      setEditingTodo(null);
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (err) {
      setError('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo List</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">Welcome, {user.username}!</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-600">{error}</div>
        )}

        <form onSubmit={handleCreateTodo} className="mt-6 space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Todo title"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Todo description"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Todo
          </button>
        </form>

        <div className="mt-8 space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white shadow rounded-lg p-6 flex items-start justify-between"
            >
              <div className="flex-1">
                {editingTodo?.id === todo.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingTodo.title}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, title: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <textarea
                      value={editingTodo.description}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          description: e.target.value,
                        })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateTodo(todo)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTodo(null)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {todo.title}
                    </h3>
                    <p className="mt-1 text-gray-500">{todo.description}</p>
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={() => handleToggleComplete(todo)}
                  className={`text-${
                    todo.completed ? 'green' : 'gray'
                  }-500 hover:text-${todo.completed ? 'green' : 'gray'}-600`}
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => setEditingTodo(todo)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}