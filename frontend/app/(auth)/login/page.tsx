"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import api from "../../../lib/api";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { access_token, refresh_token } = response.data;
      login(access_token, refresh_token);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 overflow-hidden">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md p-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-white tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-white/80 mb-8">
          Sign in to continue to your dashboard
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm font-medium text-white mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-white/40 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="john@example.com"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-white/40 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="••••••"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-white/80 text-sm">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-300 hover:text-indigo-100 font-semibold hover:underline transition-colors"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
