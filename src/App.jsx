import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Pastikan Anda sudah menginstal axios: npm install axios

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  const API_URL = 'http://localhost:8080/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await axios.post(API_URL, { text: inputValue, completed: false });
        setTodos([...todos, response.data]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(`${API_URL}/${todo.id}`, updatedTodo);
      setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (todo) => {
    setIsEditing(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = async (id) => {
    if (editValue.trim() !== '') {
      try {
        const updatedTodo = { text: editValue };
        await axios.put(`${API_URL}/${id}`, updatedTodo);
        setTodos(todos.map((t) => (t.id === id ? { ...t, text: editValue } : t)));
        setIsEditing(null);
        setEditValue('');
      } catch (error) {
        console.error('Error saving edit:', error);
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditValue('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center text-gray-50 mb-8">To-Do App</h1>

        {/* Form Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-grow p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tugas baru..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo} className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200">
            Tambah
          </button>
        </div>

        {/* Daftar Tugas */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600 transition-transform transform hover:scale-[1.01]">
              {isEditing === todo.id ? (
                // Mode Edit
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                    className="flex-grow p-2 bg-gray-600 border border-gray-500 rounded text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-400"
                  />
                  <button onClick={() => saveEdit(todo.id)} className="text-green-400 hover:text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                // Mode Tampilan Normal
                <>
                  <span className={`flex-1 cursor-pointer select-none text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`} onClick={() => toggleTodo(todo)}>
                    {todo.text}
                  </span>

                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(todo)} className="text-yellow-400 hover:text-yellow-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2M6 7h12" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length === 0 && <p className="text-center text-gray-500 mt-6">Saatnya menambahkan tugas! 🚀</p>}
      </div>
    </div>
  );
}

export default App;
