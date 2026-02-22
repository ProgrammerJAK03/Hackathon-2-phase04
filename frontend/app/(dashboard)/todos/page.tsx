"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function TodosPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDesc, setNewTodoDesc] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);

  // inside component
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);


  // Apply dark/light mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) fetchTodos();
  }, [user, loading]);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos/");
      setTodos(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch todos");
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await api.post("/todos/", {
        title: newTodoTitle,
        description: newTodoDesc,
      });
      setTodos([...todos, response.data]);
      setNewTodoTitle("");
      setNewTodoDesc("");
    } catch (err) {
      console.error(err);
      setError("Failed to add todo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const newStatus = todo.status === "completed" ? "pending" : "completed";
      const response = await api.put(`/todos/${todo.id}`, { status: newStatus });
      setTodos(todos.map((t) => (t.id === todo.id ? response.data : t)));
    } catch (err) {
      console.error(err);
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 font-sans text-gray-900 dark:text-gray-100 relative overflow-x-hidden">
      {/* Floating background circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-indigo-300 dark:bg-indigo-700 rounded-full opacity-30 animate-pulse-slow blur-3xl"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-pink-300 dark:bg-pink-700 rounded-full opacity-30 animate-pulse-slow blur-3xl"></div>

      {/* Navbar */}
      <nav className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Tasks
              </h1>
            </div>

            {/* Profile Icon + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:ring-2 hover:ring-indigo-400 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M12 12a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    {/* <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {darkMode ? "Light Mode" : "Dark Mode"}
                    </button> */}
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-6 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm"
          >
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </motion.div>
        )}

        {/* Add Task Form */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 hover:shadow-2xl transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Add New Task
          </h2>
          <form onSubmit={addTodo} className="space-y-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full px-4 py-3 bg-gray-50/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300"
            />
            <textarea
              value={newTodoDesc}
              onChange={(e) => setNewTodoDesc(e.target.value)}
              placeholder="Add details (optional)..."
              className="w-full px-4 py-3 bg-gray-50/70 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-400 transition-all outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 min-h-[80px] resize-y"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newTodoTitle.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Todos List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 pl-1">My Tasks</h2>

          <AnimatePresence>
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-16 bg-white/70 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
              >
                <p className="text-gray-400 dark:text-gray-300 text-lg animate-pulse">
                  No tasks yet. Add one above!
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                {todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`group bg-white/80 dark:bg-gray-800/70 backdrop-blur-md p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 hover:shadow-2xl transition-all ${todo.status === "completed" ? "bg-gray-50/60 dark:bg-gray-900/50" : ""
                      }`}
                  >
                    <div className="flex-1 flex gap-4 min-w-0">
                      <div className="pt-1">
                        <motion.input
                          type="checkbox"
                          checked={todo.status === "completed"}
                          onChange={() => toggleTodo(todo)}
                          className="h-6 w-6 rounded-lg border-gray-300 dark:border-gray-500 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          whileTap={{ scale: 1.2 }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-lg font-medium truncate pr-4 ${todo.status === "completed"
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-900 dark:text-gray-100"
                            }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p
                            className={`mt-1 text-sm ${todo.status === "completed"
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : "text-gray-600 dark:text-gray-300"
                              }`}
                          >
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-gray-400 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete task"
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
