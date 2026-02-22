"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signup", {
        email,
        username,
        password,
        confirm_password: confirmPassword,
      });
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          `Signup failed: ${err.message}. (Target: ${api.defaults.baseURL})`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 overflow-hidden">
      {/* Animated card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md p-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-center text-white/80 mb-8">
          Join us to manage your tasks efficiently
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
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-white/40 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              placeholder="johndoe"
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-white mb-1">
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-white/40 rounded-xl bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                placeholder="••••••"
                required
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-white/80 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-300 hover:text-indigo-100 font-semibold hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
